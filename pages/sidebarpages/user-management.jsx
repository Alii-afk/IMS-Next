import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import UserTable from "@/components/tables/UserTable";
import { FormProvider, useForm } from "react-hook-form";
import { TbPlus, TbFileDescription } from "react-icons/tb";
import InputField from "@/components/InputGroup/InputField";
import SelectField from "@/components/SelectField";
import axios from "axios";
import { roles } from "@/components/dummyData/FormData";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const methods = useForm();

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Role", accessor: "role" },
  ];
  console.log(users);

  const fetchUsers = async () => {
    const apiUrl = "http://127.0.0.1:8000/api/users"; // Use your correct API URL here
    try {
      const response = await axios.get(apiUrl);
      setUsers(response.data); // Assuming response.data is an array
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (data) => {
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY; // Ensure the correct API URL is used

    try {
      const response = await axios.post(`${apiUrl}/api/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
      });

      if (response.status === 201) {
        toast.success("User added successfully");
        methods.reset();
        setShowModal(false);
        fetchUsers(); // Fetch updated user list
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.email
          ? error.response.data.email.join(" ")
          : "Registration failed";
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-72 ml-32">
        <ToastContainer />

        <div className="bg-white shadow-sm">
          <div className="flex px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
          </div>
        </div>

        <div className="px-6 py-8">
          <UserTable
            columns={columns}
            data={users}
            searchEnabled={true}
            fetchUsers={fetchUsers}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <TbPlus className="w-6 h-6" />
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-10">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Add New User</h2>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleAddUser)}>
                  <div className="flex flex-col gap-4">
                    <InputField
                      label="Name"
                      name="name"
                      type="text"
                      icon={TbFileDescription}
                      placeholder="Enter Name"
                      register={methods.register}
                      error={methods.formState.errors.name?.message}
                    />
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      icon={TbFileDescription}
                      placeholder="Enter Email"
                      register={methods.register}
                      error={methods.formState.errors.email?.message}
                    />
                    <div className="relative">
                      <InputField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        icon={CiUser}
                        placeholder="Enter Password"
                        register={methods.register}
                        error={methods.formState.errors.password?.message}
                      />
                      <span
                        className="absolute right-4 top-[50px] cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible className="text-gray-500" />
                        ) : (
                          <AiOutlineEye className="text-gray-500" />
                        )}
                      </span>
                    </div>

                    <InputField
                      label="Confirm Password"
                      name="password_confirmation"
                      type="password"
                      icon={TbFileDescription}
                      placeholder="Confirm Password"
                      register={methods.register}
                      error={
                        methods.formState.errors.password_confirmation?.message
                      }
                    />

                    <SelectField
                      label="Select Role"
                      name="role"
                      value={methods.getValues("role")}
                      onChange={(e) => methods.setValue("role", e.target.value)}
                      options={roles}
                      icon={TbFileDescription}
                      error={methods.formState.errors.role?.message}
                    />

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Add User
                      </button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
