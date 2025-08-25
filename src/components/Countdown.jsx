import React from 'react'
import { Clock } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'

const Countdown = ({ targetDate, label = 'Next chest in', className = '' }) => {
  const { timeLeft, isExpired } = useCountdown(targetDate)

  if (isExpired) {
    return (
      <div className={`flex items-center justify-center space-x-3 text-green-400 ${className}`}>
        <Clock className="w-6 h-6 animate-pulse" />
        <span className="font-poppins text-2xl font-bold animate-glow">Ready!</span>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center space-x-2 mb-2">
        <Clock className="w-5 h-5 text-gold" />
        <span className="text-gold font-montserrat text-sm uppercase tracking-wider">{label}</span>
      </div>
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
        <div className="font-poppins text-3xl font-bold text-white animate-glow">
          {timeLeft}
        </div>
      </div>
    </div>
  )
}

export default Countdown