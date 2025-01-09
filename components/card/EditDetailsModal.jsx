import Cookies from "js-cookie";
import { FileEdit } from "lucide-react";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDetailsModal = ({
  modalOpen,
  setModalOpen,
  currentRowData,
  userRole,
  onSubmit,
}) => {
  if (!modalOpen) return null; // Do not render if modal is not open
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");

  const [editedNotes, setEditedNotes] = useState(
    userRole === "admin"
      ? currentRowData?.admin_notes || ""
      : currentRowData?.front_office_notes || ""
  );

  const handleSave = async () => {
    try {
      setIsEditing(false);

      const keyToUpdate =
        userRole === "admin" ? "admin_notes" : "front_office_notes";
      const payload = {
        [keyToUpdate]: editedNotes,
        status: editedStatus,
      };

      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      const response = await fetch(
        `${apiUrl}/api/requests/${currentRowData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        toast.success("Notes and Status updated successfully!");
        console.log("Updated Data:", updatedData);
      } else {
        const errorData = await response.json();
        toast.error(
          `Error: ${errorData.message || "Failed to update notes and status"}`
        );
        console.error("Error updating notes and status:", errorData);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    }
  };

  return (
    <>
      <ToastContainer />

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
                    Type
                  </td>
                  <td className="py-2 px-4">{currentRowData.type}</td>
                </tr>

                {/* Notes field */}
                <tr>
                  <td className="py-2 px-4 text-sm font-medium text-gray-800">
                    {userRole === "admin"
                      ? "Admin Notes"
                      : "Front Office Notes"}
                  </td>
                  <td className="py-2 px-4 flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      editedNotes || "No Notes Available"
                    )}
                    {isEditing ? (
                      <AiOutlineCheck
                        onClick={handleSave}
                        className="cursor-pointer text-green-500"
                        title="Save"
                      />
                    ) : (
                      <FileEdit
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer text-blue-500"
                        title="Edit"
                      />
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 px-4 text-sm font-medium text-gray-800">
                    Status
                  </td>
                  <td className="py-2 px-4 flex items-center gap-2">
                    {userRole === "frontoffice" ? (
                      isEditing ? (
                        <select
                          value={editedStatus || currentRowData.request_status}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          className="border rounded-md px-2 py-1 text-sm w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                          <option value="in_progress">In Progress</option>
                          <option value="complete">Complete</option>
                        </select>
                      ) : (
                        currentRowData.request_status
                      )
                    ) : (
                      currentRowData.request_status
                    )}

                    {userRole === "frontoffice" && !isEditing && (
                      <FileEdit
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer text-blue-500"
                        title="Edit"
                      />
                    )}

                    {isEditing && (
                      <AiOutlineCheck
                        onClick={handleSave}
                        className="cursor-pointer text-green-500"
                        title="Save"
                      />
                    )}
                  </td>
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
    </>
  );
};

export default EditDetailsModal;
