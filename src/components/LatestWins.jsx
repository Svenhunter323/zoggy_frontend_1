import React, { useState, useEffect } from 'react'
import { Trophy, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '../utils/reward'
import { useApi } from '../hooks/useApi'
import { dataAPI } from '../api/endpoints'
import { getRandomUsername, getRandomCountry, generateAvatar } from '../utils/usernames'
import Card from './Card'

// Counter for unique IDs
let winCounter = 0

// Big win tracking
let lastBigWin = 0 // timestamp of last $2k+ win
let recentMegaWins = [] // timestamps of $10k+ wins
let smallWinsAfterBig = 0 // counter for small wins after big win

// Fake wins generator with enhanced cadence rules
const generateFakeWin = () => {
  const username = getRandomUsername() || 'Anonymous'
  const countryData = getRandomCountry()
  const country = countryData && countryData.name && countryData.flag ? 
    countryData : 
    { name: 'Unknown', flag: '🌍', code: 'XX' }
  const avatar = generateAvatar(username)
  
  const now = Date.now()
  let amount
  
  // Check constraints for big wins
  const oneHourAgo = now - 60 * 60 * 1000
  const threeHoursAgo = now - 3 * 60 * 60 * 1000
  
  // Clean up old mega wins
  recentMegaWins = recentMegaWins.filter(time => time > threeHoursAgo)
  
  // Determine win amount based on constraints
  const random = Math.random()
  
  // Force small wins after big win (5-10 small wins after $2k+)
  if (smallWinsAfterBig > 0 && smallWinsAfterBig < 10) {
    amount = Math.floor(Math.random() * 45) + 5 // $5-$50
    smallWinsAfterBig++
  }
  // Check for mega win ($10k+) - max 1 per 3 hours
  else if (random > 0.9995 && recentMegaWins.length === 0) {
    amount = Math.floor(Math.random() * 15000) + 10000 // $10k-$25k
    recentMegaWins.push(now)
    smallWinsAfterBig = 1 // Start small win counter
  }
  // Check for big win ($2k+) - max 1 per hour
  else if (random > 0.995 && (now - lastBigWin) > oneHourAgo && smallWinsAfterBig === 0) {
    amount = Math.floor(Math.random() * 8000) + 2000 // $2k-$10k
    lastBigWin = now
    smallWinsAfterBig = 1 // Start small win counter
  }
  // Regular distribution
  else {
    if (random < 0.7) {
      amount = Math.floor(Math.random() * 50) + 10 // $10-$60
    } else if (random < 0.9) {
      amount = Math.floor(Math.random() * 200) + 60 // $60-$260
    } else if (random < 0.98) {
      amount = Math.floor(Math.random() * 1000) + 260 // $260-$1260
    } else {
      amount = Math.floor(Math.random() * 1740) + 1260 // $1260-$3000 (below $2k threshold)
    }
    
    // Reset small win counter if we're not in post-big-win mode
    if (smallWinsAfterBig >= 10) {
      smallWinsAfterBig = 0
    }
  }

  winCounter++
  return {
    id: `win-${winCounter}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    username,
    country,
    avatar,
    amount,
    timestamp: new Date(),
  }
}

const LatestWins = () => {
  const [wins, setWins] = useState([])
  const [lastBigWin, setLastBigWin] = useState(0)
  const [recentBigWins, setRecentBigWins] = useState([])
  
  const { data: apiWins } = useApi(dataAPI.getLatestWins, [])

  useEffect(() => {
    // Initialize with API data or fake data

    let initialWins = apiWins || Array.from({ length: 8 }, generateFakeWin)

    // console.log('initialWins', initialWins)
    
    // Validate and ensure all wins have required fields
    initialWins = initialWins
      .filter(win => 
        win && 
        win.username && 
        win.country && 
        win.country.flag && 
        win.country.name && 
        win.avatar && 
        typeof win.amount === 'number'
      )
      .map((win, index) => ({
        ...win,
        id: win.id || `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        username: win.username || 'Anonymous',
        country: win.country || { name: 'Unknown', flag: '🌍', code: 'XX' },
        avatar: win.avatar || generateAvatar(win.username || 'Anonymous'),
        amount: typeof win.amount === 'number' ? win.amount : 0
      }))
    
    // If we don't have enough valid wins, generate more fake ones
    while (initialWins.length < 8) {
      initialWins.push(generateFakeWin())
    }
    setWins(initialWins.slice(0, 24))

    let nextTimeout
    let isInMicroBurst = false
    let microBurstCount = 0
    let isInLull = false

    const scheduleNextWin = () => {
      let delay

      if (isInLull) {
        // In lull period: 4-5 minute pause
        delay = (4 + Math.random()) * 60 * 1000
        isInLull = false
      } else if (isInMicroBurst && microBurstCount < 5) {
        // Micro-burst: 2-6s gaps
        delay = (2 + Math.random() * 4) * 1000
        microBurstCount++
      } else {
        // Normal cadence: 60-120s randomized base interval
        delay = (60 + Math.random() * 60) * 1000
        
        // Check if we should start micro-burst (every 6-10 minutes)
        const microBurstChance = Math.random()
        if (microBurstChance < 0.08) { // ~8% chance each cycle
          isInMicroBurst = true
          microBurstCount = 0
        }
        
        // Check if we should start lull (every 10-15 minutes)
        const lullChance = Math.random()
        if (lullChance < 0.04) { // ~4% chance each cycle
          isInLull = true
        }
      }

      // End micro-burst after 3-5 wins
      if (microBurstCount >= (3 + Math.floor(Math.random() * 3))) {
        isInMicroBurst = false
        microBurstCount = 0
      }

      nextTimeout = setTimeout(() => {
        const newWin = generateFakeWin()
        setWins(prevWins => [newWin, ...prevWins.slice(0, 23)])
        scheduleNextWin()
      }, delay)
    }

    scheduleNextWin()

    return () => {
      if (nextTimeout) clearTimeout(nextTimeout)
    }
  }, [apiWins])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-poppins bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
          LATEST CHEST WINS
          </h2>
          {/* <p className="text-2xl text-gray-300 font-montserrat font-light">
            Real-time wins happening now!
          </p> */}
          <div className="mt-8 flex justify-center">
            <div className="w-96 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="w-4/5 overflow-x-auto shadow-2xl rounded-2xl mx-auto">
          <table className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700/50">
            <thead className="bg-gradient-to-r from-gray-700 to-gray-800 border-b border-gray-600">
              <tr>
                <th className="px-8 py-6 text-left text-sm font-bold text-gold uppercase tracking-widest font-montserrat">
                  {/* Player */}
                </th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gold uppercase tracking-widest font-montserrat">
                  {/* Country */}
                </th>
                {/* <th className="px-8 py-6 text-left text-sm font-bold text-gold uppercase tracking-widest font-montserrat">
                  Game
                </th> */}
                <th className="px-8 py-6 text-left text-sm font-bold text-gold uppercase tracking-widest font-montserrat">
                  {/* Win Amount */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <AnimatePresence>
                {wins.slice(0, 4).filter(win => 
                  win && 
                  win.username && 
                  // win.country && 
                  // win.country.flag && 
                  // win.country.name && 
                  // win.avatar && 
                  typeof win.amount === 'number'
                ).map((win, index) => (
                  <motion.tr
                    key={win.id || `fallback-${index}-${Date.now()}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className={`transition-all duration-300 ${
                      index === 0 ? 'bg-gradient-to-r from-gold/20 to-transparent border-l-4 border-gold animate-pulse' : 'hover:bg-gray-700/50'
                    } ${
                      win.amount > 5000 ? 'bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-transparent border-l-2 border-purple-400' :
                      win.amount > 1000 ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border-l-2 border-gold' :
                      win.amount > 500 ? 'bg-gradient-to-r from-green-500/20 via-green-400/10 to-transparent border-l-2 border-green-400' : 'hover:border-l-2 hover:border-gray-600'
                    }`}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full border-2 shadow-lg transition-transform hover:scale-110 flex items-center justify-center ${
                            win.amount > 5000 ? 'bg-purple-500/20 border-purple-400' :
                            win.amount > 1000 ? 'bg-gold/20 border-gold' :
                            win.amount > 500 ? 'bg-green-500/20 border-green-400' : 'bg-gray-600/20 border-gray-600'
                          }`}>
                            <Trophy className={`w-6 h-6 ${
                              win.amount > 5000 ? 'text-purple-400' :
                              win.amount > 1000 ? 'text-gold' :
                              win.amount > 500 ? 'text-green-400' : 'text-gray-400'
                            }`} />
                          </div>
                          {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse"></div> */}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-base font-poppins">
                            {win.username}
                          </p>
                          {/* <p className="text-xs text-gray-400 font-montserrat">Online</p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {/* <img 
                            src={`https://flagcdn.com/w20/${win.country.code.toLowerCase()}.png`}
                            alt={`${win.country.name} flag`}
                            className="w-6 h-5 rounded-sm border border-gray-600 shadow-sm transition-transform hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'inline'
                            }}
                          />
                          <span className="text-lg hidden">{win.country.flag}</span> */}
                        </div>
                        {/* <span className="text-base text-gray-200 font-montserrat">{win.country.name}</span> */}
                        <span className="text-base text-gray-200 font-montserrat">&emsp;Just&nbsp;&nbsp;&nbsp;&nbsp;hit&nbsp;&emsp;</span>
                      </div>
                    </td>
                    {/* <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          win.amount > 10000 ? 'bg-purple-500/20' :
                          win.amount > 2000 ? 'bg-gold/20' :
                          win.amount > 1000 ? 'bg-green-500/20' : 'bg-gray-600/20'
                        }`}>
                          <Trophy className={`w-5 h-5 ${
                            win.amount > 10000 ? 'text-purple-400' :
                            win.amount > 2000 ? 'text-gold' :
                            win.amount > 1000 ? 'text-green-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <span className="text-base text-gray-200 font-montserrat">Lottery</span>
                      </div>
                    </td> */}
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* <DollarSign className={`w-5 h-5 ${
                          win.amount > 5000 ? 'text-purple-400' :
                          win.amount > 1000 ? 'text-gold' :
                          win.amount > 500 ? 'text-green-400' : 'text-green-400'
                        }`} /> */}
                        <span className={`font-bold font-poppins ${
                          win.amount > 5000 ? 'text-purple-400 text-xl animate-glow' :
                          win.amount > 1000 ? 'text-gold text-xl animate-glow' :
                          win.amount > 500 ? 'text-green-400 text-lg' : 'text-green-400 text-base'
                        }`}>
                          {formatCurrency(win.amount)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

        </div>
      </div>
    </section>
  )
}

export default LatestWins