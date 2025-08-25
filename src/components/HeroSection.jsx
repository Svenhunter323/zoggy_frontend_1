import React from 'react'
import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import Button from './Button'
import { useAuth } from '../contexts/AuthContext'

const HeroSection = ({ onJoinWaitlist }) => {
  const { user } = useAuth();
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent opacity-50"></div>
      <div className="max-w-5xl mx-auto text-center relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* <div className="w-32 h-32 mx-auto mb-8 relative">
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full bg-gradient-to-br from-gold to-yellow-500 rounded-2xl shadow-2xl flex items-center justify-center"
            >
              <Gift className="w-16 h-16 text-gray-900 drop-shadow-lg" />
            </motion.div>

          </div> */}

          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight font-poppins">
            <span className="text-white drop-shadow-2xl">Open Your Daily Chest.</span>
            <br />
            <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent animate-glow drop-shadow-2xl">
              Win up to $10,000.
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-200 mb-16 max-w-3xl mx-auto font-montserrat font-light leading-relaxed">
            Join thousands of players opening daily chests and winning real money. 
            <br className="hidden md:block" />
            <span className="text-gold font-medium">Get early access and start earning today.</span>

          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {!user && true && (
            <div className="space-y-6 flex flex-col items-center justify-center">
              <Button
                variant="primary"
                size="lg"
                style={{ backgroundColor: '#591a11', borderColor: '#591a11' }}
                onClick={onJoinWaitlist}
                className="text-2xl px-16 py-8 shadow-2xl hover:shadow-brand/50 transform hover:scale-105 transition-all duration-300"
              >
                <Gift className="w-6 h-6 mr-3" />
                Join Waitlist
              </Button>
              <p className="text-sm text-gray-400 font-montserrat">
                🎁 <span className="text-gold">Free to join</span> • No credit card required • Instant access
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection