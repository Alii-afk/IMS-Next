import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa"; // Import icons for edit and delete
import InputField from "../InputGroup/InputField";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { EnvelopeIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { GrmodelNumber, GrOrganization } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import { StatusOption, TypeOptions } from "../dummyData/FormData";
import SelectField from "@/components/SelectField";
import { FileType, HomeIcon } from "lucide-react";
import { SiInstatus } from "react-icons/si";
import DeleteConfirmation from "../card/DeleteConfirmation";
import InputSearch from "../InputGroup/InputSearch";
import FileUpload from "../InputGroup/FileUpload";
import { TbFileDescription } from "react-icons/tb";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/utils/axiosInstance";
import { MdLibraryAdd, MdOutlineNumbers } from "react-icons/md";

// Utility function to join class names conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StockSetup = ({
  columns,
  data,
  searchEnabled = false,
  fetchStockData,
  hideSerialNumberInput = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const methods = useForm({
    defaultValues: {
      stockName: currentRowData?.name || "",
      model_name: currentRowData?.model_name || "",
      manufacturer: currentRowData?.manufacturer || "",
      serialNumber: currentRowData?.serial_no || "",
    },
  });

  const { register, handleSubmit, setValue, control } = methods;

  const [stockOptions, setStockOptions] = useState([]);

  const stockName = useWatch({
    control: methods.control,
    name: "name",
    defaultValue: "",
  });

  // Fetch stock options from the API
  const fetchStatusData = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setStockOptions(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };
  useEffect(() => {
    fetchStatusData();
  }, []);

  useEffect(() => {
    if (stockName) {
      const selectedStock = stockOptions.find(
        (stock) => stock.name === stockName
      );
      if (selectedStock) {
        methods.setValue("model_name", selectedStock.model_name || "");
        methods.setValue("manufacturer", selectedStock.manufacturer || "");
      }
    }
  }, [stockName, stockOptions, methods]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = () => {
    if (!currentRowData?.id) {
      toast.error("Failed to delete item!");
      return;
    }

    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    fetch(`${apiUrl}/api/stock-products/${currentRowData.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Item successfully deleted!");
        fetchStockData();
        closeModal();
      })
      .catch((error) => {
        toast.error("Failed to delete item!");
      });
  };

  const handleEditClick = (rowData) => {
    setCurrentRowData(rowData);
    setModalOpen(true);
    setValue("name", rowData.name);
    setValue("model_name", rowData.model_name);
    setValue("manufacturer", rowData.manufacturer);
    setValue("serialNumber", rowData.serial_no);
    // setValue("status", rowData.status);
  };

  const handleFormSubmit = (data) => {
    // Extract only the required fields from the form data
    const payload = {
      manufacturer: data.manufacturer,
      model_name: data.model_name,
      name: data.name,
      serial_no: data.serialNumber,
    };

    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    fetch(`${apiUrl}/api/stock-products/${currentRowData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Data successfully updated!");
        setModalOpen(false);
        fetchStockData();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to update data!");
      });
  };

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
      <ToastContainer />

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
          {/* Table */}
          <div className="max-h-[600px] overflow-y-auto hide-scrollbar border">
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
                          "py-4 px-6 text-sm font-medium text-gray-800 whitespace-nowrap sm:text-base text-start"
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
                              onClick={() => {
                                setCurrentRowData(row);
                                openModal();
                              }}
                              className="text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-300"
                            >
                              <FaTrash className="w-5 h-5" />
                            </div>
                          </div>
                        ) : column.key === "stock_image" ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_MAP_KEY}/${
                              row[column.key]
                            }`}
                            alt={row.name || "Stock Image"}
                            className="w-20 h-20 object-cover rounded-md"
                          />
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
                onSubmit={methods.handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                {/* Stock Name Input */}
                <InputField
                  label="Stock Name"
                  name="name"
                  icon={MdLibraryAdd}
                  placeholder="Enter Stock Name"
                  {...methods.register("name")}
                  error={methods.formState.errors.name?.message}
                />

                {/* Manufacturer Input */}
                <InputField
                  label="Manufacturer"
                  name="manufacturer"
                  icon={HomeIcon}
                  placeholder="Enter Manufacturer"
                  {...methods.register("manufacturer")}
                  error={methods.formState.errors.manufacturer?.message}
                />

                {/* Model Name Input */}
                <InputField
                  label="Model Name"
                  name="model_name"
                  icon={IdentificationIcon}
                  placeholder="Enter Model Name"
                  {...methods.register("model_name")}
                  error={methods.formState.errors.model_name?.message}
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

export default StockSetup;
