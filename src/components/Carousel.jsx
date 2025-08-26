import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import banner0 from '../assets/banerrs/0.png'
import banner1 from '../assets/banerrs/1.png'
import banner2 from '../assets/banerrs/2.png'
import banner3 from '../assets/banerrs/3.jpg'

const Carousel = ({ autoSlide = true, slideInterval = 5000, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [mobilePadTop, setMobilePadTop] = useState(56) // default ~16:9 while loading
  const images = [banner0, banner1, banner2, banner3]

  useEffect(() => {
    if (!autoSlide || images.length <= 1) return
    const interval = setInterval(
      () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1)),
      slideInterval
    )
    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, images.length])

  useEffect(() => {
    setImgLoaded(false)
  }, [currentIndex])

  const slideVariants = {
    enter: { opacity: 0, scale: 1.1, x: 60, filter: "blur(4px) brightness(1.1)" },
    center:{ opacity: 1, scale: 1,  x: 0, filter: "blur(0px) brightness(0.6)" },
    exit:  { opacity: 0, scale: 0.95,x:-60, filter: "blur(4px) brightness(0.3)" }
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Aspect-ratio spacer:
          - Mobile: set by actual image ratio (padding-top % = H/W*100)
          - Desktop: keep your wide hero (pt-[32%]) */}
      <div className="block sm:hidden" style={{ paddingTop: `${mobilePadTop}%` }} aria-hidden="true" />
      <div className="hidden sm:block pt-[32%]" aria-hidden="true" />

      {/* Content fills the reserved space */}
      <div className="absolute inset-0">
        {/* Non-deforming background/placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-800/40 via-gray-700/30 to-gray-900/40" />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.2, type: "spring", damping: 24, stiffness: 140 }}
            className="absolute inset-0 z-10"
          >
            <img
              src={images[currentIndex]}
              alt={`Banner ${currentIndex + 1}`}
              className="w-full h-full object-contain sm:object-cover object-center block"
              onLoad={(e) => {
                setImgLoaded(true)
                const nw = e.currentTarget.naturalWidth || 0
                const nh = e.currentTarget.naturalHeight || 0
                if (nw && nh) setMobilePadTop((nh / nw) * 100) // <-- match image ratio on mobile
              }}
              onError={(e) => {
                console.error('Failed to load image:', images[currentIndex])
                e.currentTarget.style.display = 'none'
              }}
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950/60 via-gray-900/40 to-gray-950/60 pointer-events-none" />
            <div className="absolute inset-0 border-2 border-gold/30 animate-pulse pointer-events-none" />
            <div className="absolute top-4 left-4 w-3 h-3 bg-gold rounded-full animate-ping opacity-75 pointer-events-none" />
            <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60 pointer-events-none" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-gold rounded-full animate-ping opacity-50 pointer-events-none" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-70 pointer-events-none" style={{ animationDelay: '1.5s' }} />
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-500 transform ${
                  i === currentIndex
                    ? 'bg-gold shadow-lg shadow-gold/80 scale-125 animate-pulse border-2 border-yellow-300'
                    : 'bg-white/40 hover:bg-gold/60 hover:scale-110 border border-white/20'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Carousel
