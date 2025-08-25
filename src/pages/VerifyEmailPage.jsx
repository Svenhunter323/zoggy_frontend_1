import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Mail } from 'lucide-react'
import { authAPI, userAPI } from '../api/endpoints'
import Header from '../components/Header'
import Button from '../components/Button'
import { useToast } from '../contexts/ToastContext'
import Card from '../components/Card'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()
  
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const [isResending, setIsResending] = useState(false)
  
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  // console.log(token);

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const response = await userAPI.verifyEmail(token)
      
      setStatus('success')
      setMessage(response.data.message || 'Email verified successfully!')
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } catch (error) {
      console.error('Verification failed:', error)
      setStatus('error')
      setMessage('Verification failed. The link may be expired or invalid.')
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      showToast('Email address not found', 'error')
      return
    }

    setIsResending(true)
    
    try {
      await authAPI.resendVerification(email)
      showToast('Verification email sent!', 'success')
    } catch (error) {
      console.error('Failed to resend verification:', error)
      showToast('Failed to resend verification email', 'error')
    } finally {
      setIsResending(false)
    }
  }
console.log(status)
  return (
    <div className="min-h-screen bg-gray-950">
      <Header minimal={true} />
      
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <Card className="text-center">
            {status === 'verifying' && (
              <>
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">
                  Verifying Email
                </h1>
                <div className="w-8 h-8 border-4 border-gray-600 border-t-brand rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">
                  Email Verified!
                </h1>
                <p className="text-gray-400 mb-6">
                  {message} Redirecting to dashboard...
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">
                  Verification Failed
                </h1>
                <p className="text-gray-400 mb-6">
                  {message}
                </p>
                <div className="space-y-4">
                  {email && (
                    <Button
                      variant="primary"
                      onClick={handleResendVerification}
                      loading={isResending}
                      className="w-full"
                    >
                      Resend Verification
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => navigate('/signin')}
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default VerifyEmailPage