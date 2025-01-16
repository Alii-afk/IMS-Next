import Cookies from "js-cookie";
import { FileEdit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StockModel from "./StockModel";

const EditDetailsModal = ({
  modalOpen,
  setModalOpen,
  currentRowData,
  userRole,
  onSubmit,
  fetchData,
  // datas,
}) => {
  if (!modalOpen) return null;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editableFields, setEditableFields] = useState({
    user_name: currentRowData.user_name,
    name: currentRowData.name,
    organization: currentRowData.organization,
    date_time: currentRowData.date_time,
    type: currentRowData.type,
  });

  const [editableField, setEditableField] = useState(
    currentRowData.programming_stocks.reduce((acc, stock) => {
      acc[stock.id] = { editable: false, description: stock.description };
      return acc;
    }, {})
  );

  const handleInputChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [editedStatus, setEditedStatus] = useState(
    currentRowData?.request_status || ""
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(
    userRole === "admin"
      ? currentRowData?.admin_notes || ""
      : userRole === "backoffice"
      ? currentRowData?.back_office_notes || ""
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
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const isComplete = currentRowData?.request_status === "complete";

  const handleSave = async () => {
    try {
      if (isComplete && userRole !== "admin") {
        toast.info("Cannot update a completed request.");
        return;
      }
      // If the request status is pending, do not allow updates
      if (editedStatus === "pending" && userRole !== "admin") {
        toast.info("Cannot update while the request is pending.");
        return;
      }

      const payload = { id: currentRowData.id };

      if (userRole === "frontoffice") {
        // Front office can edit basic fields and front office notes
        if (editableFields.name !== currentRowData.name) {
          payload.name = editableFields.name;
        }
        if (editableFields.organization !== currentRowData.organization) {
          payload.organization = editableFields.organization;
        }
        if (editableFields.date_time !== currentRowData.date_time) {
          payload.date_time = editableFields.date_time;
        }
        if (editableFields.type !== currentRowData.type) {
          payload.type = editableFields.type;
        }
        if (editedNotes !== currentRowData.front_office_notes) {
          payload.front_office_notes = editedNotes;
        }
      } else if (userRole === "admin") {
        // Admin can only edit status and admin notes
        if (editedStatus !== currentRowData.request_status) {
          payload.request_status = editedStatus;
        }
        if (editedNotes !== currentRowData.admin_notes) {
          payload.admin_notes = editedNotes;
        }
      } else if (userRole === "backoffice") {
        // Back office can only edit status to complete and back office notes
        if (editedStatus !== currentRowData.request_status) {
          payload.request_status = editedStatus;
        }
        if (editedNotes !== currentRowData.back_office_notes) {
          payload.back_office_notes = editedNotes;
        }
      }

      // // Handle changes to descriptions for each stock
      // currentRowData.programming_stocks.forEach((stock) => {
      //   const stockId = stock.id;
      //   const newDescription = editableField[stockId]?.description;

      //   // Only add the description to the payload if it has changed
      //   if (newDescription !== stock.description) {
      //     payload[`programming_stocks[${stockId}][description]`] =
      //       newDescription;
      //   }
      // });
      if (Object.keys(payload).length > 1) {
        const token = Cookies.get("authToken");
        const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

        const response = await fetch(`${apiUrl}/api/requests`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await response.json();
          toast.success("Changes saved successfully!");
          setTimeout(() => {
            setModalOpen(false);
            fetchData();
            // datas();
          }, 1000); // Delay closing the modal by 1 second
        }
      } else {
        toast.info("No changes to save.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 overflow-y-auto">
        <ToastContainer />
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 my-8">
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-800">
              Request Details
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClasses(
                currentRowData?.request_status
              )}`}
            >
              {currentRowData?.request_status?.replace(/\_/g, " ") ||
                "No status"}
            </span>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Info Card - Read-only for backoffice */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Name
                      </label>
                      {userRole === "frontoffice" ? (
                        <input
                          type="text"
                          className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                          value={editableFields.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-base text-gray-900">
                          {currentRowData.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Organization
                      </label>
                      {userRole === "frontoffice" ? (
                        <input
                          type="text"
                          className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                          value={editableFields.organization}
                          onChange={(e) =>
                            handleInputChange("organization", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-base text-gray-900">
                          {currentRowData.organization}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Date & Time
                      </label>
                      {userRole === "frontoffice" ? (
                        <input
                          type="datetime-local"
                          className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                          value={editableFields.date_time.slice(0, 16)}
                          onChange={(e) =>
                            handleInputChange("date_time", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-base text-gray-900">
                          {new Date(currentRowData.date_time).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Type
                      </label>
                      {userRole === "frontoffice" ? (
                        <input
                          type="text"
                          className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                          value={editableFields.type}
                          onChange={(e) =>
                            handleInputChange("type", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-base text-gray-900">
                          {currentRowData.type}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section - Admin (Hidden) & Back Office (Visible) */}
              <div className="flex  md:flex-row justify-between gap-6">
                {(userRole === "admin" ||
                  userRole === "backoffice" ||
                  userRole === "frontoffice") && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-lg px-2 py-3 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Status
                    </h3>

                    {userRole === "frontoffice" ? (
                      // Front Office: Read-only Status with Color Classes
                      <p
                        className={`px-4 py-2 rounded-full text-xs font-medium capitalize ${getStatusClasses(
                          editedStatus
                        )}`}
                      >
                        {editedStatus || "No status available"}
                      </p>
                    ) : (
                      // Admin and Back Office: Editable Dropdown
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
                )}

                {/* Show Add Button for Back Office */}
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

              {isModalOpen && <StockModel handleCloseModal={handleCloseModal} currentRowData={currentRowData} />}

              <div className="grid md:grid-cols-3 gap-6">
                {/* Front Office Notes */}
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Front Office Notes
                    </h3>
                    {userRole === "frontoffice" && (
                      <button
                        onClick={() => setIsEditingNotes(!isEditingNotes)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {isEditingNotes ? (
                          <AiOutlineCheck className="w-5 h-5" />
                        ) : (
                          <FileEdit className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                  {userRole === "frontoffice" && isEditingNotes ? (
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Enter front office notes..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700">
                      {currentRowData.front_office_notes ||
                        "No front office notes available"}
                    </p>
                  )}
                </div>

                {/* Admin Notes */}
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Admin Notes
                    </h3>
                    {userRole === "admin" && (
                      <button
                        onClick={() => setIsEditingNotes(!isEditingNotes)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {isEditingNotes ? (
                          <AiOutlineCheck className="w-5 h-5" />
                        ) : (
                          <FileEdit className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                  {userRole === "admin" && isEditingNotes ? (
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Enter admin notes..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700">
                      {currentRowData.admin_notes || "No admin notes available"}
                    </p>
                  )}
                </div>

                {/* Back Office Notes */}
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Back Office Notes
                    </h3>
                    {userRole === "backoffice" && (
                      <button
                        onClick={() => setIsEditingNotes(!isEditingNotes)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {isEditingNotes ? (
                          <AiOutlineCheck className="w-5 h-5" />
                        ) : (
                          <FileEdit className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                  {userRole === "backoffice" && isEditingNotes ? (
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Enter back office notes..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700">
                      {currentRowData.back_office_notes ||
                        "No back office notes available"}
                    </p>
                  )}
                </div>
              </div>

              {/* Programming Stocks Section - Read-only for all */}
              {currentRowData.programming_stocks &&
                currentRowData.programming_stocks.length > 0 && (
                  <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Programming Stocks
                    </h3>
                    {currentRowData.programming_stocks.map((stock) => (
                      <div
                        key={stock.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-md font-semibold text-gray-800">
                            {stock.product_name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            Product ID: {stock.product_id}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Serial No:
                            </span>
                            <span className="text-sm font-medium">
                              {stock.serial_no}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Description:
                            </p>
                            {userRole === "backoffice" && (
                              <button
                                onClick={() =>
                                  setEditableField((prev) => ({
                                    ...prev,
                                    [stock.id]: {
                                      ...prev[stock.id],
                                      editable: !prev[stock.id].editable,
                                    },
                                  }))
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {editableField[stock.id]?.editable ? (
                                  <AiOutlineCheck className="w-5 h-5" />
                                ) : (
                                  <FileEdit className="w-5 h-5" />
                                )}
                              </button>
                            )}
                            {editableField[stock.id]?.editable ? (
                              <textarea
                                value={editableField[stock.id]?.description}
                                onChange={(e) =>
                                  setEditableField((prev) => ({
                                    ...prev,
                                    [stock.id]: {
                                      ...prev[stock.id],
                                      description: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                                placeholder="Enter front office notes..."
                              />
                            ) : (
                              <p className="text-sm text-gray-700">
                                {stock.description ||
                                  "No front office notes available"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
