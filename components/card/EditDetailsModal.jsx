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
  fetchData 

}) => {
  if (!modalOpen) return null; // Do not render if modal is not open

  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editedNotes, setEditedNotes] = useState(
    userRole === "admin"
      ? currentRowData?.admin_notes || ""
      : currentRowData?.front_office_notes || ""
  );

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-300";
      case "in_progress":
        return "bg-indigo-100 text-indigo-800 border border-indigo-300";
      case "complete":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300"; // fallback
    }
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);

      const keyToUpdate =
        userRole === "admin"
          ? "admin_notes"
          : userRole === "frontoffice"
          ? "front_office_notes"
          : userRole === "backoffice"
          ? "back_office_notes"
          : "notes";

      // Prepare payload dynamically based on the user role
      const payload = {
        id: currentRowData.id,
        [keyToUpdate]:
          editedNotes !== currentRowData[keyToUpdate]
            ? editedNotes
            : currentRowData[keyToUpdate],
      };

      // Only add status to the payload if the user is not frontoffice
      if (userRole !== "frontoffice") {
        payload.status =
          editedStatus !== currentRowData.request_status
            ? editedStatus
            : currentRowData.request_status;
      }

      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      const response = await fetch(`${apiUrl}/api/requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedData = await response.json();
        toast.success("Notes and Status updated successfully!");
        setModalOpen(false);
        fetchData()

      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData?.message || "Failed to update notes and status";
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
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

                <tr>
                  <td className="py-2 px-4 text-sm font-medium text-gray-800">
                    {userRole === "admin"
                      ? "Admin Notes"
                      : userRole === "frontoffice"
                      ? "Front Office Notes"
                      : userRole === "backoffice"
                      ? "Back Office Notes"
                      : "Notes"}
                  </td>

                  <td className="py-2 px-4 flex items-center gap-2">
                    {isEditingNotes ? (
                      <input
                        type="text"
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 w-full"
                      />
                    ) : (
                      editedNotes || "No Notes Available"
                    )}

                    {isEditingNotes ? (
                      <AiOutlineCheck
                        onClick={() => setIsEditingNotes(false)}
                        className="cursor-pointer text-green-500 hover:text-green-700 transition-transform transform hover:scale-110"
                        title="Save"
                      />
                    ) : (
                      <FileEdit
                        onClick={() => {
                          setIsEditingNotes(true);
                          setIsEditingStatus(false); // Close status edit if open
                        }}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-110"
                        title="Edit Notes"
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </td>

                  <td className="py-2 px-4 flex items-center gap-3">
                    {isEditingStatus ? (
                      <select
                        value={editedStatus || currentRowData.request_status}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
                      >
                        {/* Admin: Show only In Progress and Declined */}
                        {userRole === "admin" && (
                          <>
                            <option value="in_progress">In Progress</option>
                            <option value="declined">Declined</option>
                          </>
                        )}

                        {/* Frontoffice: Show status but don't allow editing */}
                        {userRole === "frontoffice" && (
                          <option
                            value={currentRowData?.request_status}
                            disabled
                          >
                            {currentRowData?.request_status
                              ? currentRowData.request_status.replace(
                                  /\_/g,
                                  " "
                                )
                              : "No status available"}
                          </option>
                        )}

                        {/* Backoffice: Show only Complete */}
                        {userRole === "backoffice" && (
                          <>
                            <option value="complete">Complete</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClasses(
                          currentRowData?.request_status
                        )}`}
                      >
                        {currentRowData?.request_status
                          ? currentRowData.request_status.replace(/\_/g, " ")
                          : "No status available"}
                      </span>
                    )}

                    {isEditingStatus ? (
                      <AiOutlineCheck
                        onClick={() => setIsEditingStatus(false)}
                        className="cursor-pointer text-green-500 hover:text-green-700 transition-transform transform hover:scale-110"
                        title="Save Status"
                      />
                    ) : (
                      // Conditionally render the FileEdit icon for front office users
                      userRole !== "frontoffice" && (
                        <FileEdit
                          onClick={() => {
                            setIsEditingStatus(true);
                            setIsEditingNotes(false); // Close notes edit if open
                          }}
                          className="cursor-pointer text-indigo-500 hover:text-indigo-700 transition-transform transform hover:scale-110"
                          title="Edit Status"
                        />
                      )
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDetailsModal;
