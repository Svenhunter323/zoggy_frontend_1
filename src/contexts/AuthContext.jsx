import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../api/endpoints'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_TOKEN':
      return { ...state, token: action.payload, isAuthenticated: !!action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_TELEGRAM_VERIFIED':
      return { 
        ...state, 
        user: { ...state.user, telegramVerified: action.payload }
      }
    case 'LOGOUT':
      return { 
        ...state, 
        token: null, 
        user: null, 
        isAuthenticated: false 
      }
    default:
      return state
  }
}

const initialState = {
  token: localStorage.getItem('zoggy_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('zoggy_token'),
  loading: false,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const setToken = (token) => {
    if (token) {
      localStorage.setItem('zoggy_token', token)
    } else {
      localStorage.removeItem('zoggy_token')
    }
    dispatch({ type: 'SET_TOKEN', payload: token })
  }

  const setUser = (user) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const setTelegramVerified = (verified) => {
    dispatch({ type: 'SET_TELEGRAM_VERIFIED', payload: verified })
  }

  const logout = () => {
    localStorage.removeItem('zoggy_token')
    dispatch({ type: 'LOGOUT' })
  }

  const fetchUser = async () => {
    if (!state.token) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.getMe()
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      if (error.response?.status === 401) {
        logout()
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    if (state.isAuthenticated && !state.user) {
      fetchUser()
    }
  }, [state.isAuthenticated])

  const value = {
    ...state,
    setToken,
    setUser,
    setTelegramVerified,
    logout,
    fetchUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth functionality
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}