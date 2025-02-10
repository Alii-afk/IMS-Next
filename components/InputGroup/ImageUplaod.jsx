import React, { useState, useRef, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const ImageUpload = ({ label, icon: Icon, name, onImageChange, error, tableClass, currentImageUrl }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null); // Create a reference to the file input

  useEffect(() => {
    if (currentImageUrl) {
      setImagePreview(`${process.env.NEXT_PUBLIC_MAP_KEY}${currentImageUrl}`); // Set the current image URL for preview
    }
  }, [currentImageUrl]);

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

    // Reset the file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This allows selecting the same file again
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-base font-medium text-gray-900">
        {label}
      </label>
      <div className={`relative block w-full ${tableClass} mx-auto rounded-lg border border-dashed border-gray-500 py-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden`}>
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
          ref={fileInputRef} // Attach the ref to the file input
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="max-h-64 max-w-64 object-cover mx-auto rounded-lg"
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
