import React, { useState } from "react";

const FileUpload = ({ label, icon: Icon, name, onFileChange,error }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file); // Pass the selected file to the parent component
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-base font-medium text-gray-900">
        {label}
      </label>
      <div className="relative block w-full rounded-lg border border-dashed border-gray-500 py-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
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
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <span className="mt-2 block text-sm font-semibold text-gray-900">
          {fileName || "Drag & Drop or Click to Select PDF"}
        </span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}

    </div>
  );
};

export default FileUpload;
