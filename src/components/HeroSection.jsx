import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import Button from './Button'
import { useAuth } from '../contexts/AuthContext'
import Carousel from './Carousel'
import EnhancedEmailSignup from './EnhancedEmailSignup'
import banner0 from '../assets/banerrs/0.png'
import banner1 from '../assets/banerrs/1.png'
import banner2 from '../assets/banerrs/2.png'
import banner3 from '../assets/banerrs/3.jpg'

const HeroSection = ({ onJoinWaitlist }) => {
  const { user } = useAuth();
  const bannerImages = [banner0, banner1, banner2, banner3];
  const [hasReferralCode, setHasReferralCode] = useState(false);

  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    setHasReferralCode(!!refCode);
  }, []);
  
  // Debug: Log image paths
  console.log('Banner images:', bannerImages);


  return (
    <section className={`${user ? 'min-h-fit' : 'min-h-screen'} bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950`}>
      {/* Banner Carousel Section */}
      <div className="h-64 md:h-80 lg:h-96 relative overflow-hidden">
        <Carousel 
          images={bannerImages}
          autoSlide={true}
          slideInterval={6000}
          className="w-full h-full"
        />
        
        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight font-poppins">
                <span className="text-white drop-shadow-2xl">Open Your Daily Chest.</span>
                <br />
                <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent animate-glow drop-shadow-2xl">
                  Win up to $10,000.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto font-montserrat font-light leading-relaxed drop-shadow-lg">
                Join thousands of players opening daily chests and winning real money.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Hero Text Content */}
      {(!user || hasReferralCode) && (
        <div className="flex items-center justify-center px-6 py-12 min-h-[calc(100vh-24rem)]">
          <div className="max-w-5xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
            <EnhancedEmailSignup 
              onSuccess={(data) => {
                console.log('Signup successful:', data)
                // User will be automatically redirected to dashboard
              }}
              forceEnable={hasReferralCode}
            />
            </motion.div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HeroSection