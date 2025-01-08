import React, { useState } from "react";

const RoleAssignmentModal = ({ user, onClose }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Handle role assignment
  const handleAssignRole = async () => {
    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole.toLowerCase() }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign role. Please try again.");
      }

      const data = await response.json();
      alert(`Role ${data.role} assigned to ${user.name}`);
      onClose(); // Close the modal after successful assignment
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 animate__animated animate__fadeIn animate__faster">
      <div className="bg-white p-6 rounded-md w-96 transform animate__animated animate__zoomIn animate__faster">
        <h2 className="text-xl font-semibold mb-4">Assign Role to {user.name}</h2>
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Select Role
          </label>
          <select
            id="role"
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a role</option>
            <option value="Frontoffice">Frontoffice</option>
            <option value="Backoffice">Backoffice</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
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
  );
};

export default RoleAssignmentModal;
