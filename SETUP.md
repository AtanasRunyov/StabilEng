# Setup Instructions

## Prerequisites

Before you begin, you'll need:

1. **OpenAI API Key** - Get it from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Twilio Account** - Sign up at [Twilio](https://www.twilio.com/try-twilio)
3. **ngrok** - Download from [ngrok.com](https://ngrok.com/download)

## Environment Configuration

The `.env` file needs the following variables:

```env
# Supabase (Already configured)
VITE_SUPABASE_URL=https://sxsuliwnpdlwmodkfzob.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ngrok URL (update after starting ngrok)
NGROK_URL=https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app
PORT=8000
```

## Installation Steps

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Configure Twilio

1. Log in to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Account > Account Info** to get your Account SID and Auth Token
3. Go to **Phone Numbers > Manage > Buy a number** to get a phone number
4. Update `.env` with these values

### 4. Configure OpenAI

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Update `OPENAI_API_KEY` in `.env`

### 5. Start ngrok

In a new terminal, expose port 8000:

```bash
ngrok http 8000
```

Copy the HTTPS URL (e.g., `https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app`) and update `NGROK_URL` in `.env`

## Running the Application

### Start the Backend (Python/FastAPI)

```bash
uvicorn main:app --port 8000 --reload
```

The backend API will be available at `http://localhost:8000`

### Start the Frontend (React/Vite)

In a new terminal:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing the Application

1. Open your browser to `http://localhost:3000`
2. Enter a phone number in the format: `(555) 123-4567`
3. Click "Make Call"
4. Answer the phone and have a conversation with the AI assistant
5. View call history in the "Call History" tab

## Database

The application uses Supabase for storing call logs. The database schema includes:

- **call_logs** table with columns:
  - `id` - Unique identifier
  - `to_phone_number` - Called number
  - `call_sid` - Twilio call SID
  - `status` - Call status
  - `duration` - Call duration in seconds
  - `recording_url` - URL to call recording
  - `created_at` - Timestamp
  - `updated_at` - Last update timestamp

## Troubleshooting

### "Missing OpenAI API key" error
Make sure your `.env` file contains a valid `OPENAI_API_KEY`

### "Missing Twilio configuration" error
Verify that `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` are set in `.env`

### Calls not connecting
1. Ensure ngrok is running and the URL in `.env` matches the ngrok URL
2. Check that your Twilio phone number is active
3. Verify your OpenAI API key has access to the Realtime API

### Frontend can't connect to backend
Make sure the backend is running on port 8000 and the frontend proxy is configured correctly in `vite.config.ts`

## Project Structure

```
.
├── main.py                 # FastAPI backend server
├── prompts/
│   └── system_prompt.txt   # AI assistant instructions
├── src/
│   ├── App.tsx            # Main React component
│   ├── components/
│   │   ├── CallForm.tsx   # Make call form
│   │   └── CallHistory.tsx # Call history display
│   ├── lib/
│   │   └── supabase.ts    # Supabase client
│   └── main.tsx           # React entry point
├── requirements.txt        # Python dependencies
└── package.json           # Node.js dependencies
```

## Customization

### Change AI Voice

Edit the `VOICE` variable in `main.py`:

```python
VOICE = "echo"  # Options: alloy, echo, shimmer
```

### Modify AI Behavior

Edit `prompts/system_prompt.txt` to change how the AI responds during calls.

## Support

For issues or questions:
- Check the [Twilio Docs](https://www.twilio.com/docs)
- Review [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- Visit the [Supabase Docs](https://supabase.com/docs)
