import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency } from '../utils/reward'
import Countdown from './Countdown'
import { getNextChestTime } from '../utils/time'
import { Shield } from 'lucide-react'
import AdminLoginModal from './AdminLoginModal'
import { useLocation } from 'react-router-dom'

const Header = ({ minimal = false, title = null }) => {
  const { user, isAuthenticated } = useAuth()
  const [showAdminModal, setShowAdminModal] = useState(false)
  const location = useLocation()

  // Check if URL contains /admin to show modal (only if not already logged in as admin)
  useEffect(() => {
    const adminToken = localStorage.getItem('zoggy_admin_token')
    if ((location.pathname === '/admin' || location.search.includes('admin=true')) && !adminToken) {
      setShowAdminModal(true)
    }
  }, [location])

  if (minimal) {
    return (
      <header className="w-full py-4 px-6 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="/logo.svg" 
                alt="Zoggy Logo" 
                className="w-12 h-12 filter brightness-0 invert transition-transform hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-gold to-yellow-500 rounded-full opacity-20 blur-xs"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white font-poppins tracking-tight">Zoggy</span>
            </div>
          </div>
          
          {title && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <span className="text-4xl font-bold text-white font-montserrat uppercase tracking-widest">{title}</span>
            </div>
          )}
          
          {/* Admin button commented out - use /admin URL instead
          <button
            onClick={() => setShowAdminModal(true)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Admin Login"
          >
            <Shield className="w-5 h-5" />
          </button>
          */}
        </div>
        
        <AdminLoginModal 
          isOpen={showAdminModal} 
          onClose={() => setShowAdminModal(false)} 
        />
      </header>
    )
  }

  if (!isAuthenticated || !user) {
    return <Header minimal={true} />
  }

  const nextChestTime = getNextChestTime(user.lastOpenAt, user.cooldownSeconds)

  return (
    <header className="w-full py-4 px-6 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src="/logo.svg" 
              alt="Zoggy Logo" 
              className="w-12 h-12 filter brightness-0 invert transition-transform hover:scale-110"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-gold to-yellow-500 rounded-full opacity-20 blur-xs"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white font-poppins tracking-tight">Zoggy</span>
          </div>
        </div>
        
        {title && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-4xl font-bold text-white font-montserrat uppercase tracking-widest">{title}</span>
          </div>
        )}

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm text-gray-400">Balance</div>
            <div className="text-xl font-bold text-gold">
              ${user.balance || '0.00'}
            </div>
          </div>

          {nextChestTime && (
            <div className="w-48">
              <Countdown 
                targetDate={nextChestTime}
                className="text-right"
              />
            </div>
          )}
          
          {/* Admin button commented out - use /admin URL instead
          <button
            onClick={() => setShowAdminModal(true)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Admin Login"
          >
            <Shield className="w-5 h-5" />
          </button>
          */}
        </div>
      </div>
      
      <AdminLoginModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </header>
  )
}

export default Header