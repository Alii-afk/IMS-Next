import React from 'react';

const BasicInfoCard = ({ editableFields, handleInputChange, currentRowData, userRole }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            {userRole === "frontoffice" ? (
              <input
                type="text"
                className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                value={editableFields.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <p className="text-base text-gray-900">{currentRowData.name}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Organization</label>
            {userRole === "frontoffice" ? (
              <input
                type="text"
                className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                value={editableFields.organization}
                onChange={(e) => handleInputChange("organization", e.target.value)}
              />
            ) : (
              <p className="text-base text-gray-900">{currentRowData.organization}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Date & Time</label>
            {userRole === "frontoffice" ? (
              <input
                type="datetime-local"
                className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                value={editableFields.date_time.slice(0, 16)}
                onChange={(e) => handleInputChange("date_time", e.target.value)}
              />
            ) : (
              <p className="text-base text-gray-900">
                {new Date(currentRowData.date_time).toLocaleString()}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Type</label>
            {userRole === "frontoffice" ? (
              <input
                type="text"
                className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                value={editableFields.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              />
            ) : (
              <p className="text-base text-gray-900">{currentRowData.type}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default BasicInfoCard;