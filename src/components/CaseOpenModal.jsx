import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Twitter, Copy, Gift, Sparkles } from 'lucide-react'
import Button from './Button'
import { useToast } from '../contexts/ToastContext'

const CaseOpenModal = ({ isOpen, onClose, reward }) => {
  const [showReward, setShowReward] = useState(false)
  const [copied, setCopied] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen && reward) {
      const timer = setTimeout(() => {
        setShowReward(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setShowReward(false)
    }
  }, [isOpen, reward])

  const handleTwitterShare = () => {
    const tweetText = `🎉 Just opened a daily case on @ZoggyApp and won ${reward?.amount || '$0'}! 💰\n\nJoin the waitlist and start earning rewards too! 🚀\n\n#Zoggy #DailyRewards #Crypto`
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.origin)}`
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                initial={{ scale: 1 }}
                animate={{ 
                  scale: showReward ? [1, 1.2, 1] : 1,
                  rotate: showReward ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-32 h-32 mx-auto mb-4 relative"
              >
                <div className="w-full h-full bg-gradient-to-br from-yellow-600 via-gold to-yellow-500 rounded-2xl shadow-2xl flex items-center justify-center">
                  <Gift className="w-16 h-16 text-gray-900" />
                </div>
                
                {/* Sparkles Animation */}
                <AnimatePresence>
                  {showReward && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 200],
                            y: [0, (Math.random() - 0.5) * 200]
                          }}
                          transition={{ 
                            duration: 2,
                            delay: i * 0.1,
                            ease: "easeOut"
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <Sparkles className="w-6 h-6 text-gold" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Opening Text */}
              {!showReward ? (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: showReward ? 0 : 1 }}
                  className="text-2xl font-bold text-white font-poppins"
                >
                  Opening your daily case...
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-2 font-poppins">
                    Congratulations! 🎉
                  </h2>
                  <div className="text-5xl font-bold text-gold mb-4 font-poppins animate-glow">
                    {reward?.amount || '$0.00'}
                  </div>
                  <p className="text-gray-300 font-montserrat">
                    You've earned {reward?.amount || '$0.00'} from your daily case!
                  </p>
                </motion.div>
              )}
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
