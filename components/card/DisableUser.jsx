import React from "react";

const DisableUser = ({ handleDelete, closeModal }) => {
  return (
    <div className="bg-gray-900 bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6 transform transition-all duration-300 ease-in-out scale-100 hover:scale-105">
        {/* Modal Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Are you sure you want to disable this user his/her role will get set as "user" with no access?
        </h2>

        <div className="flex justify-between space-x-4">
          {/* Cancel Button */}
          <button
            onClick={closeModal}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          >
            Cancel
          </button>

          {/* Confirm Button */}
          <button
            onClick={handleDelete}
            className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisableUser;
