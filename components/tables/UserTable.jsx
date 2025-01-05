import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import RoleAssignmentModal from "../models/RoleAssignmentModel";

const UserTable = ({ columns, data, searchEnabled }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter the data based on search query
  const filteredData = data.filter((user) => {
    return columns.some((column) => {
      const value = user[column.accessor];
      return value
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  });

  // Open the modal and set the selected user
  const handleRoleAssignment = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true); // Display modal
  };

  // Handle closing the modal with animation
  const handleCloseModal = () => {
    setIsModalOpen(false); // Trigger modal close animation
    setTimeout(() => setIsModalOpen(false), 300); // Close modal after animation duration
  };

  return (
    <div className="p-6 bg-gray-50 border rounded-lg shadow-lg">
      {searchEnabled && (
        <div className="mb-6 relative flex items-center">
          <AiOutlineSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-10 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <table className="min-w-full bg-white ">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-sm font-medium text-gray-700 tracking-wider"
              >
                {column.Header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 tracking-wider">
              Roles
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition duration-300"
            >
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-6 py-4 text-sm text-gray-700"
                >
                  {row[column.accessor]}
                </td>
              ))}
              <td className="px-6 py-4">
                <button
                  onClick={() => handleRoleAssignment(row)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                  Assign Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal with Tailwind CSS transition */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 transform transition-all duration-300 scale-95 hover:scale-100">
            <RoleAssignmentModal
              user={selectedUser}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
