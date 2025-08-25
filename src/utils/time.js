export const formatTimeRemaining = (targetDate) => {
  if (!targetDate) return '00:00:00'
  
  const now = new Date().getTime()
  const target = new Date(targetDate).getTime()
  const difference = target - now
  
  if (difference <= 0) return '00:00:00'
  
  const hours = Math.floor(difference / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const canOpenChest = (lastOpenAt, cooldownSeconds) => {
  if (!lastOpenAt) return true
  if (cooldownSeconds !== undefined) {
    return cooldownSeconds <= 0
  }
  
  const now = new Date()
  const lastOpen = new Date(lastOpenAt)
  const timeDiff = now.getTime() - lastOpen.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)
  
  return hoursDiff >= 24
}

export const getNextChestTime = (lastOpenAt, cooldownSeconds) => {
  if (!lastOpenAt) return null
  if (cooldownSeconds !== undefined && cooldownSeconds > 0) {
    const nextOpen = new Date(Date.now() + cooldownSeconds * 1000)
    return nextOpen.toISOString()
  }
  
  const lastOpen = new Date(lastOpenAt)
  const nextOpen = new Date(lastOpen.getTime() + 24 * 60 * 60 * 1000)
  
  return nextOpen.toISOString()
}