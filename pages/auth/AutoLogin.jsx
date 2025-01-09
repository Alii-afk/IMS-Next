import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

const AutoLogin = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      authenticateUser(token);
    } else {
      // If token does not exist, redirect to login page
      router.push("/sidebarpages/home");
    }
  }, []);

  const authenticateUser = async (token) => {
    try {
      // Verify token by making an API request to your authentication endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-token`, {
        token,
      });

      if (response.status === 200 && response.data && response.data.user) {
        // Store user data in cookies if needed
        const { user } = response.data;
        Cookies.set("role", user.role, { expires: 7, path: "/" });
        Cookies.set("name", user.name, { expires: 7, path: "/" });

        // Proceed to the dashboard or the page you want the user to land on
        router.push("/dashboard");
      } else {
        // If token verification fails, redirect to login page
        toast.error("Session expired, please log in again.");
        router.push("/login");
      }
    } catch (error) {
      // Handle errors (e.g., network error, API failure, etc.)
      toast.error("Error authenticating. Please log in again.");
      router.push("/login");
    }
  };

  return null; 
};

export default AutoLogin;
