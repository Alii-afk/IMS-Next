import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import LoginForm from './auth/Login';
import { useRouter } from 'next/router'; // Import useRouter from next/router

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const router = useRouter(); // Initialize useRouter hook

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    router.push('/sidebarpages/home'); // Redirect to /sidebarpages/home after login
  };

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
  );
};

export default Dashboard;
