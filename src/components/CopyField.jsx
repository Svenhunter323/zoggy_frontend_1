import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Button from './Button'

const CopyField = ({ value, label, className = '' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={value}
          readOnly
          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="px-3"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}

export default CopyField