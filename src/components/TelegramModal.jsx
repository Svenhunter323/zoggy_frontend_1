import React, { useState, useEffect } from 'react'
import { X, MessageCircle, ExternalLink, CheckCircle, Clock, AlertCircle, User, Shield, Loader } from 'lucide-react'
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
  const [showManualVerification, setShowManualVerification] = useState(false)
  const [telegramUserId, setTelegramUserId] = useState('')
  const [pollingAttempts, setPollingAttempts] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const channelHandle = import.meta.env.VITE_TG_CHANNEL_HANDLE || '@zoggytestchannel'

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
    setPollingAttempts(0)
    setTimeRemaining(60) // 60 seconds timeout
    
    // Start countdown timer
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    const interval = setInterval(async () => {
      setPollingAttempts(prev => prev + 1)
      await checkVerification()
    }, 2000) // Check every 2 seconds
    
    setPollingInterval(interval)
    
    // Stop polling after 60 seconds
    setTimeout(() => {
      if (interval) {
        clearInterval(interval)
        clearInterval(countdownInterval)
        setPollingInterval(null)
        if (verificationStatus === 'checking') {
          setVerificationStatus('failed')
          setShowManualVerification(true)
          showToast('Verification timeout. Please try manual verification.', 'warning')
        }
      }
    }, 60000)
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
  const handleManualVerificationWithUserId = async (userId) => {
    if (!userId || !userId.trim()) {
      showToast('Please enter a valid Telegram User ID', 'error')
      return
    }

    try {
      setVerificationStatus('checking')
      
      // Call markAsVerified with telegram user ID
      const response = await telegramAPI.markAsVerified(userId.trim())
      
      if (response.data.success) {
        setVerificationStatus('verified')
        setTelegramVerified(true)
        showToast('Telegram verification successful!', 'success')
        setTimeout(() => onClose(), 1500)
      } else {
        setVerificationStatus('failed')
        showToast('Verification failed. Please check your User ID and try again.', 'error')
      }
    } catch (error) {
      console.error('Manual verification failed:', error)
      setVerificationStatus('failed')
      if (error.response?.status === 404) {
        showToast('User not found in Telegram channel. Please join first.', 'error')
      } else if (error.response?.status === 400) {
        showToast('Invalid Telegram User ID format.', 'error')
      } else {
        showToast('Verification failed. Please try again.', 'error')
      }
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    handleManualVerificationWithUserId(telegramUserId)
  }

  const resetVerification = () => {
    setVerificationStatus('idle')
    setShowManualVerification(false)
    setTelegramUserId('')
    setPollingAttempts(0)
    setTimeRemaining(0)
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4">
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

          {/* Header */}
          <div className="mb-6">
            <motion.div
              animate={{ 
                rotate: verificationStatus === 'verified' ? 360 : 0,
                scale: verificationStatus === 'verified' ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              {verificationStatus === 'verified' ? (
                <CheckCircle className="w-10 h-10 text-white" />
              ) : verificationStatus === 'checking' ? (
                <Loader className="w-10 h-10 text-white animate-spin" />
              ) : (
                <MessageCircle className="w-10 h-10 text-white" />
              )}
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              {verificationStatus === 'verified' ? 'Verification Complete!' : 'Join Our Telegram'}
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              {verificationStatus === 'verified' 
                ? 'You have been successfully verified and can now access all features!'
                : 'Join our Telegram channel and click /start in the bot to verify automatically!'
              }
            </p>
          </div>

          {/* Benefits */}
          {verificationStatus !== 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6"
            >
              <p className="text-blue-400 font-semibold mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                What you'll get:
              </p>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• Daily chest access</li>
                <li>• Exclusive rewards</li>
                <li>• Community updates</li>
                <li>• Early access features</li>
              </ul>
            </motion.div>
          )}

          {/* Verification Status */}
          <AnimatePresence mode="wait">
            {verificationStatus === 'checking' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-center mb-3">
                  <Loader className="w-6 h-6 text-yellow-400 animate-spin mr-2" />
                  <span className="text-yellow-400 font-semibold">Checking Verification Status</span>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-yellow-300 text-sm">
                    Attempt {pollingAttempts} • Time remaining: {timeRemaining}s
                  </p>
                  <p className="text-gray-400 text-xs">
                    Make sure you've joined the channel and clicked /start in the bot
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <motion.div
                    className="bg-yellow-400 h-2 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeRemaining / 60) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </motion.div>
            )}

            {verificationStatus === 'verified' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                  <span className="text-green-400 font-semibold">Successfully Verified!</span>
                </div>
                <p className="text-green-300 text-sm text-center mt-2">
                  Closing modal in a moment...
                </p>
              </motion.div>
            )}

            {verificationStatus === 'failed' && !showManualVerification && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-center mb-2">
                  <AlertCircle className="w-6 h-6 text-red-400 mr-2" />
                  <span className="text-red-400 font-semibold">Verification Failed</span>
                </div>
                <p className="text-red-300 text-sm text-center">
                  Automatic verification timed out. Please try manual verification below.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="space-y-4">
            {verificationStatus !== 'verified' && !showManualVerification && (
              <>
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
                  disabled={verificationStatus === 'checking'}
                >
                  {verificationStatus === 'checking' ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      I've Joined - Verify Now
                    </>
                  )}
                </Button>

                {verificationStatus === 'failed' && (
                  <Button
                    variant="outline"
                    onClick={() => setShowManualVerification(true)}
                    className="w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Manual Verification
                  </Button>
                )}
              </>
            )}

            {/* Manual Verification Form */}
            {showManualVerification && verificationStatus !== 'verified' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Manual Verification
                  </h3>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                    <p className="text-blue-400 text-sm font-medium mb-2">How to find your Telegram User ID:</p>
                    <ol className="text-blue-300 text-xs space-y-1">
                      <li>1. Open Telegram and go to Settings</li>
                      <li>2. Look for your username or User ID</li>
                      <li>3. Or message @userinfobot to get your ID</li>
                    </ol>
                  </div>

                  <form onSubmit={handleManualSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter your Telegram User ID"
                      value={telegramUserId}
                      onChange={(e) => setTelegramUserId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      disabled={verificationStatus === 'checking'}
                    />
                    
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={verificationStatus === 'checking' || !telegramUserId.trim()}
                        loading={verificationStatus === 'checking'}
                      >
                        {verificationStatus === 'checking' ? 'Verifying...' : 'Verify'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowManualVerification(false)}
                        className="px-4"
                        disabled={verificationStatus === 'checking'}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Reset Button */}
            {(verificationStatus === 'failed' || verificationStatus === 'verified') && (
              <Button
                variant="outline"
                onClick={resetVerification}
                className="w-full text-sm"
              >
                Try Again
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TelegramModal