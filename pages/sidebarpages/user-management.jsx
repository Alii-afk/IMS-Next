import React from "react";
import Sidebar from "@/components/Sidebar";
import UserTable from "@/components/tables/UserTable";

const UserManagement = () => {
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Role", accessor: "role" },
  ];

  const peoples = [
    { name: "John Doe", email: "john@example.com", role: "Admin" },
    { name: "Jane Smith", email: "jane@example.com", role: "User" },
    { name: "Bill Gates", email: "bill@example.com", role: "Admin" },
    // Add more data
  ];

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-white flex">
      {/* Sidebar Component */}
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-0 lg:ml-12">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex max-w-7xl mx-auto px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <UserTable
            columns={columns}
            data={peoples}
            searchEnabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
