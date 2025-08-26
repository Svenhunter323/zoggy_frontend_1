import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import DailyChest from '../components/DailyChest'
import CopyField from '../components/CopyField'
import Card from '../components/Card'
import LatestWins from '../components/LatestWins'
import Leaderboard from '../components/Leaderboard'
import Carousel from '../components/Carousel'
import CaseOpenModal from '../components/CaseOpenModal'
import TelegramModal from '../components/TelegramModal'
import { Gift, Users, Trophy, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import { userAPI } from '../api/endpoints'
import { useToast } from '../contexts/ToastContext'

const DashboardPage = () => {
  const { user, fetchUser } = useAuth()
  const { showToast } = useToast()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCaseModal, setShowCaseModal] = useState(false)
  const [showTelegramModal, setShowTelegramModal] = useState(false)
  const [reward, setReward] = useState(null)
  const channelHandle = import.meta.env.VITE_TG_CHANNEL_HANDLE || '@zoggytestchannel'

  const handleOpenChest = (rewardData) => {
    setReward(rewardData)
    setShowCaseModal(true)
  }

  const handleShowTelegramModal = () => {
    setShowTelegramModal(true)
  }

  const handleCloseCaseModal = async () => {
    setShowCaseModal(false)
    setReward(null)
    await fetchUser() // Refresh user data
  }

  const handleCloseTelegramModal = () => {
    setShowTelegramModal(false)
  }

  useEffect(() => {
    // document.title = 'WAITLIST'
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userAPI.getDashboard()
        setDashboardData(response.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        showToast('Failed to load dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, showToast])

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header minimal={false} title="" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header minimal={false} title="" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Failed to load dashboard</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header minimal={false} title="" />

      {/* Hero Banner Carousel Section */}
      <div className="md:h-96 lg:h-[28rem] relative overflow-hidden">
        <Carousel
          autoSlide={true}
          slideInterval={6000}
          // className="w-full h-full"
        />

        {/* Overlay Text */}
        {/* <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight font-poppins">
                <span className="text-white drop-shadow-2xl">Welcome Back!</span>
                <br />
                <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent animate-glow drop-shadow-2xl">
                  Open Daily Chests
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto font-montserrat font-light leading-relaxed drop-shadow-lg">
                Manage your account and earn rewards daily
              </p>
            </motion.div>
          </div>
        </div> */}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 3 Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-poppins">Waitlist Position</h3>
            <div className="text-3xl font-bold text-gold mb-1 font-poppins">
              #&nbsp;{dashboardData.position || '---'}
            </div>
            <p className="text-gray-400 text-sm font-montserrat">Your current position</p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-poppins">Total Waitlist</h3>
            <div className="text-3xl font-bold text-gold mb-1 font-poppins">
              #&nbsp;{dashboardData.total || '10K+'}
            </div>
            <p className="text-gray-400 text-sm font-montserrat">People waiting</p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-poppins">My Referral Users</h3>
            <div className="text-3xl font-bold text-gold mb-1 font-poppins">
              {dashboardData.referrals || 0}
            </div>
            <p className="text-gray-400 text-sm font-montserrat">Friends referred</p>
          </Card>
        </div>

        {/* Referral Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="font-bold text-white mb-4 font-poppins text-lg sm:text-2xl md:text-3xl">
              For every person who joins with your link, you will get referral
            </h2>
          </div>

          <Card className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-white mb-3 font-poppins">
                  Your Referral Code:
                  {/* Your Referral Code: */}
                </label>
                {/* <CopyField
                  value={`ZOGGY-${user.referralCode ? (user.referralCode.length >= 6 ? user.referralCode.slice(-6).toUpperCase() : user.referralCode.toUpperCase().padEnd(6, 'X')) : 'XXXXXX'}`}
                  label="Referral Code"
                /> */}
                <CopyField
                  value={dashboardData.claimCode}
                  label="Claim Code"
                />
              </div>

              <div>
                <CopyField
                  // value={`${window.location.origin}/signup?ref=${dashboardData.referralCode || 'DEFAULT_CODE'}`}
                  value={`${window.location.origin}?ref=${dashboardData.referralCode || ''}`}
                  label="Referral Link"
                />
              </div>

              <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Current Balance:</span>
                  <span className="text-gold font-bold text-lg">${dashboardData.balance || '0.00'}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Total earned from daily cases and referrals
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Daily Case Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            {/* <h2 className="text-4xl font-bold text-white mb-4 font-poppins">
              DAILY CASE
            </h2> */}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Big Chest */}
            <Card className="text-center">
              <DailyChest
                dashboardData={dashboardData}
                onOpenChest={handleOpenChest}
                onShowTelegramModal={handleShowTelegramModal}
              />
            </Card>

            {/* Right: Telegram Requirement */}
            <Card>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-brand to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-poppins">Telegram Required</h3>
                <p className="text-lg text-gray-300 font-montserrat leading-relaxed">
                  You must connect Telegram and join our group to be eligible to open a daily case and earn rewards.
                </p>

                {dashboardData.telegram?.linked && (
                  <div className="mt-4 flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${dashboardData.telegram.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className={`text-sm font-medium ${dashboardData.telegram.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {dashboardData.telegram.verified ? 'Telegram Verified' : 'Telegram Linked (Pending Verification)'}
                    </span>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => window.open(`https://t.me/${channelHandle.replace('@', '')}`, '_blank')}
                disabled={dashboardData.telegram?.verified}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {dashboardData.telegram?.verified ? 'Telegram Connected' : dashboardData.telegram?.linked ? 'Complete Verification' : 'Join Telegram Group'}
              </Button>
            </Card>
          </div>
        </div>

        {/* Live Wins */}
        <LatestWins />

        {/* Referral Leaderboard */}
        <Leaderboard />
      </div>

      {/* Modals */}
      <CaseOpenModal
        isOpen={showCaseModal}
        onClose={handleCloseCaseModal}
        reward={reward}
      />

      {showTelegramModal && (
        <TelegramModal
          onClose={handleCloseTelegramModal}
        />
      )}

      {/* <ToastContainer /> */}
    </div>
  )
}

export default DashboardPage