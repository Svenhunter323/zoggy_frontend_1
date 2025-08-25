import React, { useState, useEffect } from 'react'
import { X, Gift, Share2, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency, calculateReward } from '../utils/reward'
import { useAuth } from '../contexts/AuthContext'
import Button from './Button'

const ChestModal = ({ onClose }) => {
  const { user } = useAuth()
  const [isOpening, setIsOpening] = useState(true)
  const [prize, setPrize] = useState(null)
  const [showPrize, setShowPrize] = useState(false)

  useEffect(() => {
    // Simulate chest opening animation
    const timer = setTimeout(() => {
      const isFirstChest = !user?.lastChestOpenAt
      const prizeAmount = calculateReward(isFirstChest)
      setPrize(prizeAmount)
      setShowPrize(true)
      setIsOpening(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [user])

  const shareOnTwitter = () => {
    if (prize) {
      const tweetText = `🎉 I just opened a chest on @Zoggy and unboxed ${formatCurrency(prize)}! 💰🔥 Join the waitlist and try your luck: https://zoggybet.com`
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
      window.open(twitterUrl, '_blank')
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

          {!showPrize ? (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Daily Chest</h2>
              
              <div className="mb-8">
                <motion.div
                  animate={isOpening ? { 
                    rotateY: [0, 180, 360, 540, 720],
                    scale: [1, 1.3, 1.1, 1.3, 1],
                    rotateZ: [0, 10, -10, 5, 0]
                  } : {}}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="w-32 h-32 mx-auto bg-gradient-to-br from-gold to-yellow-500 rounded-2xl shadow-2xl flex items-center justify-center"
                >
                  <Gift className="w-16 h-16 text-gray-900 drop-shadow-lg" />
                </motion.div>
              </div>

              <div className="space-y-4">
                <div className="text-lg text-gray-300 font-semibold">
                  Opening chest...
                </div>
                <div className="w-8 h-8 border-4 border-gray-600 border-t-gold rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-6xl animate-bounce">🎉</div>
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="w-8 h-8 text-gold" />
                <h2 className="text-3xl font-bold text-green-400">Congratulations!</h2>
              </div>
              <div className="bg-gradient-to-r from-gold/20 to-yellow-600/20 rounded-xl p-6 border-2 border-gold/30">
                <p className="text-lg text-gray-300 mb-2">You unboxed</p>
                <p className="text-4xl font-bold text-gold">{formatCurrency(prize)}</p>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="secondary"
                  onClick={shareOnTwitter}
                  className="flex-1"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Flex
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ChestModal