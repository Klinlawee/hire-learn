import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { user, isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Checking authentication..." />
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If specific roles are required but user doesn't have them
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPaths = {
      employee: '/employee/dashboard',
      employer: '/employer/dashboard',
      admin: '/admin/dashboard'
    }
    
    const redirectPath = dashboardPaths[user.role] || '/profile'
    
    // Don't redirect if we're already on the correct page
    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />
    }
  }

  // If everything is fine, render children
  return children
}

export default ProtectedRoute