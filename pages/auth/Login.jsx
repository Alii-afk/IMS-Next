import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CiUser } from "react-icons/ci"; // Import the email icon
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import the eye icons
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/InputGroup/InputField";
import { loginSchema } from "@/components/validation/AddValidationSchema";
import axios from "axios"; // Import axios
import Cookies from "js-cookie"; // Import js-cookie
import { toast } from "react-toastify";

const LoginForm = ({ onLoginSuccess }) => {
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const methods = useForm({
    resolver: yupResolver(loginSchema),
  });

  const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY; // Use the environment variable

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

          // Redirect to the dashboard
          toast.success("Logged in successfully. Redirecting to dashboard...");
          onLoginSuccess();
        } else {
          toast.error("Invalid response structure. Token or role missing.");
        }
      } else {
        toast.error("Invalid login response.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");

      if (error.response) {
        setLoginError(error.response.data.message || "Login failed");
      } else if (error.request) {
        setLoginError("Network error. Please try again.");
      } else {
        setLoginError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-lg border-2 shadow-xl w-96 max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://sal-dashboard.demobykiranpal.in/main_logo2.jpg"
            alt="Logo"
            className="w-32 h-auto object-contain"
          />
        </div>

        {/* Login Form */}
        <div className="flex flex-col gap-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {/* email Input */}
                <InputField
                  label="Email"
                  name="email"
                  type="text"
                  icon={CiUser}
                  placeholder="Enter Email"
                  register={methods.register}
                  error={methods.formState.errors.email?.message}
                />

                {/* Password Input */}
                <div className="relative">
                  <InputField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    icon={CiUser} // You can keep this if you want an icon inside the field
                    placeholder="Enter Password"
                    register={methods.register}
                    error={methods.formState.errors.password?.message}
                  />
                  <span
                    className="absolute right-4 top-[50px] transform cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="text-gray-500" />
                    ) : (
                      <AiOutlineEye className="text-gray-500" />
                    )}
                  </span>
                </div>

                {/* Display login error message */}
                {loginError && (
                  <p className="text-red-500 text-sm">{loginError}</p>
                )}

                {/* Login Button */}
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
