import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import LoginForm from './auth/Login'

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // State to track login status

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <div>
      {isLoggedIn ? (
        // Show Sidebar if logged in
        <Sidebar />
      ) : (
        // Show LoginForm if not logged in
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}

export default Dashboard
