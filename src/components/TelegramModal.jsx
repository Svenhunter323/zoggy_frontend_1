import React, { useState, useEffect } from 'react'
import { X, MessageCircle, ExternalLink, CheckCircle, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { telegramAPI } from '../api/endpoints'
import Button from './Button'
import { useToast } from '../contexts/ToastContext'

const TelegramModal = ({ onClose }) => {
  const { setTelegramVerified } = useAuth()
  const { showToast } = useToast()
  const [verificationStatus, setVerificationStatus] = useState('idle') // idle, checking, verified, failed
  const [pollingInterval, setPollingInterval] = useState(null)
  const channelHandle = import.meta.env.VITE_TG_CHANNEL_HANDLE || '@zoggycasino'

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [pollingInterval])

  const handleJoinTelegram = async () => {
    try {
      // Get Telegram deep link
      const response = await telegramAPI.getDeeplink()
      const link = response.data.link

      console.log(response.data);
      
      // Open Telegram
      window.open(link, '_blank')
      
      // Show verification message
      showToast('Please join the channel and come back to verify!', 'success')
      
      // Start verification polling after a delay
      setTimeout(() => {
        startVerificationPolling()
      }, 5000)
    } catch (error) {
      console.error('Failed to get Telegram link:', error)
      // Fallback to direct channel link
      window.open(`https://t.me/${channelHandle.replace('@', '')}`, '_blank')
      showToast('Please join the channel and come back to verify!', 'success')
      setTimeout(() => {
        startVerificationPolling()
      }, 5000)
    }
  }

  const startVerificationPolling = () => {
    setVerificationStatus('checking')
    
    const interval = setInterval(async () => {
      await checkVerification()
    }, 2000) // Check every 2 seconds (faster for webhook response)
    
    setPollingInterval(interval)
    
    // Stop polling after 1 minute (webhook should be instant)
    setTimeout(() => {
      if (interval) {
        clearInterval(interval)
        setPollingInterval(null)
        if (verificationStatus === 'checking') {
          setVerificationStatus('idle')
          showToast('Verification timeout. Make sure you clicked /start in the bot.', 'warning')
        }
      }
    }, 60000) // Reduced to 1 minute since webhook is immediate
  }

  const checkVerification = async () => {
    try {
      const response = await telegramAPI.verifyStatus()

      console.log('Telegram verification response:', response.data)
      
      // Backend returns { telegramVerified: true/false }
      if (response.data.telegramVerified) {
        setVerificationStatus('verified')
        setTelegramVerified(true)
        showToast('Telegram verification successful!', 'success')
        
        // Clear polling
        if (pollingInterval) {
          clearInterval(pollingInterval)
          setPollingInterval(null)
        }
        
        // Close modal after a brief delay
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        // Still not verified, continue polling
        console.log('User not verified yet, continuing to poll...')
      }
    } catch (error) {
      console.error('Failed to verify Telegram status:', error)
      setVerificationStatus('failed')
      showToast('Verification failed. Please try again.', 'error')
      
      // Clear polling on error
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
  }

  const handleManualVerification = async () => {
    setVerificationStatus('checking')
    await checkVerification()
  }

  // Alternative: Manual verification with telegramUserId (if you have it)
  const handleManualVerificationWithUserId = async (telegramUserId) => {
    try {
      setVerificationStatus('checking')
      
      // Call markAsVerified with telegram user ID
      const response = await telegramAPI.markAsVerified(telegramUserId)
      
      if (response.data.success) {
        setVerificationStatus('verified')
        setTelegramVerified(true)
        showToast('Telegram verification successful!', 'success')
        setTimeout(() => onClose(), 1500)
      }
    } catch (error) {
      console.error('Manual verification failed:', error)
      setVerificationStatus('failed')
      showToast('Verification failed. Please try again.', 'error')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Telegram</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Join our Telegram channel and click <strong>/start</strong> in the bot to verify automatically!
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
            <p className="text-blue-400 font-semibold mb-2">What you'll get:</p>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Daily chest access</li>
              <li>• Exclusive rewards</li>
              <li>• Community updates</li>
              <li>• Early access features</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button
              variant="primary"
              onClick={handleJoinTelegram}
              className="w-full text-lg"
              disabled={verificationStatus === 'checking'}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join {channelHandle}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleManualVerification}
              className="w-full"
              disabled={verificationStatus === 'checking' || verificationStatus === 'verified'}
            >
              {verificationStatus === 'checking' && (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              )}
              {verificationStatus === 'verified' && (
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              )}
              {verificationStatus === 'checking' ? 'Checking...' : 
               verificationStatus === 'verified' ? 'Verified!' : 
               "I've Joined - Verify Now"}
            </Button>
            
            {verificationStatus === 'checking' && (
              <div className="text-sm text-gray-400 mt-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Waiting for bot verification... Click /start in Telegram!
              </div>
            )}
            
            {verificationStatus === 'verified' && (
              <div className="text-sm text-green-400 mt-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Successfully verified! Closing modal...
              </div>
            )}
            
            {verificationStatus === 'failed' && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm mb-2">Having trouble? Try manual verification:</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const userId = prompt("Enter your Telegram User ID (found in Telegram settings):")
                    if (userId) handleManualVerificationWithUserId(userId)
                  }}
                  className="w-full text-sm"
                >
                  Manual Verification
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TelegramModal