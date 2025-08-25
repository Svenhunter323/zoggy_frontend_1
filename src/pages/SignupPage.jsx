import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Users } from 'lucide-react'
import { authAPI } from '../api/endpoints'
import { validateEmail } from '../utils/userUtils'
import Header from '../components/Header'
import Button from '../components/Button'
import Card from '../components/Card'
import { useToast
  
 } from '../contexts/ToastContext'
const SignupPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast, ToastContainer } = useToast()
  
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      setReferralCode(refCode)
    }
  }, [searchParams])

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
      await authAPI.signup(email, referralCode || null)
      showToast('Successfully joined the waitlist!', 'success')
      setTimeout(() => {
        navigate('/signin', { state: { email } })
      }, 1500)
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
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand transition-all ${
                      emailError ? 'border-red-500 ring-red-500' : 'border-gray-600'
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