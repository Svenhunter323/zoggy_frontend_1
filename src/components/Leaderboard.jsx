import React from 'react'
import { Crown, Trophy, Medal, Users } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { dataAPI } from '../api/endpoints'
import { formatCurrency } from '../utils/reward'
import Card from './Card'
import ResponsiveTable from './ResponsiveTable'

const Leaderboard = () => {
  const { data: leaderboard, loading } = useApi(dataAPI.getLeaderboard)

  // Fake users data to supplement leaderboard
  const fakeUsers = [
    { id: 'fake-1', email: 'ch***@gmail.com', referrals: 178 },
    { id: 'fake-2', email: 'al***@yahoo.com', referrals: 153 },
    { id: 'fake-3', email: 'mi***@hotmail.com', referrals: 112 },
    { id: 'fake-4', email: 'sa***@gmail.com', referrals: 78 },
    { id: 'fake-5', email: 'da***@outlook.com', referrals: 73 },
    { id: 'fake-6', email: 'ja***@gmail.com', referrals: 65 },
    { id: 'fake-7', email: 'em***@yahoo.com', referrals: 45 },
    { id: 'fake-8', email: 'ro***@gmail.com', referrals: 29 },
    { id: 'fake-9', email: 'li***@hotmail.com', referrals: 19 },
    { id: 'fake-10', email: 'br***@gmail.com', referrals: 14 }
  ]

  // Combine real and fake data, ensuring we have exactly 10 users
  const getLeaderboardData = () => {
    const realData = leaderboard || []
    const combinedData = [...realData]
    
    // Add fake users to fill up to 10 total
    const needed = Math.max(0, 10 - realData.length)
    if (needed > 0) {
      combinedData.push(...fakeUsers.slice(0, needed))
    }
    
    // Sort by referrals in descending order and take top 10
    return combinedData
      .sort((a, b) => b.referrals - a.referrals)
      .slice(0, 10)
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-gold" />
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-yellow-600" />
      default:
        // return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold"></span>
    }
  }

  const getPrize = (rank) => {
    const prizes = {
      1: 5000,
      2: 2500,
      3: 1000,
      4: 500,
      5: 250,
      6: 100,
      7: 75,
      8: 50,
      9: 25,
      10: 10
    }
    return prizes[rank] || 0
  }

  if (loading) {
    return (
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Referral Leaderboard
            </h2>
          </div>
          <Card className="animate-pulse">
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6 bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Referral Leaderboard
          </h2>
          <p className="text-xl text-gray-400 mb-6">
            Top 10 referrers win cash prizes!
          </p>
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-gold text-sm">
              <strong>Eligibility:</strong> Must have at least 10 verified referrals to qualify for prizes. 
              Contest ends when we launch publicly.
            </p>
          </div>
        </div>

        <Card>
          <ResponsiveTable
            data={getLeaderboardData()}
            loading={loading}
            columns={[
              {
                header: 'Rank',
                accessor: 'rank',
                render: (value, item, index) => {
                  const rank = index + 1
                  return (
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-400 min-w-[2rem] text-center">
                        {rank}
                      </span>
                      {getRankIcon(rank)}
                    </div>
                  )
                }
              },
              {
                header: 'Player',
                accessor: 'email',
                render: (value, item, index) => {
                  const rank = index + 1
                  const isQualified = item.referrals >= 1
                  return (
                    <div>
                      <p className="font-semibold text-white break-all">
                        {value.replace(/(.{2}).*(@.*)/, '$1***$2')}
                      </p>
                      {!isQualified && (
                        <p className="text-xs text-yellow-500">
                          (Need {10 - item.referrals} more to qualify)
                        </p>
                      )}
                    </div>
                  )
                }
              },
              {
                header: 'Referrals',
                accessor: 'referrals',
                render: (value) => (
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-lg font-semibold text-white">
                      {value}
                    </span>
                  </div>
                ),
                headerClassName: 'text-center',
                cellClassName: 'text-center'
              },
              {
                header: 'Prize',
                accessor: 'prize',
                render: (value, item, index) => {
                  const rank = index + 1
                  const isQualified = item.referrals >= 1
                  return (
                    <div>
                      <p className={`text-lg font-bold ${
                        isQualified ? 'text-gold' : 'text-gray-500'
                      }`}>
                        {formatCurrency(getPrize(rank))}
                      </p>
                    </div>
                  )
                },
                headerClassName: 'text-right',
                cellClassName: 'text-right'
              }
            ]}
            mobileCardClassName={(item, index) => {
              const rank = index + 1
              const isQualified = item.referrals >= 1
              return `${
                rank <= 3 
                  ? 'bg-gradient-to-r from-gold/10 to-yellow-600/10 border-gold/30' 
                  : ''
              } ${!isQualified ? 'opacity-60' : ''}`
            }}
            emptyMessage="No leaderboard data available"
          />
        </Card>
      </div>
    </section>
  )
}

export default Leaderboard