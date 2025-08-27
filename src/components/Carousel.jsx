import React from 'react'
import { motion } from 'framer-motion'
import banner0 from '../assets/banerrs/0.png' // desktop
import banner1 from '../assets/banerrs/1.png' // mobile

const Carousel = ({ className = "" }) => {
  const fade = {
    hidden: { opacity: 0, scale: 1.01, filter: 'blur(2px)' },
    show:   { opacity: 1, scale: 1,    filter: 'blur(0px)', transition: { duration: 0.4 } },
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* MOBILE: just full width, auto height */}
      <div className="sm:hidden w-full">
        <motion.img
          initial="hidden"
          animate="show"
          variants={fade}
          src={banner1}
          alt="Mobile banner"
          className="w-full h-auto object-contain"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 border-2 border-gold/30 pointer-events-none" />
      </div>

      {/* DESKTOP: keep aspect ratio */}
      <div className="relative hidden sm:block aspect-[32/10]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <motion.img
          initial="hidden"
          animate="show"
          variants={fade}
          src={banner0}
          alt="Desktop banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 border-2 border-gold/30 pointer-events-none" />
      </div>
    </div>
  )
}

export default Carousel
