import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://prelaunch-landing.onrender.com/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Check if this is an admin endpoint
  if (config.url.startsWith('/admin/')) {
    const adminToken = localStorage.getItem('zoggy_admin_token')
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    }
  } else {
    // Use regular user token for non-admin endpoints
    const token = localStorage.getItem('zoggy_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this was an admin request
      if (error.config?.url?.startsWith('/admin/')) {
        localStorage.removeItem('zoggy_admin_token')
        window.location.href = '/'
      } else {
        localStorage.removeItem('zoggy_token')
        window.location.href = '/signin'
      }
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  signup: (email, referralCode = null, deviceFingerprint = null) => 
    api.post('/auth/signup', { 
      email, 
      ref: referralCode,
      deviceFingerprint,
      timestamp: Date.now()
    }),
  
  signin: (email) => 
    api.post('/auth/signin', { email }),
  
  getMe: () => 
    api.get('/me'),
  
  resendVerification: (email) => 
    api.post('/auth/resend', { email }),
  
  checkEmailExists: (email) =>
    api.post('/auth/check-email', { email }),
}

// User endpoints
export const userAPI = {
  register: (email, referralCode) => 
    api.post('/auth/register', { email, referralCode }),
    
  login: (email) => 
    api.post('/auth/login', { email }),
    
  verifyEmail: (token) => 
    api.post('/auth/verify-email', { token }),
    
  getProfile: () => 
    api.get('/auth/profile'),
    
  getDashboard: () => 
    api.get('/dashboard'),
}

// Telegram endpoints
export const telegramAPI = {
  getDeeplink: () => 
    api.get('/telegram/deeplink'),
  
  verifyStatus: () => 
    api.get('/telegram/verify-status'),
    
  markAsVerified: (telegramUserId) => 
    api.post('/telegram/verify', { telegramUserId }),
}

// Chest endpoints
export const chestAPI = {
  open: () => 
    api.post('/chest/open'),
}

// Data endpoints
export const dataAPI = {
  getStats: () => 
    api.get('/stats'),
  
  getLatestWins: (limit = 24) => 
    api.get(`/wins/latest?limit=${limit}`),
  
  getLeaderboard: () => 
    api.get('/leaderboard/top10'),
}

// Admin endpoints
export const adminAPI = {
  login: (email, password) => 
    api.post('/admin/login', { email, password }),
    
  getUsers: () => 
    api.get('/admin/users'),
  
  getReferrals: () => 
    api.get('/admin/referrals'),
  
  exportClaimCodes: () => 
    api.get('/admin/exports/claim-codes.csv', { responseType: 'blob' }),
}

export default api