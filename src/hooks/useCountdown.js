import { useState, useEffect } from 'react'

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft('00:00:00')
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft('00:00:00')
        setIsExpired(true)
        clearInterval(timer)
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
      setIsExpired(false)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return { timeLeft, isExpired }
}