import React, { useState } from "react";
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
  const methods = useForm({
    resolver: yupResolver(loginSchema),
  });

  const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

  // Function to refresh the token
  const refreshAuthToken = async () => {
    try {
      const refreshToken = Cookies.get("authToken");
      const response = await axios.post(`${apiUrl}/api/refresh-token`, {
        token: refreshToken,
      });

      if (response && response.data.token) {
        Cookies.set("authToken", response.data.token, {
          expires: 7,
          path: "/",
          secure: false,
        });
        return response.data.token;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      Cookies.remove("authToken");
      window.location.href = "http://localhost:3000";
    }
  };

  // Axios request interceptor to handle token refresh automatically
  axios.interceptors.request.use(
    (config) => {
      const token = Cookies.get("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Axios response interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error === "Token has expired"
      ) {
        try {
          const newToken = await refreshAuthToken();
          if (newToken) {
            // Retry the original request with the new token
            error.config.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(error.config); // Retry the request with the new token
          }
        } catch (err) {
          console.error("Failed to refresh token:", err);
        }
      }
      return Promise.reject(error);
    }
  );

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email: data.email,
        password: data.password,
      });
  
      if (response && response.data) {
        const { token, user } = response.data;
        if (token && user && user.role) {
          Cookies.set("authToken", token, {
            expires: 7,
            path: "/",
            secure: false,
          });
          Cookies.set("role", user.role, {
            expires: 7,
            path: "/",
            secure: false,
          });
          Cookies.set("name", user.name, {
            expires: 7,
            path: "/",
            secure: false,
          });
          toast.success("Logged in successfully. Redirecting to dashboard...");
          onLoginSuccess();
        } else {
          toast.error("Invalid response structure. Token or role missing.");
        }
      } else {
        toast.error("Invalid login response.");
      }
    } catch (error) {
      if (error.response && error.response.data.error === "Token has expired") {
        // Try refreshing the token if expired
        const newToken = await refreshAuthToken();
        if (newToken) {
          // Automatically retry the original request using the refreshed token
          onSubmit(data); // Retry the original login request
        }
      } else {
        toast.error("Something went wrong. Please try again.");
        if (error.response) {
          setLoginError(error.response.data.message || "Login failed");
        } else if (error.request) {
          setLoginError("Network error. Please try again.");
        } else {
          setLoginError("An error occurred. Please try again.");
        }
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
        <div className="flex flex-col gap-6">
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
                    className="absolute right-4 top-[50px] transform cursor-pointer"
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
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
