import React from 'react'
import { Clock } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'

const Countdown = ({ targetDate, label = 'Next chest in', className = '' }) => {
  const { timeLeft, isExpired } = useCountdown(targetDate)

  if (isExpired) {
    return (
      <div className={`flex items-center justify-center space-x-3 text-green-400 ${className}`}>
        {/* <Clock className="w-6 h-6 animate-pulse" /> */}
        <span className="font-poppins text-2xl font-bold animate-glow">Ready!</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        {/* <Clock className="w-4 h-4 text-gold" /> */}
        <span className="text-gold font-montserrat text-xs uppercase tracking-wider">{false ? label : ''}</span>
      </div>
      <div className="bg-gray-800/50 rounded-lg px-3 py-1 border border-gray-700/50">
        <div className="font-poppins text-lg font-bold text-white animate-glow">
          {timeLeft}
        </div>
      </div>
    </div>
  )
}

export default Countdown