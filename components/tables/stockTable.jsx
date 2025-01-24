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
import axios from "axios";

// Utility function to join class names conditionally
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StockTable = ({
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

  const [serialInputs, setSerialInputs] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [additionalData, setAdditionalData] = useState(null);
  const [selectedStockName, setSelectedStockName] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [serialOptions, setSerialOptions] = useState([]);
  // Fetch data from API

  const fetchStockDatas = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    try {
      const response = await axiosInstance.get(
        `${apiUrl}/api/stock-products/fetchStockNameData`
      );

      const stockData = Array.isArray(response.data)
        ? response.data
        : response.data.data;


      const options = stockData.map((stock) => ({
        label: stock.name,
        value: stock.name,
      }));

      setStockOptions(options);
      setStockData(stockData); // Save the full stock data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("No stock data found matching the criteria.");
      } else {
        console.error("Error fetching stock data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = async (stockName, manufacturer = "") => {
    setSelectedStockName(stockName);
    setSelectedManufacturer(manufacturer);

    try {
      setLoading(true);

      // Build the API request parameters
      let params = { name: stockName };

      // Add manufacturer to params if it's provided
      if (manufacturer) {
        params.manufacturer = manufacturer;
      }

      // Fetch manufacturers based on stock name
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products/fetchStockNameData`,
        { params }
      );

      const stockData = response.data.data || [];

      // Check if stock data is empty
      if (stockData.length === 0) {
        toast.error("No stock data found matching the criteria.");
        return; // Exit early if no data is found
      }

      // Map stock data to extract manufacturer
      const manufacturers = stockData.map((stock) => ({
        label: stock.manufacturer,
        value: stock.manufacturer,
      }));

      // Update manufacturer data
      setAdditionalData(manufacturers);

      // Fetch models if a manufacturer is selected
      const modelsResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products/fetchStockNameData`,
        { params }
      );

      const modelsData = modelsResponse.data.data || [];
      const models = modelsData.map((model) => ({
        label: model.model_name,
        value: model.model_name,
      }));

      // Update model options in state
      setModelOptions(models);

      // If model name is selected, fetch serial number
      if (models.length > 0) {
        const serialResponse = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products/fetchStockNameData`,
          {
            params: {
              name: stockName,
              manufacturer: manufacturer,
              model_name: models[0].value,
            },
          }
        );

        const serialData = serialResponse.data.data || [];
        const serialNumbers = serialData.map((serial) => ({
          label: serial.serial_no,
          value: serial.serial_no,
        }));

        // Update serial number options in state
        setSerialOptions(serialNumbers);
      }
    } catch (error) {
      // Handle AxiosError
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;

        // Custom handling for 404 errors
        if (statusCode === 404) {
          toast.error("No data found for the selected stock or model.");
        } else {
          toast.error(
            "An error occurred while fetching data. Please try again later."
          );
        }
      } else {
        toast.error(
          "An unexpected error occurred. Please check your internet connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockDatas();
    handleStockChange();
  }, []);

  const quantityNumber = useWatch({
    control: methods.control,
    name: "quantityNumber",
    defaultValue: 1,
  });

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
        // Set form values for modelName and manufacturer
        methods.setValue("model_name", selectedStock.model_name || "");
        methods.setValue("manufacturer", selectedStock.manufacturer || "");
      }
    }
  }, [stockName, stockOptions, methods]);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = () => {

    // Ensure that currentRowData and its id are defined before making the API request
    if (!currentRowData?.id) {
      console.error("No ID found for deletion.");
      toast.error("Failed to delete item!"); // Show error if no valid ID
      return;
    }

    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    fetch(`${apiUrl}/api/warehouse-stock/${currentRowData.id}`, {
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
      stock_id: currentRowData.stock_id,
    };


    const token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    // Fetch request to update data
    fetch(`${apiUrl}/api/warehouse-stock/${currentRowData.id}`, {
      method: "PUT", // Assuming the API expects PUT
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Send the payload as a JSON string
    })
      .then(async (response) => {
        if (!response.ok) {
          // If the response is not ok, extract and throw the error message
          const errorData = await response.json();
          throw new Error(
            errorData?.message || "An unknown error occurred during the update."
          );
        }
        return response.json(); 
      })
      .then((data) => {
        toast.success("Data successfully updated!"); 
        setModalOpen(false);
        fetchStockData(); 
      })
      .catch((error) => {
        // Handle and display error
        console.error("Error details:", error.message); 
        toast.error(`Error: ${error.message}`); 
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
                className="block w-full border-2 rounded-md pl-10 pr-4 py-2 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
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
          <div className=" max-h-[600px] overflow-y-auto hide-scrollbar border">
            <table className="min-w-full table-auto border-separate border-spacing-0 shadow-xl rounded-lg overflow-hidden bg-white">
              <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                <tr className="text-center">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="sticky top-0 z-10 py-4 px-6 text-base font-semibold tracking-wider text-start capitalize"
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
                          "py-4 px-6  text-base font-medium text-gray-800 whitespace-nowrap sm:text-base text-start"
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
                                setCurrentRowData(row); // Set the row data before opening the modal
                                openModal(); // Open the delete confirmation modal
                              }}
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
                {/* Select Stock Name */}
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <SelectField
                      label="Stock Name"
                      name="name"
                      icon={MdLibraryAdd}
                      placeholder="Select Stock Name"
                      showIcon={true}
                      options={stockOptions}
                      show={false}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleStockChange(e.target.value);
                      }}
                      error={methods.formState.errors.name?.message}
                    />
                  )}
                />
                <Controller
                  name="manufacturer"
                  control={methods.control}
                  render={({ field }) => (
                    <SelectField
                      label="Manufacturer"
                      name="manufacturer"
                      icon={HomeIcon}
                      showIcon={true}
                      show={false}
                      placeholder="Select Manufacturer"
                      options={additionalData} // Dynamically populated manufacturers
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Fetch models when manufacturer is selected
                        handleStockChange(selectedStockName, e.target.value);
                      }}
                      error={methods.formState.errors.manufacturer?.message}
                    />
                  )}
                />

                <Controller
                  name="model_name"
                  control={methods.control}
                  render={({ field }) => (
                    <SelectField
                      label="Model Name"
                      name="model_name"
                      icon={IdentificationIcon}
                      showIcon={true}
                      show={false}
                      placeholder="Select Model"
                      options={modelOptions}
                      onChange={(e) => {
                        field.onChange(e);
                        // Fetch models when manufacturer is selected
                        handleStockChange(selectedStockName, e.target.value);
                      }}
                      {...field}
                      error={methods.formState.errors.model_name?.message}
                    />
                  )}
                />

                <InputField
                  label="Serial Number"
                  name="serialNumber"
                  icon={MdOutlineNumbers}
                  placeholder="Enter Serial Number"
                  type="text"
                  {...methods.register("serialNumber")}
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
