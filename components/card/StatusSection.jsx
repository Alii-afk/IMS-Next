// StatusSection.js
import React from 'react';

const StatusSection = ({ userRole, editedStatus, setEditedStatus, getStatusClasses, handleOpenModal, currentRowData }) => {
  if (!(userRole === "admin" || userRole === "backoffice" || userRole === "frontoffice")) {
    return null;
  }

  return (
    <div className="flex md:flex-row justify-between gap-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg px-2 py-3 flex-1">
        <h3 className="text-lg font-semibold text-gray-800">Status</h3>
        {userRole === "frontoffice" ? (
          <p className={`px-4 py-2 rounded-full text-xs font-medium capitalize ${getStatusClasses(editedStatus)}`}>
            {editedStatus || "No status available"}
          </p>
        ) : (
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-200"
          >
            {userRole === "admin" ? (
              <>
                <option value="">Select</option>
                <option value="in_progress">In Progress</option>
                <option value="rejected">Rejected</option>
              </>
            ) : (
              <>
                <option value="">Select</option>
                <option value="complete">Complete</option>
              </>
            )}
          </select>
        )}
      </div>
      {userRole === "backoffice" && currentRowData.type === "new" && (
        <div className="flex justify-end mt-6 md:mt-0">
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-3 shadow-md transition ease-in-out duration-200 transform hover:scale-105"
          >
            Add Stock
          </button>
        </div>
      )}
    </div>
  );
};


export default StatusSection;