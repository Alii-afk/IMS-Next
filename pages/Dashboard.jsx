import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import LoginForm from "./auth/Login";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; 

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const role = Cookies.get("role");



  const handleLoginSuccess = () => {
    if (role === "backoffice") {
      router.push("http://localhost:3000/sidebarpages/declined-request");
    } else if (role === "admin") {
      router.push("/sidebarpages/home");
    }
    setIsLoggedIn(true);
    router.push("/sidebarpages/home");
  };

  return (
    <div>
      {isLoggedIn ? (
        <Sidebar role={role} />  // Pass the role to Sidebar
      ) : (
        // Show LoginForm if not logged in
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default Dashboard;
