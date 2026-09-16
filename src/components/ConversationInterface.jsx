import { useState, useRef, useEffect } from 'react'
import '../styles/ConversationInterface.css'

const ACTIONS = [
  { id: 'breathing', title: '🫁 Breathing Exercise', description: 'Calm your nervous system with guided 4-7-8 breathing', icon: '🫁' },
  { id: 'walk', title: '🚶 Take a Walk', description: 'Move your body outside for 5-10 minutes', icon: '🚶' },
  { id: 'music', title: '🎵 Listen to Music', description: 'Play your favorite uplifting song', icon: '🎵' },
  { id: 'water', title: '💧 Hydrate & Stretch', description: 'Drink water and do gentle stretches', icon: '💧' },
  { id: 'reach-out', title: '📞 Reach Out to Someone', description: 'Text or call someone you trust', icon: '📞' },
  { id: 'journal', title: '📝 Write It Down', description: 'Journal about what you\'re feeling', icon: '📝' }
]

const RESPONSES = {
  anxiety: "It's understandable to feel anxious. What you're experiencing is real, and taking small steps can help. Try grounding yourself in the present moment.",
  overwhelmed: "Feeling overwhelmed means you're caring deeply about things. Breaking tasks into smaller steps often helps. You don't have to do everything at once.",
  sad: "Sadness is a part of life, and it's okay to feel it. Sometimes the smallest actions—like getting outside or connecting with someone—can shift your mood.",
  depressed: "What you're feeling is valid. Even small actions matter. Moving your body, getting sunlight, or talking to someone can help more than you realize.",
  stressed: "Stress tells us we care. Taking a pause—whether through breathing, a short walk, or talking to someone—can ease what you're carrying.",
  lonely: "Loneliness is painful, but you don't have to carry it alone. Reaching out to one person, even briefly, can remind you that you matter.",
  tired: "Exhaustion is your body asking for rest. Be gentle with yourself. Sometimes the best action is to rest, move gently, or do something that brings you peace.",
  default: "I hear you. What you're feeling matters. Small actions can shift how you feel—try one of the suggestions that resonates with you."
}

function getResponse(userMessage) {
  const msg = userMessage.toLowerCase()
  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('nervous') || msg.includes('panic')) return RESPONSES.anxiety
  if (msg.includes('overwhelm') || msg.includes('too much')) return RESPONSES.overwhelmed
  if (msg.includes('sad') || msg.includes('depressed') || msg.includes('sad')) return RESPONSES.sad
  if (msg.includes('depress')) return RESPONSES.depressed
  if (msg.includes('stress') || msg.includes('worried') || msg.includes('worry')) return RESPONSES.stressed
  if (msg.includes('lonely') || msg.includes('alone') || msg.includes('isolated')) return RESPONSES.lonely
  if (msg.includes('tired') || msg.includes('exhausted') || msg.includes('fatigue')) return RESPONSES.tired
  return RESPONSES.default
}

export default function ConversationInterface() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi, I\'m here to listen and help. What\'s on your mind right now?', isInitial: true }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [suggestedActions, setSuggestedActions] = useState([])
  const [audioPlaying, setAudioPlaying] = useState(false)
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    // Simulate response delay
    setTimeout(() => {
      const response = getResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setSuggestedActions(ACTIONS.slice(0, 3))
      setLoading(false)
    }, 1000)
  }

  const handleActionClick = (action) => {
    setMessages(prev => [...prev, { role: 'user', content: `I'm going to try: ${action.title}`, isAction: true }])
  }

  return (
    <div className="conversation-container">
      <div className="header">
        <h1>🌟 Low Mood Companion</h1>
        <button
          className={`audio-toggle ${audioEnabled ? 'enabled' : 'disabled'}`}
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Click to disable audio' : 'Click to enable audio'}
        >
          {audioEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
        </button>
      </div>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.role}`}>
            <div className="message-content">
              {msg.role === 'assistant' ? '💭' : '👤'} {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-assistant">
            <div className="message-content loading">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {suggestedActions.length > 0 && !loading && (
        <div className="actions-section">
          <h3>💡 Suggested Actions</h3>
          <div className="actions-grid">
            {suggestedActions.map(action => (
              <button
                key={action.id}
                className="action-card"
                onClick={() => handleActionClick(action)}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-title">{action.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me what's on your mind..."
          disabled={loading}
          className="message-input"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="send-button"
        >
          {loading ? '...' : '→'}
        </button>
      </form>

      <audio
        ref={audioRef}
        onEnded={() => setAudioPlaying(false)}
        crossOrigin="anonymous"
      />
    </div>
  )
}
