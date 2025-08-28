// Rate limiting utilities for signup prevention
const RATE_LIMIT_KEY = 'zoggy_signup_attempts'
const IP_RATE_LIMIT_KEY = 'zoggy_ip_attempts'
const MAX_ATTEMPTS_PER_HOUR = 3
const MAX_ATTEMPTS_PER_DAY = 5
const HOUR_IN_MS = 60 * 60 * 1000
const DAY_IN_MS = 24 * 60 * 60 * 1000

// Get client IP address (approximation using various methods)
export const getClientIP = async () => {
  try {
    const res = await fetch('/api/ip', { credentials: 'include' });
    const { ip } = await res.json();
    return ip;
    // Try to get IP from various sources
    const responses = await Promise.allSettled([
      fetch('https://api.ipify.org?format=json'),
      fetch(`${location.origin}/proxy/ipapi`),
      fetch('https://httpbin.org/ip')
    ])
    
    for (const response of responses) {
      if (response.status === 'fulfilled' && response.value.ok) {
        const data = await response.value.json()
        return data.ip || data.origin || null
      }
    }
    
    // Fallback: use a hash of user agent + screen info as pseudo-IP
    const pseudoIP = btoa(navigator.userAgent + screen.width + screen.height).slice(0, 16)
    return `pseudo_${pseudoIP}`
  } catch (e) {
    console.warn('Failed to get IP address:', e)
    return null
  }
}

// Check if IP has exceeded rate limit
export const checkIPRateLimit = async () => {
  try {
    const ip = await getClientIP()
    if (!ip) return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR }
    
    const key = `${IP_RATE_LIMIT_KEY}_${ip}`
    const stored = localStorage.getItem(key)
    
    if (!stored) {
      return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR }
    }
    
    const data = JSON.parse(stored)
    const now = Date.now()
    
    // Clean up old attempts (older than 1 hour)
    data.attempts = data.attempts.filter(timestamp => now - timestamp < HOUR_IN_MS)
    
    // Check hourly limit
    if (data.attempts.length >= MAX_ATTEMPTS_PER_HOUR) {
      const oldestAttempt = Math.min(...data.attempts)
      const timeUntilReset = HOUR_IN_MS - (now - oldestAttempt)
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(now + timeUntilReset),
        message: `Too many signup attempts from this IP. Please try again in ${Math.ceil(timeUntilReset / (60 * 1000))} minutes.`
      }
    }
    
    // Check daily limit
    const todayAttempts = data.attempts.filter(timestamp => now - timestamp < DAY_IN_MS)
    if (todayAttempts.length >= MAX_ATTEMPTS_PER_DAY) {
      return {
        allowed: false,
        remaining: 0,
        message: 'Daily signup limit exceeded. Please try again tomorrow.'
      }
    }
    
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS_PER_HOUR - data.attempts.length
    }
  } catch (e) {
    console.warn('Rate limit check failed:', e)
    return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR }
  }
}

// Record a signup attempt
export const recordSignupAttempt = async () => {
  try {
    const ip = await getClientIP()
    if (!ip) return
    
    const key = `${IP_RATE_LIMIT_KEY}_${ip}`
    const stored = localStorage.getItem(key)
    const now = Date.now()
    
    let data = { attempts: [] }
    if (stored) {
      data = JSON.parse(stored)
      // Clean up old attempts
      data.attempts = data.attempts.filter(timestamp => now - timestamp < DAY_IN_MS)
    }
    
    data.attempts.push(now)
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to record signup attempt:', e)
  }
}

// Check device-based rate limiting
export const checkDeviceRateLimit = () => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    if (!stored) {
      return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR }
    }
    
    const data = JSON.parse(stored)
    const now = Date.now()
    
    // Clean up old attempts
    data.attempts = data.attempts.filter(timestamp => now - timestamp < HOUR_IN_MS)
    
    if (data.attempts.length >= MAX_ATTEMPTS_PER_HOUR) {
      const oldestAttempt = Math.min(...data.attempts)
      const timeUntilReset = HOUR_IN_MS - (now - oldestAttempt)
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(now + timeUntilReset),
        message: `Too many signup attempts. Please try again in ${Math.ceil(timeUntilReset / (60 * 1000))} minutes.`
      }
    }
    
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS_PER_HOUR - data.attempts.length
    }
  } catch (e) {
    console.warn('Device rate limit check failed:', e)
    return { allowed: true, remaining: MAX_ATTEMPTS_PER_HOUR }
  }
}

// Record device signup attempt
export const recordDeviceAttempt = () => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    const now = Date.now()
    
    let data = { attempts: [] }
    if (stored) {
      data = JSON.parse(stored)
      // Clean up old attempts
      data.attempts = data.attempts.filter(timestamp => now - timestamp < DAY_IN_MS)
    }
    
    data.attempts.push(now)
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to record device attempt:', e)
  }
}
