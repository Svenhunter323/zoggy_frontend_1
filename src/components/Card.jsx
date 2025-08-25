import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  ...props 
}) => {
  const baseClasses = 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm'
  const hoverClasses = hover ? 'hover:shadow-2xl hover:shadow-gray-900/50 hover:border-gray-600/70 hover:scale-[1.02] transition-all duration-500' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card