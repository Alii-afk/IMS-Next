import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";

const Profile = () => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    image: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = Cookies.get("role");
    const userName = Cookies.get("name");
    const userEmail = Cookies.get("email");

    setRole(userRole || "Guest");
    setFormData((prevData) => ({
      ...prevData,
      name: userName || "John Doe",
      email: userEmail || "",
    }));
  }, []);

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
    Cookies.set(field, formData[field], { expires: 7 }); // Save updated data to cookies
  };

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  let logoSrc;

  if (role === "admin") {
    logoSrc = "/images/admin.jpg";
  } else if (role === "backoffice") {
    logoSrc = "/images/backoffice.jpg";
  } else if (role === "frontoffice") {
    logoSrc = "/images/frontoffice.jpg";
  }
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-indigo-700 text-white shadow-lg" />

      <div className="lg:ml-72 p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              User Profile
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              Your profile details
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
             
                <img
                  src={
                    logoSrc ||
                    "https://randomuser.me/api/portraits/men/1.jpg"
                  }
                  alt="Profile"
                  className="w-36 h-36 rounded-full border-4 border-indigo-600 mb-4 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                {/* <div
                  className="absolute bottom-0 right-0 bg-indigo-600 p-3 rounded-full cursor-pointer shadow-lg transform transition-all duration-300 hover:bg-indigo-700 hover:scale-110"
                  onClick={() => handleEditClick("image")}
                >
                  <PencilIcon className="w-5 h-5 text-white" />
                </div> */}
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">Role:</p>
              <h3 className="text-2xl font-semibold text-indigo-600">{role}</h3>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                {isEditing.name ? (
                  <div className="w-full">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange(e, "name")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300"
                      placeholder="Enter Name"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <h3 className="text-xl font-semibold text-gray-800 mt-1">
                      {formData.name}
                    </h3>
                  </div>
                )}
                {/* <div
                  className="ml-4 p-2 cursor-pointer text-indigo-600 hover:text-indigo-700 transition-all duration-300 rounded-full hover:bg-indigo-50"
                  onClick={() => handleEditClick("name")}
                >
                  <PencilIcon className="w-5 h-5" />
                </div> */}
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                {isEditing.email ? (
                  <div className="w-full">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange(e, "email")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300"
                      placeholder="Enter Email"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <h3 className="text-2xl font-semibold text-black">
                      {formData.email}
                    </h3>
                  </div>
                )}
                {/* <div
                  className="ml-4 p-2 cursor-pointer text-indigo-600 hover:text-indigo-700 transition-all duration-300 rounded-full hover:bg-indigo-50"
                  onClick={() => handleEditClick("email")}
                >
                  <PencilIcon className="w-5 h-5" />
                </div> */}
              </div>
            </div>

            {isEditing.image && (
              <div className="mt-8 max-w-md mx-auto">
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <label
                      htmlFor="image-upload"
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Choose Image
                    </label>

                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {imagePreview && (
                      <div className="mt-6">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600 shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {(isEditing.name || isEditing.email) && (
              <div className="mt-8 flex space-x-4 justify-center">
                <button
                  onClick={() => handleSave(isEditing.name ? "name" : "email")}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing({ name: false, email: false })}
                  className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
