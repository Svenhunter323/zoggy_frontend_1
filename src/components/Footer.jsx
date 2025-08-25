import React from 'react'
import { Mail, MessageCircle, Globe } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/logo.svg" 
              alt="Zoggy Logo" 
              className="w-10 h-10 filter brightness-0 invert"
            />
            <span className="text-2xl font-bold">Zoggy</span>
          </div> */}
          <p className="text-gray-400 text-lg">
            Get early access and unlock daily rewards
          </p>
        </div>
{/* 
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Contact Support</h3>
            <a 
              href="mailto:help@zoggybet.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              help@zoggybet.com
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Join Community</h3>
            <a 
              href="https://t.me/zoggycasino"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              t.me/zoggycasino
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Website</h3>
            <a 
              href="https://zoggybet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Zoggybet.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Zoggy. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Join the waitlist and be among the first to experience daily rewards.
          </p>
        </div> */}
      </div>
    </footer>
  )
}

export default Footer