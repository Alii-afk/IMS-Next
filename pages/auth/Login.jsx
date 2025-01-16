import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { CiUser } from "react-icons/ci";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/InputGroup/InputField";
import { loginSchema } from "@/components/validation/AddValidationSchema";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const LoginForm = ({ onLoginSuccess }) => {
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [subscribers, setSubscribers] = useState([]);

  const methods = useForm({
    resolver: yupResolver(loginSchema),
  });

  const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

  // Refresh Token Logic
  const refreshAuthToken = async () => {
    if (isRefreshing) {
      return new Promise((resolve) => {
        setSubscribers((prev) => [...prev, resolve]);
      });
    }

    setIsRefreshing(true);
    try {
      const refreshToken = Cookies.get("authToken");
      const response = await axios.post(`${apiUrl}/api/refresh-token`, {
        token: refreshToken,
      });

      if (response && response.data.token) {
        Cookies.set("authToken", response.data.token, {
          expires: 7,
          path: "/",
        });

        // Notify all pending requests
        subscribers.forEach((callback) => callback(response.data.token));
        setSubscribers([]); // Reset subscribers after notifying all
        return response.data.token;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      Cookies.remove("authToken");
      window.location.href = "/"; // Redirect to login if refreshing token fails
    } finally {
      setIsRefreshing(false);
    }
  };

  // Add Authorization Header
  const attachTokenToRequest = (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  };

  // Axios Interceptors Setup
  useEffect(() => {
    const requestInterceptor =
      axios.interceptors.request.use(attachTokenToRequest);

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If token expires (401 error), try to refresh the token
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.error === "Token has expired" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAuthToken();
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (err) {
            console.error("Token refresh failed:", err);
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    // Auto login if token exists in cookies
    const token = Cookies.get("authToken");
    if (token) {
      autoLogin(token);
    }

    // Cleanup on component unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Auto Login with stored token
  const autoLogin = async () => {
    onLoginSuccess();
  };

  // Handle Form Submission
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data;

      if (token && user && user.role) {
        Cookies.set("authToken", token, { expires: 7, path: "/" });
        Cookies.set("role", user.role, { expires: 7, path: "/" });
        Cookies.set("name", user.name, { expires: 7, path: "/" });

        toast.success("Logged in successfully. Redirecting...");
        onLoginSuccess();
      } else {
        toast.error("Invalid response structure. Token or role missing.");
      }
    } catch (error) {
      if (error.response?.data?.error === "Token has expired") {
        await refreshAuthToken();
        onSubmit(data); // Retry login
      } else {
        toast.error("Login failed. Please try again.");
        setLoginError(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-lg border-2 shadow-xl w-96 max-w-sm space-y-6">
        <div className="flex justify-center">
          <img
            src="https://sal-dashboard.demobykiranpal.in/main_logo2.jpg"
            alt="Logo"
            className="w-32 h-auto object-contain"
          />
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <h1 className="text-lg font-medium text-center text-gray-800">
                Maareynta Isgaarsiinta CBS
              </h1>

              <Controller
                name="email"
                control={methods.control}
                render={({ field }) => (
                  <InputField
                    label="Email"
                    name="email"
                    type="text"
                    icon={CiUser}
                    placeholder="Enter Email"
                    {...field}
                  />
                )}
              />

              <div className="relative">
                <Controller
                  name="password"
                  control={methods.control}
                  render={({ field }) => (
                    <InputField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      icon={CiUser}
                      placeholder="Enter Password"
                      {...field}
                    />
                  )}
                />
                <span
                  className="absolute right-4 top-[50px] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-gray-500" />
                  ) : (
                    <AiOutlineEye className="text-gray-500" />
                  )}
                </span>
              </div>

              {loginError && (
                <p className="text-red-500 text-sm">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LoginForm;
