import React, { useState } from 'react'
import { Gift, Clock, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { canOpenChest, getNextChestTime } from '../utils/time'
import { chestAPI } from '../api/endpoints'
import Button from './Button'
import Card from './Card'
import Countdown from './Countdown'
import { useToast } from '../contexts/ToastContext'
import chestImage from '../assets/chest.png'

const DailyChest = ({ dashboardData, onOpenChest, onShowTelegramModal }) => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isOpening, setIsOpening] = useState(false)

  const canOpen = canOpenChest(dashboardData?.lastOpenAt, dashboardData?.cooldownSeconds)
  const nextChestTime = getNextChestTime(dashboardData?.lastOpenAt, dashboardData?.cooldownSeconds)

  const handleOpenChest = async () => {
    if (!dashboardData?.telegram?.verified) {
      onShowTelegramModal()
      return
    }

    if (!canOpen) {
      showToast('You can only open one chest per day!', 'warning')
      return
    }

    try {
      setIsOpening(true)
      const response = await chestAPI.open()
      
      // Pass reward data to parent
      const rewardData = {
        amount: response.data?.reward || '$5.00',
        type: response.data?.type || 'cash'
      }
      
      onOpenChest(rewardData)
    } catch (error) {
      console.error('Failed to open chest:', error)
      showToast('Failed to open chest. Please try again.', 'error')
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <>
      <Card className="max-w-md mx-auto text-center bg-gradient-to-br from-gold/10 to-yellow-600/10 border-gold/30 shadow-2xl shadow-gold/20">
        <h3 className="text-3xl font-bold text-white mb-8 font-poppins">Daily Chest</h3>
        
        <div className="w-40 h-40 mx-auto mb-8 relative">
          <motion.div
            animate={canOpen ? { 
              rotateY: [0, 10, -10, 0],
              scale: [1, 1.05, 1],
              y: [0, -5, 0]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: canOpen ? Infinity : 0,
              ease: "easeInOut"
            }}
            className={`w-full h-full flex items-center justify-center transform hover:scale-110 transition-all duration-500 relative ${
              !canOpen ? 'opacity-60 grayscale' : ''
            }`}
          >
            {/* Glow effect for available chest */}
            {canOpen && (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gold/20 rounded-full blur-xl"
              />
            )}
            
            <motion.img 
              src={chestImage} 
              alt="Daily Chest" 
              className="w-48 h-48 object-contain drop-shadow-2xl relative z-10"
              animate={isOpening ? {
                rotateY: [0, 180, 360],
                scale: [1, 1.2, 1.1],
                y: [0, -20, -10]
              } : {}}
              transition={{
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
            
            {/* Opening sparkles */}
            {isOpening && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (Math.cos(i * 45 * Math.PI / 180) * 60)],
                      y: [0, (Math.sin(i * 45 * Math.PI / 180) * 60)]
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.5 + i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gold rounded-full"
                  />
                ))}
              </>
            )}
            
            {!canOpen && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gray-800/80 rounded-full p-3 backdrop-blur-sm"
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>

        {canOpen ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={handleOpenChest}
            loading={isOpening}
            className="w-full"
          >
            {isOpening ? 'Opening...' : 'Open Chest'}
          </Button>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              disabled
              className="w-full opacity-50 cursor-not-allowed"
            >
              Chest Opened
            </Button>
            {nextChestTime && (
              <Countdown 
                targetDate={nextChestTime}
                label="Next chest in"
                className="justify-center"
              />
            )}
          </div>
        )}
      </Card>
    </>
  )
}

export default DailyChest