import React, { useState } from "react";
import { FaTrash } from "react-icons/fa"; // Trash icon for removing the image

const ImageUpload = ({ label, icon: Icon, name, onImageChange, error ,tableClass}) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show the image preview
      onImageChange(file); // Pass the selected file to the parent component
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null); // Remove the preview
    onImageChange(null); // Remove the file in the parent component
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-base font-medium text-gray-900">
        {label}
      </label>
      <div className={`relative block w-full ${tableClass}  mx-auto rounded-lg border border-dashed border-gray-500 py-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden`}>
        {Icon && (
          <Icon
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="mx-auto size-12 text-gray-400"
          />
        )}
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="max-h-64 w-full object-cover mx-auto rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
            >
              <FaTrash />
            </button>
          </div>
        ) : (
          <span className="mt-2 block text-sm font-semibold text-gray-900">
            Click to Select Image
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
