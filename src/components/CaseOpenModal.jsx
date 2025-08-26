import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Twitter, Copy, Gift, Sparkles, Star, Zap } from 'lucide-react'
import Button from './Button'
import { useToast } from '../contexts/ToastContext'
import chestImage from '../assets/chest.png'
import { useAuth } from '../contexts/AuthContext'

const CaseOpenModal = ({ isOpen, onClose, reward }) => {
  const { user } = useAuth()
  const [showReward, setShowReward] = useState(false)
  const [copied, setCopied] = useState(false)
  const [chestOpened, setChestOpened] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen && reward) {
      // First show chest opening animation
      const openTimer = setTimeout(() => {
        setChestOpened(true)
      }, 800)
      
      // Then show reward after chest opens
      const rewardTimer = setTimeout(() => {
        setShowReward(true)
      }, 2000)
      
      return () => {
        clearTimeout(openTimer)
        clearTimeout(rewardTimer)
      }
    } else {
      setShowReward(false)
      setChestOpened(false)
    }
  }, [isOpen, reward])

  const handleTwitterShare = () => {
    const safeReferralCode = user.referralCode || 'DEFAULT_CODE'
    const tweetText = `🎉 I just opened a chest on @Zoggy and got ${reward?.amount || '$0'}! 💰\n\nJoin the waitlist and start earning rewards too! 🚀\n\n#Zoggy #DailyRewards #Crypto`
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.origin)}/signup?ref=${safeReferralCode}`
    window.open(tweetUrl, '_blank', 'width=550,height=420')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setCopied(true)
      showToast('Link copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      showToast('Failed to copy link', 'error')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gold/30 shadow-2xl max-w-md w-full mx-auto overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-700/50 hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-300" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Chest Opening Animation */}
            <div className="mb-8 relative">
              <motion.div
                className="w-40 h-40 mx-auto mb-4 relative"
              >
                {/* Background glow effect */}
                <motion.div
                  animate={chestOpened ? {
                    scale: [1, 2, 1.5],
                    opacity: [0, 0.8, 0.4]
                  } : {}}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 bg-gold/30 rounded-full blur-2xl"
                />
                
                {/* Chest Image */}
                <motion.img
                  src={chestImage}
                  alt="Opening Chest"
                  className="w-full h-full object-contain relative z-10"
                  animate={chestOpened ? {
                    rotateY: [0, 180, 360],
                    scale: [1, 1.3, 1.1],
                    y: [0, -30, -20]
                  } : {
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={chestOpened ? {
                    duration: 1.2,
                    ease: "easeInOut"
                  } : {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Explosion sparkles */}
                <AnimatePresence>
                  {chestOpened && (
                    <>
                      {/* Main sparkle burst */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={`sparkle-${i}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0.5, 0],
                            scale: [0, 1.5, 1, 0],
                            x: [0, Math.cos(i * 30 * Math.PI / 180) * 100],
                            y: [0, Math.sin(i * 30 * Math.PI / 180) * 100],
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 2,
                            delay: 0.3 + i * 0.05,
                            ease: "easeOut"
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <Star className="w-4 h-4 text-gold" />
                        </motion.div>
                      ))}
                      
                      {/* Secondary sparkle layer */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={`zap-${i}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, Math.cos(i * 45 * Math.PI / 180) * 80],
                            y: [0, Math.sin(i * 45 * Math.PI / 180) * 80]
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 0.6 + i * 0.08,
                            ease: "easeOut"
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <Zap className="w-3 h-3 text-yellow-400" />
                        </motion.div>
                      ))}
                      
                      {/* Floating particles */}
                      {[...Array(15)].map((_, i) => (
                        <motion.div
                          key={`particle-${i}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 200],
                            y: [0, (Math.random() - 0.5) * 200]
                          }}
                          transition={{
                            duration: 3,
                            delay: 0.8 + i * 0.1,
                            ease: "easeOut"
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gold rounded-full"
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Opening Text */}
              <AnimatePresence mode="wait">
                {!chestOpened ? (
                  <motion.div
                    key="opening"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-2xl font-bold text-white font-poppins"
                  >
                    Opening your daily chest...
                  </motion.div>
                ) : !showReward ? (
                  <motion.div
                    key="revealing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-2xl font-bold text-gold font-poppins animate-pulse"
                  >
                    ✨ Revealing your prize... ✨
                  </motion.div>
                ) : (
                  <motion.div
                    key="reward"
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      type: "spring",
                      damping: 15,
                      stiffness: 300,
                      delay: 0.2
                    }}
                  >
                    <motion.h2 
                      className="text-3xl font-bold text-white mb-4 font-poppins"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        textShadow: [
                          "0 0 0px rgba(255,215,0,0)",
                          "0 0 20px rgba(255,215,0,0.8)",
                          "0 0 0px rgba(255,215,0,0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎉 Congratulations! 🎉
                    </motion.h2>
                    
                    <motion.div 
                      className="text-6xl font-bold text-gold mb-6 font-poppins"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        type: "spring",
                        damping: 10,
                        stiffness: 200,
                        delay: 0.5
                      }}
                      style={{
                        filter: "drop-shadow(0 0 20px rgba(255,215,0,0.8))",
                        textShadow: "0 0 30px rgba(255,215,0,0.6)"
                      }}
                    >
                      {reward?.amount || '$0.00'}
                    </motion.div>
                    
                    <motion.p 
                      className="text-gray-300 font-montserrat text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      Congrats! You unboxed <span className="text-gold font-semibold">{reward?.amount || '$0.00'}</span>
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Share Section */}
            <AnimatePresence>
              {showReward && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6">
                    <p className="text-gold text-sm font-montserrat">
                      <strong>Share your win</strong> and help others discover Zoggy!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleTwitterShare}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Tweet
                    </Button>

                    <Button
                      onClick={handleCopyLink}
                      variant="secondary"
                      className={copied ? 'bg-green-600 border-green-600' : ''}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </div>

                  <Button
                    onClick={onClose}
                    variant="primary"
                    size="lg"
                    className="w-full mt-6"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CaseOpenModal
