import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import UserTable from "@/components/tables/UserTable";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { TbPlus, TbFileDescription } from "react-icons/tb";
import InputField from "@/components/InputGroup/InputField";
import SelectField from "@/components/SelectField";
import axios from "axios";
import { roles } from "@/components/dummyData/FormData";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loader

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "",
    },
  });

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Role", accessor: "role" },
  ];
  // console.log(users);

  const fetchUsers = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_MAP_KEY}/api/users`; // Use your correct API URL here
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
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;
    const token = Cookies.get("authToken");
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/register`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("User registered successfully");
        methods.reset();
        setShowModal(false);
        fetchUsers();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <ToastContainer />

      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-72">
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
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add New User</h2>
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(handleAddUser)}
                  className="space-y-4"
                >
                  <Controller
                    name="name"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <InputField
                        label="Name"
                        icon={TbFileDescription}
                        placeholder="Enter Name"
                        error={error}
                        {...field} // This will pass value, onChange, and onBlur
                      />
                    )}
                  />

                  <Controller
                    name="email"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <InputField
                        label="Email"
                        icon={TbFileDescription}
                        placeholder="Enter Email"
                        error={error}
                        {...field} // This will pass value, onChange, and onBlur
                      />
                    )}
                  />

                  <div className="relative">
                    <Controller
                      name="password"
                      control={methods.control}
                      render={({ field, fieldState: { error } }) => (
                        <InputField
                          label="Password"
                          icon={CiUser}
                          placeholder="Enter Password"
                          error={error}
                          type={showPassword ? "text" : "password"}
                          {...field} // This will pass value, onChange, and onBlur
                        />
                      )}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-[50px]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="text-gray-500" />
                      ) : (
                        <AiOutlineEye className="text-gray-500" />
                      )}
                    </button>
                  </div>

                  <Controller
                    name="password_confirmation"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <InputField
                        label="Confirm Password"
                        icon={TbFileDescription}
                        placeholder="Confirm Password"
                        error={error}
                        type="password"
                        {...field} // This will pass value, onChange, and onBlur
                      />
                    )}
                  />

                  <Controller
                    name="role"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <SelectField
                        label="Select Role"
                        value={methods.watch("role")}
                        onChange={(e) =>
                          methods.setValue("role", e.target.value)
                        }
                        options={roles}
                        icon={TbFileDescription}
                        error={error}
                        {...field} // This will pass value, onChange, and onBlur
                      />
                    )}
                  />

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center justify-center"
                      disabled={loading} // Disable button when loading
                    >
                      {loading ? (
                        <ClipLoader size={20} color="#ffffff" />
                      ) : (
                        "Add User"
                      )}
                    </button>
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
