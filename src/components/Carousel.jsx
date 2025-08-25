import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Carousel = ({ images, autoSlide = true, slideInterval = 5000, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoSlide || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, slideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, images.length])

  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.2,
      rotateY: 15,
      x: 100,
      filter: "blur(4px) brightness(1.2)",
    },
    center: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      x: 0,
      filter: "blur(0px) brightness(0.4)",
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateY: -15,
      x: -100,
      filter: "blur(4px) brightness(0.2)",
    }
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Fallback background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 2,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            damping: 20,
            stiffness: 100
          }}
          className="absolute inset-0 w-full h-full z-10"
        >
          <img
            src={images[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            style={{
              minHeight: '100vh',
              minWidth: '100vw',
            }}
            onError={(e) => {
              console.error('Failed to load image:', images[currentIndex]);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Image loaded:', images[currentIndex]);
            }}
          />
          {/* Casino-style overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950/60 via-gray-900/40 to-gray-950/60" />
          
          {/* Animated border glow effect */}
          <div className="absolute inset-0 border-2 border-gold/30 animate-pulse" />
          
          {/* Corner sparkle effects */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-gold rounded-full animate-ping opacity-75" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-gold rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-70" style={{ animationDelay: '1.5s' }} />
        </motion.div>
      </AnimatePresence>
      
      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 transform ${
                index === currentIndex 
                  ? 'bg-gold shadow-lg shadow-gold/80 scale-125 animate-pulse border-2 border-yellow-300' 
                  : 'bg-white/40 hover:bg-gold/60 hover:scale-110 border border-white/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
