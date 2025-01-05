import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa"; // Import icons for edit and delete
import InputField from "../InputGroup/InputField";
import { FormProvider, useForm } from "react-hook-form";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { GrmodelNumber, GrOrganization } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import { StatusOption, TypeOptions } from "../dummyData/FormData";
import SelectField from "@/components/SelectField";
import { FileType } from "lucide-react";
import { SiInstatus } from "react-icons/si";
import DeleteConfirmation from "../card/DeleteConfirmation";
import InputSearch from "../InputGroup/InputSearch";
import FileUpload from "../InputGroup/FileUpload";
import { TbFileDescription } from "react-icons/tb";

// Utility function to join class names conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StockTable = ({ columns, data, searchEnabled = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, setValue, control, watch, methods } =
    useForm();
  const selectedStatus = watch("status");
  const selectedType = watch("type");

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  // Function to handle the delete action
  const handleDelete = () => {
    console.log("Item deleted");
    closeModal();
  };

  const parseTime = (time) => {
    const daysAgo = parseInt(time.split(" ")[0], 10);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - daysAgo);
    return currentDate.toISOString().slice(0, 16);
  };

  const handleEditClick = (rowData) => {
    setCurrentRowData(rowData);
    setModalOpen(true);
    setValue("stockName", rowData.stockName);
    setValue("modelNumber", rowData.modelNumber);
    setValue("manufacturer", rowData.manufacturer);
    setValue("serialNumber", rowData.serialNumber);
    setValue("status", rowData.status);
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
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="sticky top-0 z-10 py-4 px-6 text-sm font-semibold tracking-wider text-start capitalize"
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
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={classNames(
                        "border-b border-gray-200",
                        "py-4 px-6  text-sm font-medium text-gray-800 whitespace-nowrap sm:text-base text-start"
                      )}
                    >
                      {column.key === "action" ? (
                        <div className="flex items-center space-x-2 justify-start">
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
                        </div>
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

      {/* Modal for Editing */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-10"
          style={{
            animation: modalOpen
              ? "scaleUp 0.3s ease-out"
              : "scaleDown 0.3s ease-in",
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Details</h2>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                {/* Editable fields */}
                <InputField
                  label="Stock Name"
                  name="stockName"
                  icon={EnvelopeIcon}
                  placeholder="Enter Name"
                  type="text"
                  register={register}
                />
                <InputField
                  label="Model Number"
                  name="modelNumber"
                  icon={GrOrganization}
                  placeholder="Enter Model Number"
                  type="text"
                  register={register}
                />

                <InputField
                  label="Manufacturer"
                  name="manufacturer"
                  register={register}
                  icon={FileType}
                  value={selectedType}
                  options={TypeOptions}
                />
                <InputField
                  label="Serial Number"
                  name="serialNumber"
                  type="text"
                  icon={TbFileDescription}
                  placeholder="Enter Serial Number"
                  register={register}
                />
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="py-2 px-4 bg-gray-600 text-white rounded-md"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 text-white rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTable;
