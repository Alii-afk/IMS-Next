import Cookies from "js-cookie";
import { FileEdit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StockModel from "./StockModel";
import FrontOfficeBackOfficePDF from "./frontofficePdf";
import UplaodBackPdf from "../models/UploadPdf";

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
  const [editingWarehouseStock, setEditingWarehouseStock] = useState({});
  const [editingProgrammingStock, setEditingProgrammingStock] = useState({});

  const toggleProgrammingStockEdit = (id, field) => {
    setEditingProgrammingStock((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id]?.[field],
      },
    }));
  };

  // Update the specific field of the stock item
  const updateProgrammingStockField = (stockId, field, value) => {
    setEditableField((prev) => {
      const newState = { ...prev };
      if (!newState[stockId]) newState[stockId] = {};
      newState[stockId][field] = value;
      return newState;
    });
  };
  // Toggle edit mode for a specific field and stock ID
  const toggleWarehouseStockEdit = (stockId, field) => {
    setEditingWarehouseStock((prev) => ({
      ...prev,
      [stockId]: {
        ...prev[stockId],
        [field]: !prev[stockId]?.[field],
      },
    }));
  };

  // Update the field value while editing
  const updateWarehouseStockField = (stockId, field, value) => {
    setEditableField((prev) => ({
      ...prev,
      [stockId]: {
        ...prev[stockId],
        [field]: value,
      },
    }));
  };

  const [modalContent, setModalContent] = useState("");
  const [isModalNotesOpen, setIsModalNotesOpen] = useState(false);

  // Function to handle text truncation
  const truncateText = (text, maxLength = 30) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  // Function to open the modal and display full text
  const openModal = (text) => {
    setModalContent(text);
    setIsModalNotesOpen(true);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-300";
      case "approved":
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
  const allowedRoles = ["admin", "backoffice"];

  const handleDeleteStock = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this item?" // Updated message
      );
      if (!confirmed) return;

      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      // Send the DELETE request to the API
      const response = await fetch(
        `${apiUrl}/api/warehouse-stock/deattachStock`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        fetchData();
        setTimeout(() => {
          toast.success("Stock deleted successfully!");
          setModalOpen(false);
        }, 1000);
      } else {
        const error = await response.json();
        setTimeout(() => {
          toast.error(
            error.message || "Failed to delete stock. Please try again."
          );
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error("An unexpected error occurred. Please try again.");
      }, 3000);
    }
  };

  const handleSave = async () => {
    try {
      if (isComplete && !allowedRoles.includes(userRole)) {
        setTimeout(() => {
          toast.info("Cannot update a completed request.");
        }, 3000);
        return;
      }

      const payload = { id: currentRowData.id };
      const programmingStockData = [];
      const warehouseStockData = [];

      // Handle field updates based on user role
      if (userRole === "frontoffice") {
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
        if (editedStatus !== currentRowData.request_status) {
          payload.request_status = editedStatus;
        }
        if (editedNotes !== currentRowData.admin_notes) {
          payload.admin_notes = editedNotes;
        }
      } else if (userRole === "backoffice") {
        if (editedStatus !== currentRowData.request_status) {
          payload.request_status = editedStatus;
        }
        if (editedNotes !== currentRowData.back_office_notes) {
          payload.back_office_notes = editedNotes;
        }
      }

      // Handle programming stocks (if any)
      if (
        currentRowData.programming_stocks &&
        currentRowData.programming_stocks.length > 0
      ) {
        currentRowData.programming_stocks.forEach((stock) => {
          const stockId = stock.id;
          const updatedStock = {
            id: stockId,
            sign_code: editableField[stockId]?.sign_code || stock.sign_code,
            codeplug: editableField[stockId]?.codeplug || stock.codeplug,
            channels: editableField[stockId]?.channels || stock.channels,
            unit: editableField[stockId]?.unit || stock.unit,
            description:
              editableField[stockId]?.description || stock.description,
          };

          const hasChanges =
            updatedStock.sign_code !== stock.sign_code ||
            updatedStock.codeplug !== stock.codeplug ||
            updatedStock.channels !== stock.channels ||
            updatedStock.unit !== stock.unit ||
            updatedStock.description !== stock.description; // Ensure description is checked

          if (hasChanges) {
            programmingStockData.push(updatedStock);
          }
        });
      }

      // Handle warehouse stocks (if any)
      if (
        currentRowData.warehouse_stocks &&
        currentRowData.warehouse_stocks.length > 0
      ) {
        currentRowData.warehouse_stocks.forEach((stock) => {
          const stockId = stock.id;
          const updatedStock = {
            id: stockId,
            sign_code: editableField[stockId]?.sign_code || stock.sign_code,
            codeplug: editableField[stockId]?.codeplug || stock.codeplug,
            channels: editableField[stockId]?.channels || stock.channels,
            unit: editableField[stockId]?.unit || stock.unit,
          };

          const hasChanges =
            updatedStock.sign_code !== stock.sign_code ||
            updatedStock.codeplug !== stock.codeplug ||
            updatedStock.channels !== stock.channels ||
            updatedStock.unit !== stock.unit;

          if (hasChanges) {
            warehouseStockData.push(updatedStock);
          }
        });
      }

      // Add warehouseStockData to the payload if any changes are detected
      if (warehouseStockData.length > 0) {
        payload.warehouse_stocks = warehouseStockData;
      }

      // Add programmingStockData to the payload if any changes are detected
      if (programmingStockData.length > 0) {
        payload.programmingStockData = programmingStockData;
      }

      // Make the API request if there are changes
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
          setTimeout(() => {
            toast.success("Changes saved successfully!");
          }, 3000);
          setTimeout(() => {
            setModalOpen(false);
            fetchData();
          }, 1000);
        }
      } else {
        setTimeout(() => {
          toast.info("No changes to save.");
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error("An unexpected error occurred. Please try again.");
      }, 3000);
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
              className={`px-7 py-2 rounded-full text-lg font-semibold capitalize ${getStatusClasses(
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
                      <label className="text-base font-medium text-gray-500">
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
                      <label className="text-base font-medium text-gray-500">
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
                      <label className="text-base font-medium text-gray-500">
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
                      <label className="text-base font-medium text-gray-500">
                        Type
                      </label>
                      {userRole === "frontoffice" ? (
                        // Disabling the select field based on conditions
                        <select
                          className="w-full text-base text-gray-900 border border-gray-300 rounded-md p-2"
                          value={editableFields.type}
                          onChange={(e) =>
                            handleInputChange("type", e.target.value)
                          }
                          disabled
                        >
                          <option value="programming">Programming</option>
                          <option value="new">New</option>
                        </select>
                      ) : (
                        // Display the current type value as text (non-editable)
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
                  <div
                    className="bg-white rounded-lg border shadow-lg px-2 py-3 flex-1"
                    style={{
                      backgroundColor:
                        editedStatus === "approved"
                          ? "#3498db" // Blue for approved
                          : editedStatus === "rejected"
                          ? "#e74c3c" // Red for rejected
                          : editedStatus === "complete"
                          ? "#2ecc71" // Green for complete
                          : editedStatus === "pending"
                          ? "#f39c12" // Orange for pending
                          : "#2d3748", // Gray-800 for default
                    }}
                  >
                    <h3 className="text-lg font-semibold text-white ">
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
                            <option value="approved">approved</option>
                            <option value="rejected">Rejected</option>
                          </>
                        ) : (
                          <>
                            <option value="">Select</option>
                            <option value="approved">approved</option>
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

              {isModalOpen && (
                <StockModel
                  handleCloseModal={handleCloseModal}
                  currentRowData={currentRowData}
                  setModalOpen={setModalOpen}
                  fetchData={fetchData}
                />
              )}
              <FrontOfficeBackOfficePDF
                data={currentRowData}
                userRole={userRole}
              />

              {userRole === "backoffice" && (
                <UplaodBackPdf
                  currentRowData={currentRowData}
                  fetchData={fetchData}
                  setModalOpen={setModalOpen}
                />
              )}

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
                      maxLength={245}
                      placeholder="Enter front office notes..."
                    />
                  ) : (
                    <>
                      <p
                        className={`text-base ${
                          currentRowData.front_office_notes
                            ? "text-indigo-500" // Indigo when notes are available
                            : "text-gray-800" // Gray-800 when no notes are available
                        }`}
                      >
                        {truncateText(
                          currentRowData.front_office_notes ||
                            "No front office notes available"
                        )}
                      </p>
                      {currentRowData.front_office_notes &&
                        currentRowData.front_office_notes.length > 30 && (
                          <button
                            onClick={() =>
                              openModal(currentRowData.front_office_notes)
                            }
                            className="text-blue-600 hover:text-blue-800 mt-2"
                          >
                            See More
                          </button>
                        )}
                    </>
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
                      maxLength={245}
                      placeholder="Enter admin notes..."
                    />
                  ) : (
                    <>
                      <p
                        className={`text-base ${
                          currentRowData.admin_notes
                            ? "text-indigo-500" // Indigo when notes are available
                            : "text-gray-800" // Gray-800 when no notes are available
                        }`}
                      >
                        {truncateText(
                          currentRowData.admin_notes ||
                            "No admin notes available"
                        )}
                      </p>
                      {currentRowData.admin_notes &&
                        currentRowData.admin_notes.length > 30 && (
                          <button
                            onClick={() =>
                              openModal(currentRowData.admin_notes)
                            }
                            className="text-blue-600 hover:text-blue-800 mt-2"
                          >
                            See More
                          </button>
                        )}
                    </>
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
                      maxLength={245}
                      placeholder="Enter back office notes..."
                    />
                  ) : (
                    <>
                      <p
                        className={`text-base ${
                          currentRowData.back_office_notes
                            ? "text-indigo-500" // Indigo when notes are available
                            : "text-gray-800" // Gray-800 when no notes are available
                        }`}
                      >
                        {truncateText(
                          currentRowData.back_office_notes ||
                            "No back office notes available"
                        )}
                      </p>
                      {currentRowData.back_office_notes &&
                        currentRowData.back_office_notes.length > 30 && (
                          <button
                            onClick={() =>
                              openModal(currentRowData.back_office_notes)
                            }
                            className="text-blue-600 hover:text-blue-800 mt-2"
                          >
                            See More
                          </button>
                        )}
                    </>
                  )}
                </div>

                {/* Modal to show full notes */}
                {isModalNotesOpen && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-auto">
                      <h3 className="text-lg font-medium text-gray-900">
                        Full Notes
                      </h3>
                      <div className="mt-4 text-base text-gray-700 max-h-60 overflow-y-auto">
                        <p>{modalContent}</p>
                      </div>
                      <button
                        onClick={() => setIsModalNotesOpen(false)}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {currentRowData.type === "programming" ? (
                // Programming Stocks Section
                currentRowData.programming_stocks &&
                currentRowData.programming_stocks.length > 0 ? (
                  <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Programming Stocks
                    </h3>
                    {currentRowData.programming_stocks.map((stock) => (
                      <div
                        key={stock.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4"
                      >
                        {/* Stock Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-md font-semibold text-gray-800">
                              {stock.product_name}
                            </h4>
                            {/* {userRole === "backoffice" && (
                <button
                  onClick={() =>
                    toggleProgrammingStockEdit(stock.id, "product_name")
                  }
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FileEdit className="w-4 h-4" />
                </button>
              )} */}
                          </div>
                          <span className="text-base text-gray-500">
                            Product ID: {stock.product_id}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {/* Serial Number */}
                          <div className="flex justify-between items-center">
                            <span className="text-base text-gray-500">
                              Serial No:
                            </span>
                            <div className="flex items-center gap-2">
                              {editingProgrammingStock[stock.id]?.serial_no &&
                              userRole === "backoffice" ? (
                                <input
                                  type="text"
                                  value={
                                    editableField[stock.id]?.serial_no ||
                                    stock.serial_no
                                  }
                                  onChange={(e) =>
                                    updateProgrammingStockField(
                                      stock.id,
                                      "serial_no",
                                      e.target.value
                                    )
                                  }
                                  className="border border-gray-300 rounded-lg px-3 py-1 text-base"
                                />
                              ) : (
                                <span className="text-base font-medium">
                                  {stock.serial_no}
                                </span>
                              )}
                              {/* {userRole === "backoffice" && (
                  <button
                    onClick={() =>
                      toggleProgrammingStockEdit(stock.id, "serial_no")
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {editingProgrammingStock[stock.id]?.serial_no ? (
                      <AiOutlineCheck className="w-4 h-4" />
                    ) : (
                      <FileEdit className="w-4 h-4" />
                    )}
                  </button>
                )} */}
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-base text-gray-500">
                                Description:
                              </p>
                              {/* {userRole === "backoffice" && (
                                <button
                                  onClick={() =>
                                    toggleProgrammingStockEdit(
                                      stock.id,
                                      "description"
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {editingProgrammingStock[stock.id]
                                    ?.description ? (
                                    <AiOutlineCheck className="w-4 h-4" />
                                  ) : (
                                    <FileEdit className="w-4 h-4" />
                                  )}
                                </button>
                              )} */}
                            </div>
                            {editingProgrammingStock[stock.id]?.description &&
                            userRole === "backoffice" ? (
                              <textarea
                                value={
                                  editableField[stock.id]?.description ||
                                  stock.description
                                }
                                onChange={(e) =>
                                  updateProgrammingStockField(
                                    stock.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                              />
                            ) : (
                              <p className="text-base text-gray-700">
                                {stock.description ||
                                  "No description available"}
                              </p>
                            )}
                          </div>

                          {/* Other Fields */}
                          {["sign_code", "codeplug", "channels", "unit"].map(
                            (field) => (
                              <div
                                key={field}
                                className="flex justify-between items-center"
                              >
                                <span className="text-base text-gray-500 capitalize">
                                  {field.replace("_", " ")}:
                                </span>
                                <div className="flex items-center gap-2">
                                  {editingProgrammingStock[stock.id]?.[field] &&
                                  userRole === "backoffice" ? (
                                    <input
                                      type="text"
                                      value={
                                        editableField[stock.id]?.[field] ||
                                        // Clean codeplug value if editing (remove quotes)
                                        (field === "codeplug"
                                          ? stock[field]?.replace(/^"|"$/g, "") // Removes quotes only from codeplug
                                          : stock[field])
                                      }
                                      onChange={(e) =>
                                        updateProgrammingStockField(
                                          stock.id,
                                          field,
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 rounded-lg px-3 py-1 text-base"
                                    />
                                  ) : (
                                    <span className="text-base font-medium">
                                      {field === "codeplug"
                                        ? stock[field]?.replace(/^"|"$/g, "") // Clean codeplug value before displaying
                                        : stock[field]}
                                    </span>
                                  )}
                                  {userRole === "backoffice" && (
                                    <button
                                      onClick={() =>
                                        toggleProgrammingStockEdit(
                                          stock.id,
                                          field
                                        )
                                      }
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      {editingProgrammingStock[stock.id]?.[
                                        field
                                      ] ? (
                                        <AiOutlineCheck className="w-4 h-4" />
                                      ) : (
                                        <FileEdit className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-6">
                    No programming stocks available.
                  </div>
                )
              ) : // Warehouse Stocks Section
              currentRowData.type === "new" &&
                currentRowData.warehouse_stocks &&
                currentRowData.warehouse_stocks.length > 0 ? (
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Warehouse Stocks
                  </h3>
                  {currentRowData.warehouse_stocks.map((stock) => (
                    <div
                      key={stock.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-md font-semibold text-gray-800">
                            {stock.name} - {stock.model_name}
                          </h4>
                          {/* {userRole === "backoffice" && (
                            <button
                              onClick={() =>
                                toggleWarehouseStockEdit(stock.id, "name")
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FileEdit className="w-4 h-4" />
                            </button>
                          )} */}
                        </div>
                        <span className="text-base text-gray-500">
                          Serial No: {stock.serial_no}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-base text-gray-500">
                            Manufacturer:
                          </span>
                          <div className="flex items-center gap-2">
                            {editingWarehouseStock[stock.id]?.manufacturer ? (
                              <input
                                type="text"
                                value={
                                  editableField[stock.id]?.manufacturer ||
                                  stock.manufacturer
                                }
                                onChange={(e) =>
                                  updateWarehouseStockField(
                                    stock.id,
                                    "manufacturer",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 rounded-lg px-3 py-1 text-base"
                              />
                            ) : (
                              <span className="text-base font-medium">
                                {stock.manufacturer}
                              </span>
                            )}
                            {/* {userRole === "backoffice" && (
                              <button
                                onClick={() =>
                                  toggleWarehouseStockEdit(
                                    stock.id,
                                    "manufacturer"
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {editingWarehouseStock[stock.id]
                                  ?.manufacturer ? (
                                  <AiOutlineCheck className="w-4 h-4" />
                                ) : (
                                  <FileEdit className="w-4 h-4" />
                                )}
                              </button>
                            )} */}
                          </div>
                        </div>
                        {["sign_code", "codeplug", "channels", "unit"].map(
                          (field) => (
                            <div key={field} className="flex justify-between">
                              <span className="text-base text-gray-500 capitalize">
                                {field?.replace("_", " ")}:
                              </span>
                              <div className="flex items-center gap-2">
                                {editingWarehouseStock[stock.id]?.[field] ? (
                                  <input
                                    type="text"
                                    value={
                                      editableField[stock.id]?.[field] ||
                                      // Clean codeplug value if editing (remove quotes)
                                      (field === "codeplug"
                                        ? stock[field]?.replace(/^"|"$/g, "") // Removes quotes only from codeplug
                                        : stock[field])
                                    }
                                    onChange={(e) =>
                                      updateWarehouseStockField(
                                        stock.id,
                                        field,
                                        e.target.value
                                      )
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-1 text-base"
                                  />
                                ) : (
                                  <span className="text-base font-medium">
                                    {field === "codeplug"
                                      ? stock[field]?.replace(/^"|"$/g, "") // Clean codeplug value before displaying
                                      : stock[field]}
                                  </span>
                                )}
                                {userRole === "backoffice" && (
                                  <button
                                    onClick={() =>
                                      toggleWarehouseStockEdit(stock.id, field)
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    {editingWarehouseStock[stock.id]?.[
                                      field
                                    ] ? (
                                      <AiOutlineCheck className="w-4 h-4" />
                                    ) : (
                                      <FileEdit className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => handleDeleteStock(stock.id)}
                          className="text-red-600 hover:text-red-800 text-base font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-6">
                  {/* No warehouse stocks available. */}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
