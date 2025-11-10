import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Create context
const AuthContext = createContext()

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('hireLearnToken')
        const storedUser = localStorage.getItem('hireLearnUser')

        if (storedToken && storedUser) {
          // Set token for axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
          
          // Validate token by fetching current user
          try {
            const response = await axios.get('/api/auth/profile')
            setUser(response.data.data)
            setToken(storedToken)
          } catch (error) {
            // Token is invalid, clear storage
            console.error('Token validation failed:', error)
            clearAuthData()
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Clear all auth data
  const clearAuthData = () => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem('hireLearnToken')
    localStorage.removeItem('hireLearnUser')
    delete axios.defaults.headers.common['Authorization']
  }

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.post('/api/auth/login', {
        email,
        password
      })

      const { data, token: authToken } = response.data

      // Store in state
      setUser(data)
      setToken(authToken)

      // Store in localStorage
      localStorage.setItem('hireLearnToken', authToken)
      localStorage.setItem('hireLearnUser', JSON.stringify(data))

      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      return { success: true, data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      setError(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.post('/api/auth/register', userData)

      const { data, token: authToken } = response.data

      // Store in state
      setUser(data)
      setToken(authToken)

      // Store in localStorage
      localStorage.setItem('hireLearnToken', authToken)
      localStorage.setItem('hireLearnUser', JSON.stringify(data))

      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      return { success: true, data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      setError(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    clearAuthData()
    navigate('/')
  }

  // Get current user (refresh from API)
  const getCurrentUser = async () => {
    try {
      if (!token) {
        throw new Error('No token available')
      }

      const response = await axios.get('/api/auth/profile')
      const userData = response.data.data
      
      setUser(userData)
      localStorage.setItem('hireLearnUser', JSON.stringify(userData))
      
      return { success: true, data: userData }
    } catch (error) {
      console.error('Failed to get current user:', error)
      
      // If token is invalid, logout
      if (error.response?.status === 401) {
        clearAuthData()
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch user data' 
      }
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null)

      const response = await axios.put('/api/auth/profile', profileData)
      const updatedUser = response.data.data

      setUser(updatedUser)
      localStorage.setItem('hireLearnUser', JSON.stringify(updatedUser))

      return { success: true, data: updatedUser }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed.'
      setError(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null)

      await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed.'
      setError(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role)
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!token
  }

  // Value to be provided by context
  const value = {
    // State
    user,
    token,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    clearError,

    // Helpers
    hasRole,
    hasAnyRole,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext