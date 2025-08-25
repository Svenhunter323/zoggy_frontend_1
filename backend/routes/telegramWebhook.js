const express = require('express');
const jwt = require('jsonwebtoken');
const cfg = require('../config');
const User = require('../models/User');
const { getBot, isMember } = require('../services/telegram');

const router = express.Router();

// POST /api/telegram/webhook
router.post('/webhook', async (req, res) => {
  try {
    const { message, callback_query } = req.body;
    const bot = getBot();
    
    if (!bot) {
      console.error('[telegram-webhook] Bot not configured');
      return res.sendStatus(200);
    }

    // Handle /start command with JWT token
    if (message?.text?.startsWith('/start ')) {
      const token = message.text.replace('/start ', '').trim();
      const telegramUserId = message.from.id;
      const telegramUsername = message.from.username;
      
      console.log(`[telegram-webhook] Processing /start command from user ${telegramUserId}`);
      
      try {
        // Verify JWT token
        const payload = jwt.verify(token, cfg.jwtSecret);
        const userId = payload.sub;
        
        console.log(`[telegram-webhook] Valid token for user ${userId}`);
        
        // Check if user exists and token version matches
        const user = await User.findById(userId);
        if (!user || user.authVersion !== payload.v) {
          await bot.telegram.sendMessage(
            telegramUserId, 
            '❌ Invalid or expired verification token. Please get a new link from the website.'
          );
          return res.sendStatus(200);
        }

        // Check if user is a member of the channel (if configured)
        let isMemberOfChannel = true;
        if (cfg.telegram.channelId) {
          try {
            isMemberOfChannel = await isMember(
              bot.telegram,
              cfg.telegram.channelId,
              telegramUserId
            );
          } catch (error) {
            console.error('[telegram-webhook] Error checking membership:', error);
            // Continue with verification even if membership check fails
          }
        }

        if (!isMemberOfChannel) {
          await bot.telegram.sendMessage(
            telegramUserId,
            `❌ Please join our channel first: ${cfg.telegram.channelHandle || '@zoggycasino'}\n\nThen click the verification link again.`
          );
          return res.sendStatus(200);
        }

        // Update user with verification and Telegram info
        await User.findByIdAndUpdate(userId, {
          telegramJoinedOk: true,
          telegramUserId: telegramUserId,
          telegramUsername: telegramUsername || null,
          verifiedAt: new Date()
        });

        // Send success message
        await bot.telegram.sendMessage(
          telegramUserId,
          '✅ Verification successful!\n\nYou can now return to the website and start opening chests. Welcome to Zoggy Casino! 🎰'
        );

        console.log(`[telegram-webhook] User ${userId} verified successfully`);

      } catch (jwtError) {
        console.error('[telegram-webhook] JWT verification failed:', jwtError);
        await bot.telegram.sendMessage(
          telegramUserId,
          '❌ Invalid verification token. Please get a new link from the website.'
        );
      }
    }

    // Handle callback queries (inline keyboard buttons)
    if (callback_query) {
      const telegramUserId = callback_query.from.id;
      
      try {
        // Acknowledge the callback query
        await bot.telegram.answerCbQuery(callback_query.id);
        
        // Handle different callback data
        if (callback_query.data === 'verify_membership') {
          // Re-check membership and verify if joined
          // This could be used for additional verification flows
        }
      } catch (error) {
        console.error('[telegram-webhook] Callback query error:', error);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('[telegram-webhook] Webhook error:', error);
    res.sendStatus(500);
  }
});

// GET /api/telegram/webhook - For webhook info (optional)
router.get('/webhook', (req, res) => {
  res.json({
    status: 'active',
    endpoint: '/api/telegram/webhook',
    description: 'Telegram bot webhook for automatic verification'
  });
});

module.exports = router;
