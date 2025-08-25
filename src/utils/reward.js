// Fallback reward calculation logic
export const calculateReward = (isFirstChest = false) => {
  const random = Math.random()
  
  if (isFirstChest) {
    // First chest: 70% → $0.10, 30% → $0.20
    return random < 0.7 ? 0.10 : 0.20
  }
  
  // Other chests
  if (random < 0.2) return 0.00      // 20%
  if (random < 0.8) return 0.10      // 60%
  if (random < 0.85) return 0.20     // 5%
  if (random < 0.9) return 0.50      // 5%
  if (random < 0.95) return 1.00     // 5%
  
  // This should never happen in real rewards, only for display
  return 0.10
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}