export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, audioEnabled } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message required' })
    }

    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

    if (!CLAUDE_API_KEY || !ELEVENLABS_API_KEY) {
      return res.status(500).json({
        error: 'API keys not configured',
        hasClaudeKey: !!CLAUDE_API_KEY,
        hasElevenKey: !!ELEVENLABS_API_KEY
      })
    }

    const SYSTEM_PROMPT = `You are a compassionate AI companion. Respond briefly (2-3 sentences). Suggest actions using:
SUGGESTED_ACTIONS: ["breathing", "walk", "music", "water", "reach-out", or "journal"]`

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }]
      })
    })

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorText}`)
    }

    const claudeData = await claudeResponse.json()
    const aiResponse = claudeData.content[0].text

    // Extract suggested actions
    const actionsMatch = aiResponse.match(/SUGGESTED_ACTIONS:\s*\[(.*?)\]/)
    const suggestedActions = actionsMatch
      ? actionsMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(s => s.length > 0)
      : []

    const cleanResponse = aiResponse.replace(/SUGGESTED_ACTIONS:.*?\]/s, '').trim()

    let audioUrl = null

    if (audioEnabled) {
      try {
        const elevenResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: cleanResponse,
            model_id: 'eleven_monolingual_v1',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          })
        })

        if (elevenResponse.ok) {
          const audioBuffer = await elevenResponse.arrayBuffer()
          const base64Audio = Buffer.from(audioBuffer).toString('base64')
          audioUrl = `data:audio/mp3;base64,${base64Audio}`
        }
      } catch (e) {
        console.error('Audio error:', e.message)
      }
    }

    res.status(200).json({
      response: cleanResponse,
      audioUrl,
      suggestedActions
    })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      error: 'Failed to process request',
      message: error.message
    })
  }
}
