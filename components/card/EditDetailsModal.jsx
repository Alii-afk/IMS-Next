import React from "react";

const EditDetailsModal = ({
  modalOpen,
  setModalOpen,
  currentRowData,
  userRole,
  onSubmit,
}) => {
  if (!modalOpen) return null; // Do not render if modal is not open

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-10"
      style={{
        animation: modalOpen
          ? "scaleUp 0.3s ease-out"
          : "scaleDown 0.3s ease-in",
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/5 lg:w-2/5 max-h-[90vh] overflow-auto hide-scrollbar">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Edit Details
        </h2>

        {/* Only display the current row data */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {currentRowData.name}
          </h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left text-sm text-gray-700">
                  Label
                </th>
                <th className="py-2 px-4 text-left text-sm text-gray-700">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Name field */}
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-800">
                  Name
                </td>
                <td className="py-2 px-4">{currentRowData.name}</td>
              </tr>

              {/* Organization field */}
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-800">
                  Organization
                </td>
                <td className="py-2 px-4">{currentRowData.organization}</td>
              </tr>

              {/* Date & Time field */}
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-800">
                  Date & Time
                </td>
                <td className="py-2 px-4">
                  {new Date(currentRowData.date_time).toLocaleString()}
                </td>
              </tr>

              {/* Select Type */}
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-800">
                  Select the Type
                </td>
                <td className="py-2 px-4">{currentRowData.type}</td>
              </tr>

              {/* Notes field */}
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-800">
                  Notes
                </td>
                <td className="py-2 px-4">
                  {currentRowData?.front_office_notes === "undefined"
                    ? "Not Found Notes"
                    : currentRowData?.front_office_notes}
                </td>
              </tr>

              {/* Status field */}
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-800">
                  Status
                </td>
                <td className="py-2 px-4">{currentRowData.request_status}</td>
              </tr>

              {/* Programming Stocks */}
              {currentRowData.programming_stocks.length > 0 && (
                <tr>
                  <td colSpan="2" className="py-4 px-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Programming Stocks
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentRowData.programming_stocks.map((stock) => (
                        <div
                          key={stock.id}
                          className="border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md"
                        >
                          <h5 className="font-semibold text-gray-900">
                            {stock.product_name}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            Serial No: {stock.serial_no}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Product ID: {stock.product_id}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Description: {stock.description}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Sign Code: {stock.sign_code || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Codeplug: {stock.codeplug || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Channels: {stock.channels || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Unit: {stock.unit || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}

              {/* Additional fields for 'new' type */}
              {currentRowData.type === "new" && (
                <>
                  <tr>
                    <td className="py-2 px-4 text-sm font-medium text-gray-800">
                      Serial Number
                    </td>
                    <td className="py-2 px-4">
                      {currentRowData.serial_number}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm font-medium text-gray-800">
                      Sign Code
                    </td>
                    <td className="py-2 px-4">{currentRowData.sign_code}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm font-medium text-gray-800">
                      Codeplug
                    </td>
                    <td className="py-2 px-4">{currentRowData.codeplug}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm font-medium text-gray-800">
                      Channels
                    </td>
                    <td className="py-2 px-4">{currentRowData.channels}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm font-medium text-gray-800">
                      Unit
                    </td>
                    <td className="py-2 px-4">{currentRowData.unit}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onSubmit(currentRowData)} // Trigger onSubmit with currentRowData
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={userRole === "frontoffice"} // Disable submit for frontoffice
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDetailsModal;
