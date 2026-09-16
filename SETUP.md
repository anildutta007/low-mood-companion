# Setup Guide - Low Mood Companion 🌟

Follow these steps to get your personal Low Mood Companion app running.

## Prerequisites

Make sure you have:
- **Node.js** (v16+) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- Your **Claude API Key** ✓ (you have this)
- Your **ElevenLabs API Key** ✓ (you have this)

## Step 1: Navigate to Project Directory

Open PowerShell/Terminal and go to the project folder:

```powershell
cd "C:\Users\dutt_\Quiz Game\low-mood-app"
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React & React DOM
- Vite (build tool)
- Express (backend)
- Axios (HTTP client)
- And more...

*This takes 2-3 minutes on first install.*

## Step 3: Create Environment File

Create a `.env` file in the project root with your API keys:

```bash
# In PowerShell:
New-Item -Name ".env" -ItemType File

# Then edit it with your keys:
```

**Content of `.env`:**
```
CLAUDE_API_KEY=your_claude_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
PORT=3001
```

Get your keys from:
- **Claude API Key**: https://console.anthropic.com/
- **ElevenLabs API Key**: Your ElevenLabs workspace settings

⚠️ **Keep this file private!** Add it to `.gitignore` if using git.

## Step 4: Run the App

**Easy way (both backend + frontend together):**

```bash
npm run dev:full
```

This starts:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:3000`

**The app opens automatically in your browser** → Just start talking! 💬

---

**Alternative: Run separately** (if you want more control)

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Step 5: Start Using It

1. Open `http://localhost:3000` in your browser
2. Type a message about what's on your mind
3. Click the send arrow → you'll get an empathetic response
4. Toggle audio with the 🔊 button (for private use)
5. Click a suggested action to try it

## Troubleshooting

### "npm: The term 'npm' is not recognized"
→ Node.js might not be installed. [Download it here](https://nodejs.org/)

### "Cannot find module 'express'"
→ Run `npm install` again

### "API Error" or "Failed to process request"
→ Check:
- Your API keys are correct in `.env`
- The backend server is running (check Terminal 1)
- You have internet connection

### Backend won't start on port 3001
→ Port might be in use. Change `PORT=3002` in `.env` and try again

### No audio output
→ Check:
- Audio toggle is ON (🔊)
- Your speakers are enabled
- Browser volume isn't muted
- Try refreshing the page

## API Keys: Protecting Them

Your `.env` file contains sensitive keys. **Never:**
- Share it publicly
- Commit it to GitHub
- Paste it in forums or messages

**To regenerate keys if exposed:**

**Claude:**
1. Go to https://console.anthropic.com/
2. Click on your API key
3. Regenerate it

**ElevenLabs:**
1. Go to ElevenLabs Settings → API
2. Click "Regenerate API Key"

## What's Running Where?

- **Backend (Port 3001)**: Node.js + Express server
  - Handles Claude API calls
  - Handles ElevenLabs TTS
  - Manages conversation context

- **Frontend (Port 3000)**: React web app
  - Beautiful UI for chatting
  - Audio player
  - Action suggestions display

- **Proxy**: Vite automatically forwards `/api/*` calls to port 3001

## Customizing the App

### Change the Voice
In `server.js`, find this line:
```javascript
const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah's voice ID
```

Replace with a different voice ID from your ElevenLabs workspace.

### Change the Styling
Edit `src/styles/ConversationInterface.css` to customize colors, fonts, layout.

### Change System Prompt
In `server.js`, modify the `SYSTEM_PROMPT` variable to adjust how the AI responds.

## Next Steps

Once it's running:
1. ✅ Test a few messages
2. ✅ Try the audio toggle
3. ✅ Click different action suggestions
4. ✅ Customize colors/voice if desired

## Stop Running the App

Press `Ctrl + C` in the terminal(s) to stop.

---

**Questions?** Check the README.md or browse the code comments.

**Enjoy your Low Mood Companion!** 🌟
