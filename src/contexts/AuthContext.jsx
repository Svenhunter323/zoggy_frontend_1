import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
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
  const isFetchingRef = useRef(false)

  const setToken = useCallback((token) => {
    if (token) {
      localStorage.setItem('zoggy_token', token)
    } else {
      localStorage.removeItem('zoggy_token')
    }
    dispatch({ type: 'SET_TOKEN', payload: token })
  }, [])

  const setUser = useCallback((user) => {
    dispatch({ type: 'SET_USER', payload: user })
  }, [])

  const setTelegramVerified = useCallback((verified) => {
    dispatch({ type: 'SET_TELEGRAM_VERIFIED', payload: verified })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('zoggy_token')
    dispatch({ type: 'LOGOUT' })
  }, [])

  const fetchUser = useCallback(async () => {
    if (!state.token || isFetchingRef.current) return
    
    isFetchingRef.current = true
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.getMe()
      dispatch({ type: 'SET_USER', payload: response.data })
    } catch (error) {
      console.error('Failed to fetch user:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('zoggy_token')
        dispatch({ type: 'LOGOUT' })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
      isFetchingRef.current = false
    }
  }, [state.token])

  useEffect(() => {
    const loadUser = async () => {
      if (!state.token || state.user || isFetchingRef.current) return
      
      isFetchingRef.current = true
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await authAPI.getMe()
        dispatch({ type: 'SET_USER', payload: response.data })
      } catch (error) {
        console.error('Failed to fetch user:', error)
        if (error.response?.status === 401) {
          localStorage.removeItem('zoggy_token')
          dispatch({ type: 'LOGOUT' })
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
        isFetchingRef.current = false
      }
    }

    if (state.isAuthenticated && !state.user) {
      loadUser()
    }
  }, [state.isAuthenticated, state.user, state.token])

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
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}