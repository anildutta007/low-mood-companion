import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import '../styles/ConversationInterface.css'

const ACTIONS = [
  {
    id: 'breathing',
    title: '🫁 Breathing Exercise',
    description: 'Calm your nervous system with guided 4-7-8 breathing',
    icon: '🫁'
  },
  {
    id: 'walk',
    title: '🚶 Take a Walk',
    description: 'Move your body outside for 5-10 minutes',
    icon: '🚶'
  },
  {
    id: 'music',
    title: '🎵 Listen to Music',
    description: 'Play your favorite uplifting song',
    icon: '🎵'
  },
  {
    id: 'water',
    title: '💧 Hydrate & Stretch',
    description: 'Drink water and do gentle stretches',
    icon: '💧'
  },
  {
    id: 'reach-out',
    title: '📞 Reach Out to Someone',
    description: 'Text or call someone you trust',
    icon: '📞'
  },
  {
    id: 'journal',
    title: '📝 Write It Down',
    description: 'Journal about what you\'re feeling',
    icon: '📝'
  }
]

export default function ConversationInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I\'m here to listen and help. What\'s on your mind right now?',
      isInitial: true
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [suggestedActions, setSuggestedActions] = useState([])
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const callAPI = async (userMessage) => {
    try {
      const response = await axios.post('/api/chat', {
        message: userMessage,
        audioEnabled: audioEnabled
      })

      return {
        text: response.data.response,
        audioUrl: response.data.audioUrl,
        suggestedActions: response.data.suggestedActions || []
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        text: 'Sorry, I encountered an error. Please try again.',
        audioUrl: null,
        suggestedActions: []
      }
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }])

    setLoading(true)

    const result = await callAPI(userMessage)

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: result.text,
      audioUrl: result.audioUrl
    }])

    setSuggestedActions(result.suggestedActions || ACTIONS.slice(0, 3))

    if (audioEnabled && result.audioUrl) {
      playAudio(result.audioUrl)
    }

    setLoading(false)
  }

  const playAudio = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setAudioPlaying(true)
    }
  }

  const handleActionClick = (action) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: `I'm going to try: ${action.title}`,
      isAction: true
    }])
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
