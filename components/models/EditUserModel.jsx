import React, { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { CiUser } from "react-icons/ci";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import Eye icons for visibility toggle
import InputField from "../InputGroup/InputField";
import { CircleUser } from "lucide-react";
import { GrUserAdmin } from "react-icons/gr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const EditUserModal = ({ userData, onSave, onClose }) => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const methods = useForm({
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      password: userData?.password || "",
      password_confirmation: userData?.password_confirmation || "",
      role: userData?.role || "frontoffice", // Default role if not provided
    },
  });

  const { handleSubmit, control, reset } = methods;

  // Whenever userData changes, reset form values
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        password: userData.password || "",
        password_confirmation: userData.password_confirmation || "",
        role: userData.role || "frontoffice", // Default role if not provided
      });
    }
  }, [userData, reset]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility state
  };

  const onSubmit = async (data) => {
    setLoading(true); // Set loading state to true

    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY; // Get API URL from environment variable
    const userId = userData?.id; // Assume userData has an id property

    try {
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: "PUT", // Ensure the method is PUT or PATCH
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          role: data.role,
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to update user"); // Handle failed response
      }

      // Parse the response JSON
      const result = await response.json();

      // Handle success - call the onSave callback with updated data
      onSave(result);

      // Show success toast notification
      toast.success("User updated successfully!");

      // Clear any errors and close the modal
      setError(null); // Clear error if present
      onClose(); // Close modal
    } catch (err) {
      // Show error toast notification in case of failure
      toast.error(`Error: ${err.message}`);

      // Set error message on failure if needed
      setError(err.message);
    } finally {
      // Set loading state to false after completion
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
              render={({ field }) => (
                <InputField
                  label="Name"
                  name="name"
                  placeholder="Enter Name"
                  icon={CiUser}
                  type="text"
                  {...field}
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
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <InputField
                    label="Password"
                    name="password"
                    icon={CiUser}
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"} // Toggle type based on state
                    {...field}
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
              )}
            />

            <Controller
              name="password_confirmation"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Confirm Password"
                  name="password_confirmation"
                  icon={CiUser}
                  placeholder="Confirm Password"
                  type={showPassword ? "text" : "password"} // Toggle type based on state
                  {...field}
                />
              )}
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
                  {...field}
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
