import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { GrEdit, GrTrash, GrUnlink } from "react-icons/gr";
import EditUserModal from "../models/EditUserModel";
import RoleAssignmentModal from "../models/RoleAssignmentModel";
import { toast } from "react-toastify";
import DeleteConfirmation from "../card/DeleteConfirmation";
import DisableUser from "../card/DisableUser";
import Cookies from "js-cookie";

const UserTable = ({ columns, data, searchEnabled, fetchUsers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoleAssignmentModalOpen, setIsRoleAssignmentModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = (data?.users || []).filter((user) =>
    columns.some((column) => {
      const value = user[column.accessor]?.toString().toLowerCase();
      return value?.includes(searchQuery.toLowerCase());
    })
  );

  const handleRoleAssignment = (user) => {
    setSelectedUser(user);
    setIsRoleAssignmentModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId) => {
    let token = Cookies.get("authToken"); // ✅ Get token from cookies

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Attach token
            Accept: "application/json",
          },
          body: JSON.stringify({ disable: true }), // ✅ Send "disable: true" in the request body
        }
      );

      if (response.ok) {
        toast.success("User disabled successfully!");
        setIsDeleteModalOpen(false);
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to disable user: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsRoleAssignmentModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleUserEditSubmit = () => {
    setIsEditModalOpen(false);
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

      <table className="min-w-full bg-white">
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
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
                  <div className="flex flex-wrap gap-2 justify-start">
                    {row.role !== "admin" && (
                      <>
                        <button
                          onClick={() => handleRoleAssignment(row)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
                        >
                          Assign Role
                        </button>
                        <button
                          onClick={() => handleEdit(row)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition duration-200 w-full sm:w-auto"
                        >
                          <GrEdit className="inline-block mr-2" /> Edit
                        </button>
                        {row.role !== "user" && (
                          <button
                            onClick={() => openDeleteModal(row)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-200 w-full sm:w-auto"
                          >
                            <GrUnlink className="inline-block mr-2" /> Disable
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-4 text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <DisableUser
          handleDelete={() => handleDelete(selectedUser.id)}
          closeModal={handleCloseModal}
        />
      )}

      {/* Modal with Tailwind CSS transition for Role Assignment */}
      {isRoleAssignmentModalOpen && (
        <RoleAssignmentModal
          user={selectedUser}
          fetchUsers={fetchUsers}
          onClose={handleCloseModal}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          userData={selectedUser}
          fetchUsers={fetchUsers}
          onSave={handleUserEditSubmit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default UserTable;
