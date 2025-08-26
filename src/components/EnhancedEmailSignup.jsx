import React, { useState, useEffect, useCallback } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader, Shield, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { authAPI } from '../api/endpoints'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { useToast } from '../contexts/ToastContext'
import { validateEmail } from '../utils/emailValidation'
import { 
  generateDeviceFingerprint, 
  hasDeviceSignedUpBefore, 
  markDeviceAsSignedUp 
} from '../utils/deviceFingerprint'
import { 
  checkIPRateLimit, 
  checkDeviceRateLimit, 
  recordSignupAttempt, 
  recordDeviceAttempt 
} from '../utils/rateLimiting'

const EnhancedEmailSignup = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [validationState, setValidationState] = useState({
    isValid: false,
    errors: [],
    isChecking: false,
    emailExists: false
  })
  const [rateLimitState, setRateLimitState] = useState({
    allowed: true,
    message: '',
    resetTime: null
  })
  const [deviceFingerprint, setDeviceFingerprint] = useState(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const { setToken, setUser } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Initialize device fingerprint and check rate limits
  useEffect(() => {
    const initializeChecks = async () => {
      // Generate device fingerprint
      const fingerprint = generateDeviceFingerprint()
      setDeviceFingerprint(fingerprint)

      // Check if device has already signed up
      if (hasDeviceSignedUpBefore()) {
        setRateLimitState({
          allowed: false,
          message: 'This device has already been used to join the waitlist.',
          resetTime: null
        })
        return
      }

      // Check rate limits
      const [ipLimit, deviceLimit] = await Promise.all([
        checkIPRateLimit(),
        checkDeviceRateLimit()
      ])

      if (!ipLimit.allowed) {
        setRateLimitState({
          allowed: false,
          message: ipLimit.message,
          resetTime: ipLimit.resetTime
        })
      } else if (!deviceLimit.allowed) {
        setRateLimitState({
          allowed: false,
          message: deviceLimit.message,
          resetTime: deviceLimit.resetTime
        })
      }
    }

    initializeChecks()
  }, [])

  // Email validation and duplicate checking
  const checkEmailAvailability = useCallback(async (emailToCheck) => {
    if (!emailToCheck) return

    setIsCheckingEmail(true)
    setValidationState(prev => ({ ...prev, isChecking: true }))

    try {
      // First validate email format and disposable check
      const validation = validateEmail(emailToCheck)
      
      if (!validation.isValid) {
        setValidationState({
          isValid: false,
          errors: validation.errors,
          isChecking: false,
          emailExists: false
        })
        setIsCheckingEmail(false)
        return
      }

      // Check if email already exists in backend
      try {
        const response = await authAPI.signin(emailToCheck)
        // If signin succeeds, email exists
        setValidationState({
          isValid: false,
          errors: ['This email is already registered. You\'re already on the waitlist!'],
          isChecking: false,
          emailExists: true
        })
      } catch (error) {
        if (error.response?.status === 404) {
          // Email doesn't exist - good to go
          setValidationState({
            isValid: true,
            errors: [],
            isChecking: false,
            emailExists: false
          })
        } else if (error.response?.status === 403) {
          // Email exists but not verified
          setValidationState({
            isValid: false,
            errors: ['This email is already registered but not verified. Please check your email.'],
            isChecking: false,
            emailExists: true
          })
        } else {
          // Other error - assume email is available but show warning
          setValidationState({
            isValid: true,
            errors: ['Unable to verify email availability. You can still proceed.'],
            isChecking: false,
            emailExists: false
          })
        }
      }
    } catch (error) {
      console.error('Email validation error:', error)
      setValidationState({
        isValid: false,
        errors: ['Unable to validate email. Please try again.'],
        isChecking: false,
        emailExists: false
      })
    } finally {
      setIsCheckingEmail(false)
    }
  }, [])

  // Immediate email validation on change
  useEffect(() => {
    if (!email.trim()) {
      setValidationState({
        isValid: false,
        errors: [],
        isChecking: false,
        emailExists: false
      })
      return
    }

    checkEmailAvailability(email.trim().toLowerCase())
  }, [email, checkEmailAvailability])

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    
    // Reset validation state when user types
    if (validationState.emailExists || validationState.errors.length > 0) {
      setValidationState(prev => ({
        ...prev,
        errors: [],
        emailExists: false
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (hasSubmitted) {
      showToast('Please wait, your previous submission is being processed.', 'warning')
      return
    }

    if (!rateLimitState.allowed) {
      showToast(rateLimitState.message, 'error')
      return
    }

    if (!email.trim()) {
      showToast('Please enter your email address', 'error')
      return
    }

    if (!validationState.isValid || validationState.emailExists) {
      showToast('Please fix the email issues before submitting', 'error')
      return
    }

    setIsLoading(true)
    setHasSubmitted(true)

    try {
      // Record attempt for rate limiting
      await Promise.all([
        recordSignupAttempt(),
        recordDeviceAttempt()
      ])

      // Attempt signup with device fingerprint
      const referralCode = new URLSearchParams(window.location.search).get('ref')
      const response = await authAPI.signup(
        email.trim().toLowerCase(), 
        referralCode, 
        deviceFingerprint
      )
      
      if (response.data.token) {
        // Instant login - user is automatically authenticated
        setToken(response.data.token)
        setUser(response.data.user)
        
        // Mark device as signed up
        markDeviceAsSignedUp()
        
        showToast('🎉 Welcome! You\'re now signed in and ready to start earning!', 'success')
        
        // Redirect to dashboard
        navigate('/dashboard')
        
        if (onSuccess) {
          onSuccess(response.data)
        }
      } else {
        // Fallback - redirect to verification if needed
        showToast('Please check your email to verify your account', 'info')
        navigate('/verify-email', { state: { email: signupData.email } })
      }
    } catch (error) {
      console.error('Signup failed:', error)
      
      if (error.response?.status === 409) {
        // Email already exists
        showToast('This email is already registered. Redirecting to sign in...', 'info')
        setTimeout(() => {
          navigate('/signin', { state: { email: email.trim().toLowerCase() } })
        }, 2000)
      } else if (error.response?.status === 429) {
        // Rate limited
        showToast('Too many signup attempts. Please try again later.', 'error')
        setRateLimitState({
          allowed: false,
          message: 'Rate limit exceeded. Please try again later.',
          resetTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        })
      } else if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Invalid email format'
        showToast(errorMessage, 'error')
      } else {
        showToast('Something went wrong. Please try again.', 'error')
      }
    } finally {
      setIsLoading(false)
      // Reset submission flag after a delay to prevent rapid resubmission
      setTimeout(() => setHasSubmitted(false), 3000)
    }
  }

  const getValidationIcon = () => {
    if (isCheckingEmail || validationState.isChecking) {
      return <Loader className="w-5 h-5 text-gold animate-spin" />
    }
    
    if (validationState.errors.length > 0) {
      return <AlertCircle className="w-5 h-5 text-red-400" />
    }
    
    if (validationState.isValid && email.trim()) {
      return <CheckCircle className="w-5 h-5 text-green-400" />
    }
    
    return null
  }

  const isSubmitDisabled = !rateLimitState.allowed || 
                          !validationState.isValid || 
                          validationState.emailExists || 
                          isLoading || 
                          hasSubmitted || 
                          isCheckingEmail ||
                          validationState.isChecking

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Rate Limit Warning */}
      <AnimatePresence>
        {!rateLimitState.allowed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm font-montserrat">
                {rateLimitState.message}
              </p>
            </div>
            {rateLimitState.resetTime && (
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="w-4 h-4 text-red-400" />
                <p className="text-red-300 text-xs">
                  Try again after {rateLimitState.resetTime.toLocaleTimeString()}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="email"
              placeholder="Enter your email to join waitlist"
              value={email}
              onChange={handleEmailChange}
              className={`w-full pl-12 pr-12 py-4 bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-lg ${
                !rateLimitState.allowed
                  ? 'border-red-500 bg-red-500/5 cursor-not-allowed'
                  : validationState.errors.length > 0
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
                  : validationState.isValid && email.trim()
                  ? 'border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20'
                  : 'border-gray-600 focus:border-gold focus:ring-2 focus:ring-gold/20'
              }`}
              disabled={isLoading || !rateLimitState.allowed}
              autoComplete="email"
              spellCheck="false"
            />
            
            {/* Validation Icon */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <AnimatePresence mode="wait">
                {getValidationIcon() && (
                  <motion.div
                    key={isCheckingEmail ? 'loading' : validationState.errors.length > 0 ? 'error' : 'valid'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getValidationIcon()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Error Messages */}
          <AnimatePresence>
            {validationState.errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 space-y-1"
              >
                {validationState.errors.map((error, index) => (
                  <p key={index} className="text-red-400 text-sm ml-1 font-montserrat">
                    {error}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Checking Status */}
          <AnimatePresence>
            {(isCheckingEmail || validationState.isChecking) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-gold text-sm mt-2 ml-1 font-montserrat"
              >
                Checking email availability...
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          disabled={isSubmitDisabled}
          className="w-full text-xl py-4 bg-gradient-to-r from-brand to-red-700 hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-brand/50"
        >
          {isLoading ? 'Joining...' : 'JOIN THE WAITLIST'}
        </Button>

        <div className="text-center">
          {/* <p className="text-sm text-gray-400 font-montserrat">
            🎁 <span className="text-gold">Instant access</span> • No verification required • Start earning immediately
          </p> */}
          
          {validationState.isValid && email.trim() && !validationState.emailExists && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-xs mt-2 font-montserrat"
            >
              ✓ Email is available and ready to join!
            </motion.p>
          )}
        </div>
      </form>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
      >
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-400" />
          <p className="text-gray-400 text-xs font-montserrat">
            Protected against spam and multiple signups. One email per person.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EnhancedEmailSignup
