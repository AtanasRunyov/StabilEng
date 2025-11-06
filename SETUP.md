# AI Calling Agent - Inbound Call Setup Guide

## Overview

This is a fully functional **inbound call handling system** that uses:
- **Twilio** for receiving customer calls
- **OpenAI Realtime API** for AI conversation
- **Supabase** for call logging and storage
- **React + TypeScript** for the web dashboard

Customers call your Twilio number → AI answers and converses → Calls are recorded and logged.

## Prerequisites

1. **Twilio Account** - https://www.twilio.com/try-twilio
2. **OpenAI API Key** - https://platform.openai.com/api-keys
3. **ngrok** - https://ngrok.com/download (for exposing local server to internet)
4. **Node.js & npm** - https://nodejs.org/

## Step-by-Step Setup

### 1. Get Your Twilio Phone Number

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Phone Numbers > Manage > Buy a number**
3. Select a US number
4. Save the number (e.g., `+1234567890`)

### 2. Get Twilio Credentials

1. In Twilio Console, go to **Account > Account Info**
2. Copy your **Account SID** and **Auth Token**
3. Update `.env`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Update `.env`:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Start ngrok

Open a terminal and run:
```bash
ngrok http 8000
```

This gives you a URL like: `https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app`

Update `.env`:
```
NGROK_URL=https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app
```

### 5. Configure Twilio Webhooks

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Phone Numbers > Manage > Active Numbers**
3. Click on your phone number
4. Under **Voice Configuration**, set:
   - **When a call comes in** → `https://your-ngrok-url.com/incoming-call` (HTTP POST)
   - **Call Status Changes** → `https://your-ngrok-url.com/call-status` (HTTP POST)
5. Under **Recording**, enable:
   - **Record calls** → Yes
   - **Trim silence** → Yes (optional)
   - **Recording Status Callback** → `https://your-ngrok-url.com/recording-status` (HTTP POST)

### 6. Verify Environment Variables

Your `.env` file should look like:
```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OPENAI_API_KEY=sk-proj-...
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
NGROK_URL=https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app
PORT=8000
```

## Running the Application

### Terminal 1: Start ngrok
```bash
ngrok http 8000
```
(Keep this running)

### Terminal 2: Start Python Backend
```bash
uvicorn main:app --port 8000 --reload
```

Output should show:
```
============================================================
AI VOICE ASSISTANT - INBOUND CALL MODE
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 3: Start React Frontend
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Testing Inbound Calls

1. Verify the **System Status** tab shows "Online" and "Accepting calls 24/7"
2. Call your Twilio phone number from any phone
3. You should hear: "Hello! Thank you for calling. Please hold while we connect you to our AI assistant."
4. Start talking - the AI will respond in real-time
5. View the call in the **Call History** tab with:
   - Caller's phone number
   - Call duration
   - Recording URL
   - Call status

## Understanding the Architecture

### Backend (Python/FastAPI)

**Key Endpoints:**
- `GET /` - Health check
- `GET /calls/active` - Get active call count
- `POST /incoming-call` - Twilio webhook for new calls
- `POST /call-status` - Twilio call status updates
- `POST /recording-status` - Twilio recording completion
- `WS /media-stream` - WebSocket for audio streaming

**Flow:**
1. Customer calls your Twilio number
2. Twilio sends webhook to `/incoming-call`
3. Server returns TwiML with WebSocket stream URL
4. Audio flows through `/media-stream` WebSocket
5. Backend forwards audio to OpenAI Realtime API
6. AI responses are sent back to customer
7. Recording is completed and logged to Supabase

### Frontend (React/TypeScript)

**Components:**
- `CallForm` - System status and setup instructions
- `CallHistory` - List of all inbound calls with recordings

**Features:**
- Real-time call count display
- Live call history with filtering
- Recording playback links
- Call duration and status tracking

### Database (Supabase)

**call_logs table:**
```sql
id                 UUID (Primary Key)
from_phone_number  TEXT (Caller's number)
to_phone_number    TEXT (Your Twilio number)
call_sid           TEXT (Twilio call identifier)
status             TEXT (queued, ringing, in-progress, completed, failed)
call_type          TEXT (inbound)
stream_sid         TEXT (Media stream identifier)
duration           INTEGER (Seconds)
recording_url      TEXT (Twilio recording URL)
created_at         TIMESTAMP
updated_at         TIMESTAMP
```

## Customizing the AI

Edit `prompts/system_prompt.txt` to change how the AI responds:

```txt
You are a helpful customer service AI assistant.
Answer questions about our products/services.
Be friendly and professional.
Keep responses concise.
```

## Troubleshooting

### Calls not connecting
- ✓ Verify ngrok is running
- ✓ Check ngrok URL matches in `.env` and Twilio
- ✓ Ensure OPENAI_API_KEY is valid
- ✓ Check backend logs for errors

### Can't access dashboard
- ✓ Frontend running on http://localhost:3000
- ✓ Backend running on http://localhost:8000
- ✓ Check browser console for errors

### Recordings not saving
- ✓ Verify recording callback URL in Twilio
- ✓ Check Supabase connection in backend logs
- ✓ Ensure `call_logs` table exists

### AI not responding
- ✓ Check OpenAI API quota
- ✓ Verify Realtime API access (not all plans include it)
- ✓ Check system prompt is loaded correctly

## Deployment

For production, you'll need:
1. **Server hosting** (AWS EC2, DigitalOcean, Heroku, etc.)
2. **Domain name** with HTTPS SSL certificate
3. **Environment variables** set on server
4. **Database** (Supabase included)
5. **CI/CD pipeline** for deployments

Example for Heroku:
```bash
heroku create your-app-name
heroku config:set OPENAI_API_KEY=sk-proj-...
heroku config:set TWILIO_ACCOUNT_SID=AC...
# ... set other env vars
git push heroku main
```

## Performance Notes

- **Concurrent calls**: Limited by OpenAI API usage limits
- **Recording storage**: Stored in Twilio (verify retention policy)
- **Database**: Supabase free tier supports ~1000 concurrent connections
- **AI response time**: Typically 1-3 seconds with Realtime API

## Cost Considerations

- **Twilio**: $1/month per number + $0.01 per inbound minute
- **OpenAI**: $0.30 per 1M input tokens + $1.20 per 1M output tokens
- **Supabase**: Free tier includes 500MB database

## Support Resources

- [Twilio Docs](https://www.twilio.com/docs)
- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [Supabase Docs](https://supabase.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)

## Next Steps

1. ✓ Configure Twilio webhooks
2. ✓ Start ngrok, backend, and frontend
3. ✓ Test by calling your Twilio number
4. ✓ Customize system prompt
5. ✓ Monitor calls in dashboard
6. ✓ Review recordings

Your AI calling agent is now ready to receive and handle customer calls!
