# Telegram Webhook Setup Guide

## Overview
This guide explains how to set up the Telegram webhook for automatic user verification in your Zoggy Casino application.

## Prerequisites
- Telegram bot created via @BotFather
- Bot token configured in your environment
- ngrok installed for local development

## Setup Steps

### 1. Install and Configure ngrok
```bash
# Install ngrok (if not already installed)
npm install -g ngrok

# Start ngrok tunnel to your local server
ngrok http 3000
```

### 2. Register Webhook with Telegram
Once ngrok is running, you'll get a URL like: `https://df0f4e98a111.ngrok-free.app`

Register the webhook:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://df0f4e98a111.ngrok-free.app/api/telegram/webhook"}'
```

### 3. Add Webhook Route to Your Server
Make sure to include the webhook route in your main server file:

```javascript
// In your main server file (app.js or server.js)
const telegramWebhook = require('./routes/telegramWebhook');
app.use('/api/telegram', telegramWebhook);
```

### 4. Environment Variables
Ensure these are set in your `.env` file:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_CHANNEL_ID=@your_channel_id
TELEGRAM_CHANNEL_HANDLE=@your_channel_handle
JWT_SECRET=your_jwt_secret
```

## How It Works

### User Flow
1. User clicks "Join Telegram" button in frontend
2. Frontend calls `/api/telegram/deeplink` to get bot URL with JWT token
3. User is redirected to: `https://t.me/your_bot?start=<jwt_token>`
4. User clicks `/start` in Telegram bot
5. Telegram sends webhook POST to your server with the message
6. Webhook extracts JWT token, verifies it, and marks user as verified
7. Bot sends confirmation message to user
8. Frontend polling detects verification and closes modal

### Webhook Processing
- Receives POST requests from Telegram at `/api/telegram/webhook`
- Processes `/start <jwt_token>` commands
- Verifies JWT tokens and user authentication
- Checks channel membership (if configured)
- Updates user verification status in database
- Sends success/failure messages via bot

## Testing

### 1. Check Webhook Status
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### 2. Test Verification Flow
1. Open your frontend application
2. Click "Join Telegram" button
3. Follow the bot link
4. Click `/start` in the bot
5. Verify you receive confirmation message
6. Check that frontend modal closes automatically

## Troubleshooting

### Common Issues

**Webhook not receiving requests:**
- Check ngrok is running and URL is correct
- Verify webhook is registered with Telegram
- Check server logs for errors

**JWT verification fails:**
- Ensure JWT_SECRET matches between frontend and backend
- Check token expiration (1 hour default)
- Verify user authVersion matches

**Channel membership check fails:**
- Ensure TELEGRAM_CHANNEL_ID is correct
- Bot must be admin in the channel to check membership
- Check bot permissions

### Debug Webhook
Add logging to see incoming requests:
```javascript
router.post('/webhook', (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));
  // ... rest of webhook logic
});
```

## Production Deployment

For production, replace ngrok with your actual domain:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-domain.com/api/telegram/webhook"}'
```

## Security Notes

- Webhook endpoint should validate requests are from Telegram
- JWT tokens expire after 1 hour for security
- Store sensitive data in environment variables
- Use HTTPS for all webhook endpoints
- Consider rate limiting webhook endpoint

## Support

If you encounter issues:
1. Check server logs for errors
2. Verify webhook registration with Telegram
3. Test JWT token generation and verification
4. Ensure all environment variables are set correctly
