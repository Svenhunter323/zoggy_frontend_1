import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import LatestWins from '../components/LatestWins'
import Leaderboard from '../components/Leaderboard'
import Footer from '../components/Footer'

// To test Animation

const LandingPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // document.title = 'JOIN WAITLIST'
  }, [])

  const handleJoinWaitlist = () => {
    // navigate('/signup')
    navigate('/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header minimal={false} title="" />
      <HeroSection onJoinWaitlist={handleJoinWaitlist} />


      
      
      {/* <StatsSection /> */}
      <LatestWins />
      <Leaderboard />
      <Footer />
    </div>
  )
}

export default LandingPage