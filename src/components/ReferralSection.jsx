import React from 'react'
import { Users, Gift, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Card from './Card'
import CopyField from './CopyField'
import Button from './Button'

const ReferralSection = () => {
  const { user } = useAuth()

  if (!user) return null

  // Add validation for user properties
  const safeReferralCode = user.referralCode || 'DEFAULT_CODE'
  console.log("user:", user);
  const referralLink = `${window.location.origin}/signup?ref=${safeReferralCode}`
  const referralCount = user.referredUsers || 0
  const waitlistPosition = user.waitlistPosition || 0
  const totalUsers = user.totalUsers || '10K+'

  return (
    <Card>
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-brand to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand/30">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-3 font-poppins">Refer Friends</h3>
        <p className="text-lg text-gray-300 font-montserrat max-w-md mx-auto">
          Invite friends and climb the leaderboard to win cash prizes!
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="text-2xl font-bold text-gold mb-1 font-poppins">
              #{waitlistPosition || '---'}
            </div>
            <div className="text-sm text-gray-400 font-montserrat">Position</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="text-2xl font-bold text-gold mb-1 font-poppins">
              {referralCount}
            </div>
            <div className="text-sm text-gray-400 font-montserrat">Referrals</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="text-2xl font-bold text-gold mb-1 font-poppins">
              {totalUsers}
            </div>
            <div className="text-sm text-gray-400 font-montserrat">Total Users</div>
          </div>
        </div>

        <CopyField
          value={referralLink}
          label="Your Referral Link"
        />

        <CopyField
          value={`ZOGGY-${safeReferralCode.length >= 6 ? safeReferralCode.slice(-6).toUpperCase() : safeReferralCode.toUpperCase().padEnd(6, 'X')}`}
          label="Your Referral Code (Shortened)"
        />

        <div className="bg-brand/10 border border-brand/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Gift className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-white mb-1">Referral Rewards:</p>
              <ul className="space-y-1">
                <li>• You get $0.10 for each verified referral</li>
                <li>• Your friend gets a bonus chest</li>
                <li>• Top 10 referrers win cash prizes up to $5,000!</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(
            `🎁 Join me on @Zoggy and open daily chests to win up to $10,000! Use my referral link: ${referralLink}`
          ), '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Share on Twitter
        </Button>
      </div>
    </Card>
  )
}

export default ReferralSection