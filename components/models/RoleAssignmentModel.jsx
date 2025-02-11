import Cookies from "js-cookie";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure to import the styles

const RoleAssignmentModal = ({ user, onClose, fetchUsers }) => {
  // Add fetchUsers as a prop to refetch users
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleAssignRole = async () => {
    if (!selectedRole) {
      setTimeout(() => {
        toast.error("Please select a role.");
      }, 3000);
      return;
    }

    setLoading(true);

    // Get token from cookies
    const token = Cookies.get("authToken"); // Replace 'authToken' with your actual cookie name

    if (!token) {
      setTimeout(() => {
        toast.error("Authentication token is missing. Please log in again.");
      }, 3000);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Use JSON content type
          },
          body: JSON.stringify({ role: selectedRole.toLowerCase() }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign role. Please try again.");
      }

      const data = await response.json();
      setTimeout(() => {
        toast.success(`Role ${data.role} assigned to ${user.name}`); // Success notification
      }, 3000);
      onClose(); // Close the modal after success
      fetchUsers();
    } catch (error) {
      setTimeout(() => {
        toast.error(error.message || "An error occurred. Please try again."); // Display error message
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 transition-opacity duration-300">
        <div className="bg-white p-6 rounded-md w-96 transform animate__animated animate__zoomIn animate__faster">
          <h2 className="text-xl font-semibold mb-4">
            Assign Role to {user.name}
          </h2>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-base font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a role</option>
              <option value="frontoffice">Frontoffice</option>
              <option value="backoffice">Backoffice</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleAssignRole}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Assigning..." : "Assign Role"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default RoleAssignmentModal;
