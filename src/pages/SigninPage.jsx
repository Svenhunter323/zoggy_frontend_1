import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, LogIn } from 'lucide-react'
import { authAPI } from '../api/endpoints'
import { validateEmail } from '../utils/userUtils'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Button from '../components/Button'
import Card from '../components/Card'
import { useToast } from '../contexts/ToastContext'

const SigninPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken, setUser } = useAuth()
  const { showToast, ToastContainer } = useToast()
  
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Pre-fill email if passed from signup
    if (location.state?.email) {
      setEmail(location.state.email)
    }
  }, [location.state])

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
      const response = await authAPI.signin(email)
      const { token, user } = response.data
      
      setToken(token)
      setUser(user)
      
      showToast('Successfully signed in!', 'success')
      navigate('/dashboard')
    } catch (error) {
      console.error('Signin failed:', error)
      if (error.response?.status === 404) {
        setEmailError('Email not found. Please sign up first.')
      } else if (error.response?.status === 403) {
        setEmailError('Please verify your email before signing in.')
      } else {
        setEmailError('Failed to sign in. Please try again.')
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
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-400">
              Sign in to access your dashboard
            </p>
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-gold hover:text-yellow-400 transition-colors"
                >
                  Join waitlist
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

export default SigninPage