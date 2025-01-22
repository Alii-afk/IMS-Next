import Cookies from "js-cookie";
import { FileEdit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StockModel from "./StockModel";
import FrontOfficeBackOfficePDF from "./frontofficePdf";

const ViewCard = ({
  selectedRow,
  setModalOpen,
  currentRowData,
  userRole,
  onSubmit,
  fetchData,
  setSelectedRow
}) => {
  if (!selectedRow || !currentRowData) return null;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editableFields, setEditableFields] = useState({
    user_name: currentRowData?.user_name || "",
    name: currentRowData?.name || "",
    organization: currentRowData?.organization || "",
    date_time: currentRowData?.date_time || "",
    type: currentRowData?.type || "",
  });

  const [editableField, setEditableField] = useState(
    currentRowData.programming_stocks?.reduce((acc, stock) => {
      acc[stock.id] = { editable: false, description: stock.description };
      return acc;
    }, {}) || {}
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

  const [modalContent, setModalContent] = useState("");
  const [isModalNotesOpen, setIsModalNotesOpen] = useState(false);

  const truncateText = (text, maxLength = 30) => {
    if (text && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  const openModal = (text) => {
    setModalContent(text);
    setIsModalNotesOpen(true);
  };
  const closeModal = () => setSelectedRow(false);

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

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 overflow-y-auto">
        <ToastContainer />
        <div className="bg-gray-50 rounded-lg p-6 max-w-4xl w-full space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-base font-medium text-gray-500">
                  Name
                </label>
                <p className="text-base text-gray-900">
                  {editableFields.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-base font-medium text-gray-500">
                  Organization
                </label>
                <p className="text-base text-gray-900">
                  {editableFields.organization || "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-base font-medium text-gray-500">
                  Date & Time
                </label>
                <p className="text-base text-gray-900">
                  {editableFields.date_time
                    ? new Date(editableFields.date_time).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-base font-medium text-gray-500">
                  Type
                </label>
                <p className="text-base text-gray-900">
                  {editableFields.type || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="flex justify-between gap-6">
            {(userRole === "admin" ||
              userRole === "backoffice" ||
              userRole === "frontoffice") && (
              <div className="bg-white rounded-lg border shadow-md px-4 py-3 w-full md:w-1/2">
                <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                <p
                  className={`px-4 py-2 rounded-full text-xs font-medium capitalize ${getStatusClasses(
                    currentRowData?.request_status
                  )}`}
                >
                  {currentRowData?.request_status?.replace(/_/g, " ") ||
                    "No status available"}
                </p>
              </div>
            )}
            {userRole === "backoffice" && currentRowData?.type === "new" && (
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

          {/* Notes Section */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Front Office Notes */}
            <div className="bg-white rounded-lg border p-6 shadow-base">
              <h3 className="text-lg font-medium text-gray-900">
                Front Office Notes
              </h3>
              {userRole === "frontoffice" && isEditingNotes ? (
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter front office notes..."
                />
              ) : (
                <>
                  <p className="text-base text-gray-700">
                    {truncateText(
                      currentRowData.front_office_notes ||
                        "No front office notes available"
                    )}
                  </p>
                  {currentRowData.front_office_notes &&
                    currentRowData.front_office_notes.length > 100 && (
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
            <div className="bg-white rounded-lg border p-6 shadow-base">
              <h3 className="text-lg font-medium text-gray-900">Admin Notes</h3>
              {userRole === "admin" && isEditingNotes ? (
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter admin notes..."
                />
              ) : (
                <>
                  <p className="text-base text-gray-700">
                    {truncateText(
                      currentRowData.admin_notes || "No admin notes available"
                    )}
                  </p>
                  {currentRowData.admin_notes &&
                    currentRowData.admin_notes.length > 100 && (
                      <button
                        onClick={() => openModal(currentRowData.admin_notes)}
                        className="text-blue-600 hover:text-blue-800 mt-2"
                      >
                        See More
                      </button>
                    )}
                </>
              )}
            </div>

            {/* Back Office Notes */}
            <div className="bg-white rounded-lg border p-6 shadow-base">
              <h3 className="text-lg font-medium text-gray-900">
                Back Office Notes
              </h3>
              {userRole === "backoffice" && isEditingNotes ? (
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter back office notes..."
                />
              ) : (
                <>
                  <p className="text-base text-gray-700">
                    {truncateText(
                      currentRowData.back_office_notes ||
                        "No back office notes available"
                    )}
                  </p>
                  {currentRowData.back_office_notes &&
                    currentRowData.back_office_notes.length > 100 && (
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
          </div>
        <button
          onClick={closeModal}
          className="text-blue-600 hover:text-blue-800 mt-2"
        >
          Close{" "}
        </button>
        </div>
      </div>
    </>
  );
};

export default ViewCard;
