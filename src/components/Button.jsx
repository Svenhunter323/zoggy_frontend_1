import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-poppins transform hover:shadow-2xl active:scale-95'
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand to-red-700 hover:from-brand/90 hover:to-red-600 text-white shadow-lg hover:shadow-brand/50 border border-brand/50',
    secondary: 'bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-400 text-gray-900 shadow-lg hover:shadow-gold/50 border border-gold/50',
    outline: 'border-2 border-brand text-brand hover:bg-gradient-to-r hover:from-brand hover:to-red-700 hover:text-white hover:border-transparent',
    ghost: 'text-brand hover:bg-brand/10 hover:text-brand/80',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  )
}

export default Button