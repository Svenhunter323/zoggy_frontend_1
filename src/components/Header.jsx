import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency } from '../utils/reward'
import Countdown from './Countdown'
import { getNextChestTime } from '../utils/time'
import { Shield, Menu, X, Home, LogIn, LayoutDashboard, LogOut } from 'lucide-react'
import AdminLoginModal from './AdminLoginModal'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Header = ({ minimal = false, title = null }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Check if URL contains /admin to show modal (only if not already logged in as admin)
  useEffect(() => {
    const adminToken = localStorage.getItem('zoggy_admin_token')
    if ((location.pathname === '/admin' || location.search.includes('admin=true')) && !adminToken) {
      setShowAdminModal(true)
    }
  }, [location])

  // Navigation menu items based on authentication status
  const getNavigationItems = () => {
    if (isAuthenticated) {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { action: 'logout', label: 'Logout', icon: LogOut }
      ]
    } else {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/signin', label: 'Sign In', icon: LogIn }
      ]
    }
  }

  const handleNavigation = (item) => {
    if (item.action === 'logout') {
      logout()
      navigate('/')
    } else {
      navigate(item.path)
    }
    setShowMobileMenu(false)
  }

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home'
    }
    return location.pathname === path
  }

  if (minimal) {
    return (
      <header className="w-full py-4 px-6 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            {/* <div className="relative">
              <img 
                src="/logo.svg" 
                alt="Zoggy Logo" 
                className="w-12 h-12 filter brightness-0 invert transition-transform hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-gold to-yellow-500 rounded-full opacity-20 blur-xs"></div>
            </div> */}
            <div className="flex flex-col">
              <img 
                src="/src/assets/logo.jpg" 
                alt="Zoggy Logo" 
                className="h-12 w-auto"
              />
            </div>
          </Link>
          
          {title && (
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
              <span className="text-4xl font-bold text-white font-montserrat uppercase tracking-widest">{title}</span>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {getNavigationItems().map((item) => (
                <button
                  key={item.path || item.action}
                  onClick={() => handleNavigation(item)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-gold text-gray-900 font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-800 mt-4 pt-4"
            >
              <nav className="flex flex-col space-y-2">
                {getNavigationItems().map((item) => (
                  <button
                    key={item.path || item.action}
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      isActivePath(item.path)
                        ? 'bg-gold text-gray-900 font-semibold'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        
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

  const nextChestTime = getNextChestTime(user.lastChestOpenAt, user.cooldownSeconds)

  return (
    <header className="w-full py-4 px-6 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
          {/* <div className="relative">
            <img 
              src="/logo.svg" 
              alt="Zoggy Logo" 
              className="w-12 h-12 filter brightness-0 invert transition-transform hover:scale-110"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-gold to-yellow-500 rounded-full opacity-20 blur-xs"></div>
          </div> */}
          <div className="flex flex-col">
            <img 
              src="/src/assets/logo.jpg" 
              alt="Zoggy Logo" 
              className="h-12 w-auto"
            />
          </div>
        </Link>
        
        {title && (
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
            <span className="text-4xl font-bold text-white font-montserrat uppercase tracking-widest">{title}</span>
          </div>
        )}

        <div className="flex items-center space-x-6">
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-4">
            {getNavigationItems().map((item) => (
              <button
                key={item.path || item.action}
                onClick={() => handleNavigation(item)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-gold text-gray-900 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="hidden sm:block text-right">
            <div className="text-sm text-gray-400">Balance</div>
            <div className="text-xl font-bold text-gold">
              ${user.totalCredits || '0.00'}
            </div>
          </div>

          {nextChestTime && (
            <div className="hidden lg:block w-48">
              <Countdown 
                targetDate={nextChestTime}
                className="text-right"
              />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800 mt-4 pt-4"
          >
            <nav className="flex flex-col space-y-2">
              {getNavigationItems().map((item) => (
                <button
                  key={item.path || item.action}
                  onClick={() => handleNavigation(item)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActivePath(item.path)
                      ? 'bg-gold text-gray-900 font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Mobile User Info */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center px-4 py-2">
                <div>
                  <div className="text-sm text-gray-400">Balance</div>
                  <div className="text-lg font-bold text-gold">
                    ${user.totalCredits || '0.00'}
                  </div>
                </div>
                {nextChestTime && (
                  <div className="text-right">
                    <Countdown 
                      targetDate={nextChestTime}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AdminLoginModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </header>
  )
}

export default Header