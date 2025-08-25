// User data structure and utility functions
export const createUser = (email, referralCode = null) => ({
  id: generateUserId(),
  email,
  position: Math.floor(Math.random() * 1000) + 9327,
  referralCode: generateReferralCode(),
  referredUsers: 0,
  credits: 0,
  claimCode: generateClaimCode(),
  lastChestOpen: null,
  hasJoinedTelegram: false,
})

export const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const generateClaimCode = () => {
  const prefix = 'ZOGGY'
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${suffix}`
}

export const generateUserId = () => {
  return Math.random().toString(36).substring(2, 15)
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const canOpenChest = (lastChestOpen) => {
  if (!lastChestOpen) return true
  
  const now = new Date()
  const lastOpen = new Date(lastChestOpen)
  const timeDiff = now.getTime() - lastOpen.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)
  
  return hoursDiff >= 24
}

export const getNextChestTime = (lastChestOpen) => {
  if (!lastChestOpen) return '00:00:00'
  
  const now = new Date()
  const lastOpen = new Date(lastChestOpen)
  const nextOpen = new Date(lastOpen.getTime() + 24 * 60 * 60 * 1000)
  
  if (now >= nextOpen) return '00:00:00'
  
  const timeDiff = nextOpen.getTime() - now.getTime()
  const hours = Math.floor(timeDiff / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}