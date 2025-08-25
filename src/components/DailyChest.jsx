import React, { useState } from 'react'
import { Gift, Clock, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { canOpenChest, getNextChestTime } from '../utils/time'
import { chestAPI } from '../api/endpoints'
import Button from './Button'
import Card from './Card'
import Countdown from './Countdown'
import CaseOpenModal from './CaseOpenModal'
import TelegramModal from './TelegramModal'
import { useToast } from '../contexts/ToastContext'

const DailyChest = ({ dashboardData }) => {
  const { user, fetchUser } = useAuth()
  const { showToast } = useToast()
  const [showCaseModal, setShowCaseModal] = useState(false)
  const [showTelegramModal, setShowTelegramModal] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [reward, setReward] = useState(null)

  const canOpen = canOpenChest(dashboardData?.lastOpenAt, dashboardData?.cooldownSeconds)
  const nextChestTime = getNextChestTime(dashboardData?.lastOpenAt, dashboardData?.cooldownSeconds)

  const handleOpenChest = async () => {
    if (!dashboardData?.telegram?.verified) {
      setShowTelegramModal(true)
      return
    }

    if (!canOpen) {
      showToast('You can only open one chest per day!', 'warning')
      return
    }

    try {
      setIsOpening(true)
      const response = await chestAPI.open()
      
      // Set reward data for the modal
      setReward({
        amount: response.data?.reward || '$5.00',
        type: response.data?.type || 'cash'
      })
      
      setShowCaseModal(true)
      await fetchUser() // Refresh user data
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
              scale: [1, 1.05, 1]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: canOpen ? Infinity : 0,
              ease: "easeInOut"
            }}
            className={`w-full h-full bg-gradient-to-br from-gold via-yellow-400 to-yellow-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-500 ${
              !canOpen ? 'opacity-60 grayscale' : 'shadow-gold/50'
            }`}
          >
            <Gift className="w-20 h-20 text-gray-900 drop-shadow-2xl" />
            {!canOpen && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
                <Lock className="w-8 h-8 text-white" />
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

      <CaseOpenModal
        isOpen={showCaseModal}
        onClose={() => {
          setShowCaseModal(false)
          setReward(null)
        }}
        reward={reward}
      />

      {showTelegramModal && (
        <TelegramModal
          onClose={() => setShowTelegramModal(false)}
        />
      )}
    </>
  )
}

export default DailyChest