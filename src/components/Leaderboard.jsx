import React from 'react'
import { Crown, Trophy, Medal, Users } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { dataAPI } from '../api/endpoints'
import { formatCurrency } from '../utils/reward'
import Card from './Card'

const Leaderboard = () => {
  const { data: leaderboard, loading } = useApi(dataAPI.getLeaderboard)

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-gold" />
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-yellow-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-sm font-bold text-gold uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gold uppercase tracking-wider">
                    Player
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-gold uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gold uppercase tracking-wider">
                    Prize
                  </th>
                </tr>
              </thead>
              <tbody>
                {(leaderboard || []).map((user, index) => {
                  const rank = index + 1
                  const isQualified = user.referrals >= 10
                  
                  return (
                    <tr
                      key={user.id || `user-${index}`}
                      className={`border-b border-gray-700/50 ${
                        rank <= 3 
                          ? 'bg-gradient-to-r from-gold/10 to-yellow-600/10' 
                          : 'hover:bg-gray-800/50'
                      } ${!isQualified ? 'opacity-60' : ''}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-gray-400 min-w-[2rem] text-center">
                            {rank}
                          </span>
                          {getRankIcon(rank)}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-white">
                            {user.email.replace(/(.{2}).*(@.*)/, '$1***$2')}
                          </p>
                          {!isQualified && (
                            <p className="text-xs text-yellow-500">
                              (Need {10 - user.referrals} more to qualify)
                            </p>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Users className="w-5 h-5 text-blue-400" />
                          <span className="text-lg font-semibold text-white">
                            {user.referrals}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-right">
                        <div>
                          <p className={`text-lg font-bold ${
                            isQualified ? 'text-gold' : 'text-gray-500'
                          }`}>
                            {formatCurrency(getPrize(rank))}
                          </p>
                          {rank <= 3 && isQualified && (
                            <p className="text-xs text-gold">Prize Winner!</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default Leaderboard