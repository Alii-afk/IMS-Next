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
      router.push("/sidebarpages/home");
    } else if (role === "admin") {
      // console.log("Redirecting to /sidebarpages/home");
      router.push("/sidebarpages/home");
    } else if (role === "frontoffice") {
      router.push("/sidebarpages/request-management");
    } else {
      // console.log("Redirecting to /sidebarpages/home (default)");
      router.push("/sidebarpages/home");
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <Sidebar role={role} /> // Pass the role to Sidebar
      ) : (
        // Show LoginForm if not logged in
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default Dashboard;
