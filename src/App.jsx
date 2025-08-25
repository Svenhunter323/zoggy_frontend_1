import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import AppRouter from './router/AppRouter'
import { ToastProvider } from './contexts/ToastContext'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App