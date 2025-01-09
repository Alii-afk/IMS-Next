import React, { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { CiUser } from "react-icons/ci";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import InputField from "../InputGroup/InputField";
import { GrUserAdmin } from "react-icons/gr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const EditUserModal = ({ userData, onSave, onClose, fetchUsers }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const methods = useForm({
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      password: userData?.password || "",
      password_confirmation: userData?.password_confirmation || "",
      role: userData?.role || "frontoffice",
    },
  });

  const { handleSubmit, control, reset } = methods;

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        password: userData.password || "",
        password_confirmation: userData.password_confirmation || "",
        role: userData.role || "frontoffice",
      });
    }
  }, [userData, reset]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;
    const userId = userData?.id;

    // Get token from cookies
    const token = Cookies.get("authToken");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Use JSON content type
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          role: data.role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const result = await response.json();
      onSave(result);
      toast.success("User updated successfully!");
      setError(null);
      onClose();
      fetchUsers();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 transform transition-all duration-300 scale-95 hover:scale-100">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-lg font-medium text-gray-700">Edit User</h3>

            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputField
                  label="Name"
                  name="name"
                  placeholder="Enter Name"
                  icon={CiUser}
                  type="text"
                  error={error}
                  {...field} // Spread field object here
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Email"
                  name="email"
                  placeholder="Enter Email"
                  icon={MdOutlineMarkEmailUnread}
                  type="email"
                  {...field} // Spread field to InputField
                />
              )}
            />

            <div className="relative">
              <InputField
                label="Password"
                name="password"
                icon={CiUser}
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                {...methods.register("password")} // Use register here instead of Controller
              />
              <div
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-[50px] transform cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>

            <InputField
              label="Confirm Password"
              name="password_confirmation"
              icon={CiUser}
              placeholder="Confirm Password"
              type={showPassword ? "text" : "password"}
              {...methods.register("password_confirmation")} // Use register here instead of Controller
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Role"
                  name="role"
                  icon={GrUserAdmin}
                  placeholder="Enter Role"
                  type="text"
                  {...field} // Spread field to InputField
                />
              )}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EditUserModal;
