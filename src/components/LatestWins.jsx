import React, { useState, useEffect } from 'react'
import { Trophy, DollarSign } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '../utils/reward'
import { useApi } from '../hooks/useApi'
import { dataAPI } from '../api/endpoints'
import { getRandomUsername, getRandomCountry, generateAvatar, ensureEmail } from '../utils/usernames'
// import Card from './Card'
import ResponsiveTable from './ResponsiveTable'

// Counter for unique IDs
let winCounter = 0

// Big win tracking
let lastBigWin = 0 // timestamp of last $2k+ win
let recentMegaWins = [] // timestamps of $10k+ wins
let smallWinsAfterBig = 0 // counter for small wins after big win

// Fake wins generator with enhanced cadence rules
const generateFakeWin = () => {
  const rawname = getRandomUsername() || 'Anonymous'
  const username = ensureEmail(rawname)
  // const countryData = getRandomCountry()
  // const country = countryData && countryData.name && countryData.flag ? 
  //   countryData : 
  //   { name: 'Unknown', flag: '🌍', code: 'XX' }
  // const avatar = generateAvatar(username)
  
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
    // country,
    // avatar,
    amount,
    timestamp: new Date(),
  }
}

const maskEmail = (email) => {
  if (false) return email
  const [local, domain] = email.split('@')
  return `${local.substring(0, 2)}***@${domain}`
}

const LatestWins = () => {
  const [wins, setWins] = useState([])
  // const [lastBigWin, setLastBigWin] = useState(0)
  // const [recentBigWins, setRecentBigWins] = useState([])
  
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
        // win.country && 
        // win.country.flag && 
        // win.country.name && 
        // win.avatar && 
        typeof win.amount === 'number'
      )
      .map((win, index) => ({
        ...win,
        id: win.id || `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        username: win.username || 'Anonymous',
        // country: win.country || { name: 'Unknown', flag: '🌍', code: 'XX' },
        // avatar: win.avatar || generateAvatar(win.username || 'Anonymous'),
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
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 animate-fade-in-up">
        <h2
          className="
            font-poppins font-bold
            max-[320px]:text-base
            text-lg
            min-[380px]:text-xl
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
            leading-[1.1] tracking-tight [text-wrap:balance]
          "
        >
          LATEST CHEST WINS
        </h2>
          {/* <p className="text-2xl text-gray-300 font-montserrat font-light">
            Real-time wins happening now!
          </p> */}
          <div className="mt-8 flex justify-center">
            <div className="w-96 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl">
          <ResponsiveTable
            data={wins.slice(0, 4).filter(win => 
              win && 
              win.username && 
              typeof win.amount === 'number'
            )}
            animated={true}
            columns={[
              {
                header: 'Player',
                accessor: 'username',
                render: (value, item) => (
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="relative">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 shadow-lg transition-transform hover:scale-110 flex items-center justify-center ${
                        item.amount > 5000 ? 'bg-purple-500/20 border-purple-400' :
                        item.amount > 1000 ? 'bg-gold/20 border-gold' :
                        item.amount > 500 ? 'bg-green-500/20 border-green-400' : 'bg-gray-600/20 border-gray-600'
                      }`}>
                        <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                          item.amount > 5000 ? 'text-purple-400' :
                          item.amount > 1000 ? 'text-gold' :
                          item.amount > 500 ? 'text-green-400' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-sm sm:text-base font-poppins truncate">
                        {maskEmail(value)}
                      </p>
                    </div>
                  </div>
                )
              },
              {
                header: 'Action',
                accessor: 'action',
                render: () => (
                  <span className="text-sm sm:text-base text-gray-200 font-montserrat">Just hit</span>
                )
              },
              {
                header: 'Amount',
                accessor: 'amount',
                render: (value) => (
                  <span className={`font-bold font-poppins ${
                    value > 5000 ? 'text-purple-400 text-lg sm:text-xl animate-glow' :
                    value > 1000 ? 'text-gold text-lg sm:text-xl animate-glow' :
                    value > 500 ? 'text-green-400 text-base sm:text-lg' : 'text-green-400 text-sm sm:text-base'
                  }`}>
                    {formatCurrency(value)}
                  </span>
                ),
                headerClassName: 'text-right',
                cellClassName: 'text-right'
              }
            ]}
            desktopTableClassName="w-full min-w-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700/50"
            mobileCardClassName={(item, index) => {
              const baseClasses = 'transition-all duration-300'
              const highlightClasses = index === 0 ? 'bg-gradient-to-r from-gold/20 to-transparent border-l-4 border-gold animate-pulse' : ''
              const amountClasses = 
                item.amount > 5000 ? 'bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-transparent border-l-2 border-purple-400' :
                item.amount > 1000 ? 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border-l-2 border-gold' :
                item.amount > 500 ? 'bg-gradient-to-r from-green-500/20 via-green-400/10 to-transparent border-l-2 border-green-400' : ''
              return `${baseClasses} ${highlightClasses} ${amountClasses}`
            }}
            emptyMessage="No recent wins"
          />
        </div>
      </div>
    </section>
  )
}

export default LatestWins