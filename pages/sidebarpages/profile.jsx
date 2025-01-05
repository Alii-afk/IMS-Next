import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid"; // Ensure correct icon
import InputField from "@/components/InputGroup/InputField";

const Profile = () => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    image: false, // To handle image editing
  });
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
  });
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [imageFile, setImageFile] = useState(null); // To store the uploaded image file

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
    // Save logic can be added here (API call or state update)
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
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-indigo-700 text-white shadow-md" />

      {/* Main Content Area */}
      <div className="lg:ml-72 p-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage and update your profile details
            </p>
          </div>

          {/* Profile Content */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                {/* Show the image preview or fallback to the default image */}
                <img
                  src={
                    imagePreview ||
                    "https://randomuser.me/api/portraits/men/1.jpg"
                  } // Replace with your image URL
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-indigo-600 mb-4 shadow-lg"
                />
                <div
                  className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer"
                  onClick={() => setIsEditing({ ...isEditing, image: true })} // Open image edit mode
                >
                  <PencilIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Editable Name Field */}
            <div className="flex justify-between items-center mb-8">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter Name"
                  />
                </div>
              ) : (
                <h3 className="text-2xl font-semibold text-gray-700">
                  {formData.name}
                </h3>
              )}
              <div
                className="ml-2 cursor-pointer text-blue-600 hover:text-blue-700 transition-all duration-300"
                onClick={() => handleEditClick("name")}
              >
                <PencilIcon className="w-6 h-6" />
              </div>
            </div>

            {/* Editable Email Field */}
            <div className="flex justify-between items-center mb-8">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter Email"
                  />
                </div>
              ) : (
                <h3 className="text-2xl font-semibold text-gray-700">
                  {formData.email}
                </h3>
              )}
              <div
                className="ml-2 cursor-pointer text-blue-600 hover:text-blue-700 transition-all duration-300"
                onClick={() => handleEditClick("email")}
              >
                <PencilIcon className="w-6 h-6" />
              </div>
            </div>

            {/* Image Upload Section */}
            {isEditing.image && (
              <div className="mt-6 flex flex-col items-start justify-start">
                {/* Image Upload Text */}
                <p className="text-gray-600 text-sm mb-3">
                  Upload a new profile picture
                </p>

                {/* File input container */}
                <div className="w-full max-w-md bg-white p-6 border border-gray-300 rounded-xl shadow-md">
                  <div className="flex flex-col items-center">
                    {/* File Input Label */}
                    <label
                      htmlFor="image-upload"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-all duration-300"
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

                    {/* Image Preview (if available) */}
                    {imagePreview ? (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600 shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 text-center text-gray-400">
                        <p>No image selected</p>
                        <p className="text-sm">
                          You can preview your selected image here.
                        </p>
                      </div>
                    )}

                    {/* Button to confirm upload */}
                    {imagePreview && (
                      <button
                        onClick={
                          () => setIsEditing({ ...isEditing, image: false }) // Close image edit mode
                        }
                        className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300"
                      >
                        Save Image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Save/Cancel Button for editable fields */}
            {isEditing.name || isEditing.email ? (
              <div className="mt-4 flex space-x-6 justify-center">
                <button
                  onClick={() => handleSave(isEditing.name ? "name" : "email")}
                  className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing({ name: false, email: false })}
                  className="py-2 px-6 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
