import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CiUser, CiLock } from "react-icons/ci"; // Import the icons
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/InputGroup/InputField";
import { loginSchema } from "@/components/validation/AddValidationSchema";

const LoginForm = ({ onLoginSuccess }) => {
  const [loginError, setLoginError] = useState("");
  const methods = useForm({
    resolver: yupResolver(loginSchema),
  });

  const hardcodedUsername = "user";
  const hardcodedPassword = "password";

  const onSubmit = (data) => {
    if (
      data.username === hardcodedUsername &&
      data.password === hardcodedPassword
    ) {
      onLoginSuccess();
    } else {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {/* Wrap the form with FormProvider */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <InputField
              label="Username"
              name="username"
              type="text"
              icon={CiUser}
              placeholder="Enter Username"
              register={methods.register} // Use register from methods
              error={methods.formState.errors.username?.message}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              icon={CiLock}
              placeholder="Enter Password"
              register={methods.register} // Use register from methods
              error={methods.formState.errors.password?.message}
            />
            {/* Display login error message */}
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LoginForm;
