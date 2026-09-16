# Low Mood Companion 🌟

A compassionate web app that listens to you when you're feeling low and suggests actionable steps to help shift your mood.

## Features

✨ **Conversational AI** — Talk to an empathetic companion about what's bothering you  
🔊 **Audio Toggle** — Turn audio on/off so you can use it privately in public  
💡 **Smart Action Suggestions** — Personalized suggestions based on your mood  
🫁 **Guided Exercises** — Breathing, stretching, and mindfulness guidance  
📱 **Mobile-Friendly** — Works on phone, tablet, or desktop

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
CLAUDE_API_KEY=sk-ant-api03-...your-key...
ELEVENLABS_API_KEY=fccd704753c6...your-key...
PORT=3001
```

### 3. Run the App

**Option A: Run both frontend + backend together**
```bash
npm run dev:full
```

**Option B: Run separately (in two terminals)**

Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## How It Works

1. **Open the app** — You see an empathetic greeting
2. **Share what's on your mind** — Type what's bothering you
3. **Get a response** — Claude responds with empathy and understanding
4. **Toggle audio** — Use the 🔊 button to enable/disable voice
5. **Try an action** — Click one of the suggested actions
6. **Feel better** — Repeat as needed

## Suggested Actions

- 🫁 **Breathing Exercise** — 4-7-8 breathing to calm your system
- 🚶 **Take a Walk** — Move your body for 5-10 minutes
- 🎵 **Listen to Music** — Play something uplifting
- 💧 **Hydrate & Stretch** — Drink water and move gently
- 📞 **Reach Out** — Text or call someone you trust
- 📝 **Write It Down** — Journal about your feelings

## API Integration

### Claude API
- Used for conversational intelligence and empathy
- Model: `claude-3-5-sonnet-20241022`
- Keeps conversations brief and actionable

### ElevenLabs API
- Provides Sarah's voice for reading responses aloud
- Only generates audio when enabled
- Supports privacy-first usage (audio toggle)

## Project Structure

```
low-mood-app/
├── src/
│   ├── components/
│   │   └── ConversationInterface.jsx
│   ├── styles/
│   │   └── ConversationInterface.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── server.js          # Node.js + Express backend
├── vite.config.js     # Vite configuration
├── package.json
├── .env.example       # Template for environment variables
└── index.html
```

## Notes

- **For Personal Use:** This app is built for your personal use, so you can customize it as needed
- **Privacy:** Conversations are not stored permanently
- **Audio:** Only generates audio when explicitly enabled
- **Safety:** If crisis thoughts appear, the app encourages professional support

## Future Enhancements

- Save favorite actions for quick access
- Remember which actions helped you before
- Track mood patterns over time
- Daily check-ins and reminders
- Guided meditation audio

## Support

For issues or questions, check the logs:
- **Frontend errors** → Browser console (F12)
- **Backend errors** → Terminal output

Enjoy your Low Mood Companion! 🌟
