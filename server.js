import express from 'express'
import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Store conversation history for context
const conversationHistory = {}

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah's voice ID

const SYSTEM_PROMPT = `You are a compassionate AI companion helping someone through a moment of low mood. Your role is to:

1. Listen with genuine care and empathy
2. Help them feel less alone and understood
3. Ask clarifying questions to understand what they're experiencing
4. Respond with warmth and encouragement
5. Suggest 2-3 specific, actionable things they could try right now

Keep your responses brief (2-3 sentences) so the conversation feels natural. Be genuine, not overly cheerful. If they mention crisis thoughts (suicide, self-harm), gently encourage them to reach out to professional support and provide crisis numbers.

End your response with a JSON block like this:
SUGGESTED_ACTIONS: ["breathing", "walk", "music"]

Choose from: breathing, walk, music, water, reach-out, journal`

app.post('/api/chat', async (req, res) => {
  try {
    const { message, audioEnabled } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message required' })
    }

    // Call Claude API for conversation
    const claudeResponse = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    )

    const aiResponse = claudeResponse.data.content[0].text

    // Extract suggested actions from the response
    const actionsMatch = aiResponse.match(/SUGGESTED_ACTIONS:\s*\[(.*?)\]/)
    const suggestedActionsStr = actionsMatch ? actionsMatch[1] : ''
    const suggestedActions = suggestedActionsStr
      .split(',')
      .map(s => s.trim().replace(/['"]/g, ''))
      .filter(s => s.length > 0)

    // Remove the JSON block from the response text
    const cleanResponse = aiResponse.replace(/SUGGESTED_ACTIONS:.*?\]/s, '').trim()

    let audioUrl = null

    // Generate audio using ElevenLabs if enabled
    if (audioEnabled) {
      try {
        const elevenlabsResponse = await axios.post(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          {
            text: cleanResponse,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          },
          {
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
          }
        )

        // Convert audio buffer to base64 for client
        const audioBuffer = Buffer.from(elevenlabsResponse.data, 'binary')
        audioUrl = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`
      } catch (audioError) {
        console.error('ElevenLabs error:', audioError.message)
        // Continue without audio if TTS fails
      }
    }

    res.json({
      response: cleanResponse,
      audioUrl: audioUrl,
      suggestedActions: suggestedActions
    })
  } catch (error) {
    console.error('API Error:', error.message)
    res.status(500).json({
      error: 'Failed to process request',
      message: error.message
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
