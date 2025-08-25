import React from 'react'
import { Users, UserPlus } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { dataAPI } from '../api/endpoints'
import Card from './Card'

const StatsSection = () => {
  const { data: stats, loading } = useApi(dataAPI.getStats)

  if (loading) {
    return (
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-20 bg-gray-700 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6 bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join the Community
          </h2>
          <p className="text-xl text-gray-400">
            Thousands are already earning daily rewards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="text-center">
            <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {stats?.totalUsers?.toLocaleString() || '9,327'}
            </h3>
            <p className="text-gray-400">Total Users</p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {stats?.totalReferrals?.toLocaleString() || '2,156'}
            </h3>
            <p className="text-gray-400">Referrals Made</p>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default StatsSection