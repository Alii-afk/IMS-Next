import React, { useState, useEffect } from "react";
import { FaDownload, FaEdit, FaSearch, FaTrash } from "react-icons/fa"; // Import icons for edit and delete
import InputField from "../InputGroup/InputField";
import { FormProvider, useForm } from "react-hook-form";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { GrOrganization } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import { StatusOption, TypeOptions } from "../dummyData/FormData";
import SelectField from "@/components/SelectField";
import { FileType } from "lucide-react";
import { SiInstatus } from "react-icons/si";
import DeleteConfirmation from "../card/DeleteConfirmation";
import InputSearch from "../InputGroup/InputSearch";
import FileUpload from "../InputGroup/FileUpload";
import { TbFileDescription } from "react-icons/tb";
import Cookies from "js-cookie";
import {
  GrInventory,
  GrKey,
  GrCertificate,
  GrTechnology,
  GrChannels,
  GrCube,
} from "react-icons/gr"; // Import icons for the new fields
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import EditDetailsModal from "../card/EditDetailsModal";
// Utility function to join class names conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Table = ({
  columns,
  data,
  searchEnabled = false,
  showDownload = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [completed, setCompleted] = useState(false);

  console.log("data", data);

  const { register, handleSubmit, setValue, control, watch, methods } =
    useForm();
  const selectedStatus = watch("request_status");
  const selectedType = watch("type");

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const userRole = Cookies.get("role");

  const updatedColumns = columns.map((column) => {
    if (column.key === "notes") {
      if (userRole === "admin") {
        return { ...column, name: "Admin Notes" };
      } else if (userRole === "backoffice") {
        return { ...column, name: "Backoffice Notes" };
      } else if (userRole === "frontoffice") {
        return { ...column, name: "Front Office Notes" };
      }
    }
    return column;
  });

  const label =
    userRole === "admin"
      ? "Admin Notes"
      : userRole === "frontoffice"
      ? "Frontend Office Notes"
      : "Backoffice Notes";

  const handleDelete = () => {
    console.log("Item deleted");
    closeModal();
  };

  const parseTime = (time) => {
    if (!time) {
      // Return a default or an empty value if time is not provided
      return "Invalid Time";
    }

    const daysAgo = parseInt(time.split(" ")[0], 10);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - daysAgo);

    return currentDate.toISOString().slice(0, 16);
  };

  const handleEditClick = (rowData) => {
    setCurrentRowData(rowData);
    setModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    console.log("Updated data:", data);
    setModalOpen(false);
  };

  // Filter data based on search term
  const filteredData = data.filter((row) =>
    columns.some((column) =>
      row[column.key]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const handleDownload = () => {
    const columnsToExport = [
      "name",
      "organization",
      "type",
      "time",
      "notes",
      "status",
    ];

    const csvData = filteredData.map((row) =>
      columnsToExport.map((column) => row[column] || "")
    );

    const headerRow = columnsToExport
      .map((col) => col.charAt(0).toUpperCase() + col.slice(1))
      .join(",");

    const csvContent = [headerRow, ...csvData.map((row) => row.join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "table_data.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 flow-root z-10">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle px-4">
          {/* Search Input */}
          {searchEnabled && (
            <div className="relative flex rounded-md shadow-lg bg-white outline-1 outline-gray-300 max-w-sm mb-6">
              <input
                type="text"
                className="block w-full border-2 rounded-md pl-10 pr-4 py-2 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Search Icon */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Table */}
          <table className="min-w-full table-auto border-separate border-spacing-0 shadow-xl rounded-lg overflow-hidden bg-white">
            <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
              <tr className="text-center">
                {updatedColumns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="sticky top-0 z-10 py-4 px-6 text-sm font-semibold tracking-wider text-start capitalize whitespace-nowrap"
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-indigo-50 transition-all duration-200 ease-in-out"
                >
                  {updatedColumns.map((column) => (
                    <td
                      key={column.key}
                      className={classNames(
                        "border-b border-gray-200",
                        "py-4 px-6 text-sm font-medium text-gray-800 whitespace-nowrap sm:text-base text-start"
                      )}
                    >
                      {column.key === "action" ? (
                        <div className="flex items-center space-x-2 justify-center">
                          {!showDownload && (
                            <>
                              <div
                                onClick={() => handleEditClick(row)}
                                className="text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors duration-300"
                              >
                                <FaEdit className="w-5 h-5" />
                              </div>
                              <div
                                onClick={openModal}
                                className="text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-300"
                              >
                                <FaTrash className="w-5 h-5" />
                              </div>
                            </>
                          )}
                          {showDownload && (
                            <div
                              onClick={handleDownload}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-300"
                            >
                              <FaDownload className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      ) : column.key === "notes" ? (
                        <span>
                          {userRole === "admin"
                            ? row?.admin_notes !== null &&
                              row?.admin_notes !== undefined
                              ? row.admin_notes
                              : "Not Found Notes"
                            : userRole === "frontoffice"
                            ? row?.front_office_notes !== null &&
                              row?.front_office_notes !== "undefined"
                              ? row.front_office_notes
                              : "Not Found Notes"
                            : row?.back_office_notes !== null &&
                              row?.back_office_notes !== "undefined"
                            ? row.back_office_notes
                            : "Not Found Notes"}
                        </span>
                      ) : // For other columns
                      row[column.key] !== undefined &&
                        row[column.key] !== null ? (
                        row[column.key]
                      ) : (
                        "Not Found Notes"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-10"
          style={{
            animation: isModalOpen
              ? "scaleUp 0.3s ease-out"
              : "scaleDown 0.3s ease-in",
          }}
        >
          <div className="">
            <DeleteConfirmation
              handleDelete={handleDelete}
              closeModal={closeModal}
            />
          </div>
        </div>
      )}

      {/* // Modal for editing */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-10"
          style={{
            animation: modalOpen
              ? "scaleUp 0.3s ease-out"
              : "scaleDown 0.3s ease-in",
          }}
        >
          <EditDetailsModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            currentRowData={currentRowData}
            userRole={userRole}
            // onSubmit={onSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Table;

// <FormProvider {...methods}>
// <form
//   onSubmit={handleSubmit(handleFormSubmit)}
//   className="space-y-4"
// >
//   {/* Editable fields */}
//   <InputField
//     label="Name"
//     name="name"
//     icon={EnvelopeIcon}
//     placeholder="Enter Name"
//     type="text"
//     register={register}
//     disabled={userRole === "frontoffice"}
//   />
//   <InputField
//     label="Organization"
//     name="organization"
//     icon={GrOrganization}
//     placeholder="Enter Organization"
//     type="text"
//     register={register}
//     disabled={userRole === "frontoffice"}
//   />
//   <InputField
//     label="Date & Time"
//     name="date_time"
//     icon={CiCalendarDate}
//     type="datetime-local"
//     register={register}
//     disabled={userRole === "frontoffice"}
//   />

//   <SelectField
//     label="Select the Type"
//     name="type"
//     register={register}
//     icon={FileType}
//     value={selectedType}
//     options={TypeOptions}
//     disabled={userRole === "frontoffice" || userRole === "admin"}
//   />

//   <InputField
//     label={label}
//     name="notes"
//     icon={TbFileDescription}
//     placeholder="Enter Notes"
//     type="text"
//     register={register}
//     disabled={userRole === "frontoffice"}
//   />

//   {/* Status field with dynamic options */}
//   <SelectField
//     label="Status"
//     name="request_status"
//     icon={SiInstatus}
//     options={
//       userRole === "admin"
//         ? StatusOption.filter(
//             (option) =>
//               option.value === "in_progress" ||
//               option.value === "rejected"
//           )
//         : userRole === "backoffice"
//         ? StatusOption.filter(
//             (option) => option.value === "completed"
//           )
//         : []
//     }
//     register={register}
//     value={selectedStatus}
//     disabled={userRole === "frontoffice"}
//   />

//   {selectedType === "New" && (
//     <>
//       <InputField
//         label="Quantity"
//         name="quantity"
//         icon={MdOutlineProductionQuantityLimits}
//         placeholder="Enter Quantity"
//         type="number"
//         register={register}
//       />
//       <InputField
//         label="Serial Number"
//         name="serial_number"
//         icon={GrKey}
//         placeholder="Enter Serial Number"
//         type="text"
//         register={register}
//       />
//       <InputField
//         label="Sign Code"
//         name="sign_code"
//         icon={GrCertificate}
//         placeholder="Enter Sign Code"
//         type="text"
//         register={register}
//       />
//       <InputField
//         label="Codeplug"
//         name="codeplug"
//         icon={GrTechnology}
//         placeholder="Enter Codeplug"
//         type="text"
//         register={register}
//       />
//       <InputField
//         label="Channels"
//         name="channels"
//         icon={GrChannels}
//         placeholder="Enter Channels"
//         type="text"
//         register={register}
//       />
//       <InputField
//         label="Unit"
//         name="unit"
//         icon={GrCube}
//         placeholder="Enter Unit"
//         type="text"
//         register={register}
//       />
//     </>
//   )}

//   <div className="flex gap-4 justify-end">
//     <button
//       type="button"
//       onClick={() => setModalOpen(false)}
//       className="py-2 px-4 bg-gray-600 text-white rounded-md"
//     >
//       Close
//     </button>
//     <button
//       type="submit"
//       className="py-2 px-4 bg-blue-600 text-white rounded-md"
//       disabled={userRole === "frontoffice"} // Disable submit for frontoffice
//     >
//       Save Changes
//     </button>
//   </div>
// </form>
// </FormProvider>
