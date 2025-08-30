import React, { useState, useEffect } from 'react'
import { Lock, MessageCircle } from 'lucide-react'
import { FaTelegramPlane } from "react-icons/fa"
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { canOpenChest, getNextChestTime } from '../utils/time'
import { chestAPI } from '../api/endpoints'
import Button from './Button'
import Card from './Card'
import Countdown from './Countdown'
import { useToast } from '../contexts/ToastContext'
import chestImage from '../assets/chest.png'
import { useApi } from '../hooks/useApi'
import { telegramAPI } from '../api/endpoints'
import TelegramLoginButton from './TelegramLoginButton'


const DailyChest = ({ dashboardData, onOpenChest }) => {
  // const channelHandle = import.meta.env.VITE_TG_CHANNEL_HANDLE || '@zoggytestchannel'
  // const { user } = useAuth()
  const { showToast } = useToast()
  const [isOpening, setIsOpening] = useState(false)

  const canOpen = canOpenChest(dashboardData?.lastOpenAt, dashboardData?.cooldownSeconds)
  const nextChestTime = getNextChestTime(dashboardData?.lastOpenAt, dashboardData?.cooldownSeconds)
  
  // Telegram Join
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [tgState, setTgState] = useState({});

  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const inviteCode = import.meta.env.VITE_TG_INVITE_CODE;
  const joinHref = isMobile
    ? `tg://join?invite=${inviteCode}`
    : `https://t.me/+${inviteCode}`;

  // poll /status every 2s after we trigger a join
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const reponse = await telegramAPI.verifyStatus();
        // console.log(reponse.data);
        if (reponse.data?.telegram_verified) setVerified(true);
        // console.log("-------------->ping----------->", reponse.data);
      } catch (e) { 
        // console.error("------ping---------->", e)
       }
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const recheck = async () => {
    setChecking(true);
    try {
      const response = await telegramAPI.reCheck();
      if (response.data?.isMember) setVerified(true);
    } catch {}
    setChecking(false);
  };

  const handleAuth = async (user) => {
    try {
      const res = await telegramAPI.login(user);
      setTgState(res.data);

      console.log(tgState);
    } catch (e) {
      console.error(e);
    }
  }

  const handleJoinTelegram = async () => {
    try {
      const res = await telegramAPI.nonce();
      if(!res.data.ok) {
        // console.log("server failed------------");
        return;
      }
      const { nonce, botUsername } = res.data;

      // console.log(`nonce: ${nonce}, botUsername: ${botUsername}`);
      const tg = 'tg://resolve?domain=' + botUsername + '&start=auth_' + encodeURIComponent(nonce);
      const web = 'https://t.me/' + botUsername + '?start=auth_' + encodeURIComponent(nonce);
      location.href = tg; 
      
      // setTimeout(() => location.href = web, 10000);
    } catch (e) {
      console.log("Festch nonce error", e);
    }
  }

  const handleOpenChest = async () => {
    if (!verified) {
      return
    }
    if (!canOpen) {
      showToast('You can only open one chest per day!', 'warning')
      return
    }
    try {
      setIsOpening(true)
      const response = await chestAPI.open()
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
      <div className="flex flex-col md:flex-row md:items-stretch gap-8">
        {/* LEFT: 30% on md+ */}
        <div className="w-full md:basis-[30%] md:max-w-[30%] md:shrink-0 md:grow-0 text-center">
          <div className="w-40 h-40 mx-auto mb-8 relative">
            <motion.div
              animate={canOpen ? { rotateY: [0, 10, -10, 0], scale: [1, 1.05, 1], y: [0, -5, 0] } : {}}
              transition={{ duration: 2, repeat: canOpen ? Infinity : 0, ease: 'easeInOut' }}
              className={`w-full h-full flex items-center justify-center transform hover:scale-110 transition-all duration-500 relative ${
                !canOpen ? 'opacity-60 grayscale' : ''
              }`}
            >
              {canOpen && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gold/20 rounded-full blur-xl"
                />
              )}

              <motion.img
                src={chestImage}
                alt="Daily Chest"
                className="w-48 h-48 object-contain drop-shadow-2xl relative z-10"
                animate={
                  isOpening
                    ? { rotateY: [0, 180, 360], scale: [1, 1.2, 1.1], y: [0, -20, -10] }
                    : {}
                }
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {isOpening &&
                [...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.cos((i * 45 * Math.PI) / 180) * 60],
                      y: [0, Math.sin((i * 45 * Math.PI) / 180) * 60]
                    }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gold rounded-full"
                  />
                ))}

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

          <h3 className="text-3xl font-bold text-white mb-8 font-poppins">Open your Daily Chest!</h3>
          
          {( (dashboardData.telegram.verified || verified) ? 
            canOpen ? (
              <Button
                variant="primary"
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
            ) : (
              <div className="mt-auto">
                <Button
                  variant="sky"
                  size="lg"
                  className="w-full"
                  onClick={handleJoinTelegram}
                  disabled={dashboardData?.telegram?.verified}
                >
                  <FaTelegramPlane className="w-5 h-5 mr-2" />
                    Join Telegram
                </Button>
              </div>
            )
          )}
        </div>

        {/* RIGHT: 70% on md+ */}
        <div className="w-full md:basis-[70%] md:max-w-[70%] md:shrink md:grow">
          <div className="h-full flex flex-col bg-[#0d1320] border border-gray-800 rounded-lg">
            {/* Make inner content vertically centered */}
            <div className="flex flex-col justify-center flex-1 text-center p-8">
              {/* Icon + Title side by side */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <FaTelegramPlane className="w-8 h-8 text-sky-400" />
                <h3 className="text-2xl font-bold text-white font-poppins">
                  Telegram Required
                </h3>
              </div>

              <p className="text-lg text-gray-300 font-montserrat leading-relaxed">
                You must connect Telegram and join our group to be able to open a daily chest and earn rewards up to $10.000.
              </p>

              {(dashboardData?.telegram?.linked || tgState.ok) && (
                <div className="mt-4 flex items-center space-x-2 justify-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      (dashboardData.telegram.verified || verified) ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      (dashboardData.telegram.verified || verified) ? 'text-green-400' : 'text-yellow-400'
                    }`}
                  >
                    {(dashboardData.telegram.verified || verified)
                      ? 'Telegram Verified'
                      : 'Telegram Linked (Pending Verification)'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

export default DailyChest
