import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Pages
import LandingPage from '../pages/LandingPage'
import SigninPage from '../pages/SigninPage'
import VerifyEmailPage from '../pages/VerifyEmailPage'
import DashboardPage from '../pages/DashboardPage'
import AdminPage from '../pages/AdminPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-brand rounded-full animate-spin"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />
}

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('zoggy_admin_token')
  
  if (!adminToken) {
    return <Navigate to="/?admin=true" replace />
  }

  return children
}

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminProtectedRoute>
              <AdminPage />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRouter