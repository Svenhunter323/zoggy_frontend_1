import React, { useState } from 'react'
import { Download, Users, UserPlus, Eye, EyeOff } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { adminAPI } from '../api/endpoints'
import { formatCurrency } from '../utils/reward'
import Header from '../components/Header'
import Button from '../components/Button'
import Card from '../components/Card'
import ResponsiveTable from '../components/ResponsiveTable'
import { useToast } from '../contexts/ToastContext'


const AdminPage = () => {
  const [showEmails, setShowEmails] = useState(false)
  const { showToast } = useToast()
  
  const { data: users, loading: usersLoading } = useApi(adminAPI.getUsers)
  const { data: referrals, loading: referralsLoading } = useApi(adminAPI.getReferrals)

  const handleExportCSV = async () => {
    try {
      const response = await adminAPI.exportClaimCodes()
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'claim-codes.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      showToast('CSV exported successfully!', 'success')
    } catch (error) {
      console.error('Failed to export CSV:', error)
      showToast('Failed to export CSV', 'error')
    }
  }

  const maskEmail = (email) => {
    if (showEmails) return email
    const [local, domain] = email.split('@')
    return `${local.substring(0, 2)}***@${domain}`
  }

  const getStatusChip = (status) => {
    const colors = {
      verified: 'bg-green-600 text-white',
      pending: 'bg-yellow-600 text-white',
      failed: 'bg-red-600 text-white',
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-600 text-white'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header minimal={true} />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-xl text-gray-400">Manage users and referrals</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowEmails(!showEmails)}
            >
              {showEmails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showEmails ? 'Hide' : 'Show'} Emails
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleExportCSV}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-brand" />
              <h2 className="text-2xl font-bold text-white">Users</h2>
            </div>
            
            <ResponsiveTable
              data={users || []}
              loading={usersLoading}
              columns={[
                {
                  header: 'Email',
                  accessor: 'email',
                  render: (value) => (
                    <span className="text-white font-mono text-sm break-all">
                      {maskEmail(value)}
                    </span>
                  )
                },
                {
                  header: 'Claim Code',
                  accessor: 'claimCode',
                  render: (value) => (
                    <span className="text-gold font-mono text-sm">
                      {value}
                    </span>
                  )
                },
                {
                  header: 'Credits',
                  accessor: 'credits',
                  render: (value, item) => (
                    <span className="text-green-400 font-semibold">
                      {formatCurrency((item.credits + item.cents) || 0)}
                    </span>
                  )
                }
              ]}
              emptyMessage="No users found"
            />
          </Card>

          {/* Referrals Table */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <UserPlus className="w-6 h-6 text-gold" />
              <h2 className="text-2xl font-bold text-white">Referrals</h2>
            </div>
            
            <ResponsiveTable
              data={referrals || []}
              loading={referralsLoading}
              columns={[
                {
                  header: 'Referrer',
                  accessor: 'referrerEmail',
                  render: (value) => (
                    <span className="text-white font-mono text-sm break-all">
                      {maskEmail(value)}
                    </span>
                  )
                },
                {
                  header: 'Referred',
                  accessor: 'referredEmail',
                  render: (value) => (
                    <span className="text-white font-mono text-sm break-all">
                      {maskEmail(value)}
                    </span>
                  )
                },
                {
                  header: 'Status',
                  accessor: 'status',
                  render: (value) => getStatusChip(value)
                }
              ]}
              emptyMessage="No referrals found"
            />
          </Card>
        </div>
      </div>

    </div>
  )
}

export default AdminPage