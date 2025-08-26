import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Users } from 'lucide-react'
import { authAPI } from '../api/endpoints'
import { validateEmail } from '../utils/userUtils'
import Header from '../components/Header'
import Button from '../components/Button'
import Card from '../components/Card'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import { generateDeviceFingerprint } from '../utils/deviceFingerprint'
const SignupPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const { setToken, setUser } = useAuth()
  
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [emailValid, setEmailValid] = useState(null)
  const [deviceFingerprint, setDeviceFingerprint] = useState(null)

  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      setReferralCode(refCode)
    }
    
    // Generate device fingerprint
    const fingerprint = generateDeviceFingerprint()
    setDeviceFingerprint(fingerprint)
  }, [searchParams])

  // Real-time email validation
  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setEmailError('')
    
    if (value) {
      if (validateEmail(value)) {
        setEmailValid(true)
      } else {
        setEmailValid(false)
        setEmailError('Please enter a valid email address')
      }
    } else {
      setEmailValid(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')

    if (!email) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    try {
      const signupResponse = await authAPI.signup(
        email, 
        referralCode || null, 
        deviceFingerprint
      )
      
      // Instant auto-login after successful signup
      try {
        const signinResponse = await authAPI.signin(email)
        const { token, user } = signinResponse.data
        
        setToken(token)
        setUser(user)
        
        showToast('Welcome! You\'ve been automatically logged in.', 'success')
        navigate('/dashboard')
      } catch (signinError) {
        // Fallback to manual signin if auto-login fails
        showToast('Successfully joined! Please sign in to continue.', 'success')
        navigate('/signin', { state: { email } })
      }
    } catch (error) {
      console.error('Signup failed:', error)
      if (error.response?.status === 409) {
        setEmailError('Email already registered. Try signing in instead.')
      } else {
        setEmailError('Failed to join waitlist. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header minimal={true} />
      
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-900" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Join the Waitlist
            </h1>
            <p className="text-xl text-gray-400">
              Get early access and start earning daily rewards
            </p>
            {referralCode && (
              <p className="text-gold mt-2">
                🎁 You were referred! You'll get a bonus chest when you join.
              </p>
            )}
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      emailError ? 'border-red-500 ring-red-500 focus:ring-red-500' : 
                      emailValid === true ? 'border-green-500 ring-green-500 focus:ring-green-500' :
                      'border-gray-600 focus:ring-brand'
                    }`}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-red-400 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {referralCode && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Referral Code
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gold font-mono focus:outline-none"
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Join Waitlist
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/signin')}
                  className="text-gold hover:text-yellow-400 transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* <ToastContainer /> */}
    </div>
  )
}

export default SignupPage