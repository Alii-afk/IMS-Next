import { useEffect, useState } from "react";
import { MdLibraryAdd, MdOutlineNumbers } from "react-icons/md";
import {
  GrCertificate,
  GrTechnology,
  GrChannels,
  GrCube,
  GrChannel,
} from "react-icons/gr";
import InputField from "../InputGroup/InputField";
import { Controller, useForm, useWatch, FormProvider } from "react-hook-form";
import SelectField from "../SelectField";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { AiOutlineClose } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StockModel = ({
  userRole,
  currentRowData,
  handleCloseModal,
  setModalOpen,
  fetchData,
}) => {
  const [serialInputs, setSerialInputs] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modelOptions, setModelOptions] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [serialOptions, setSerialOptions] = useState([]);
  const [selectedStockName, setSelectedStockName] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState([]);
  const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);
  const [stockDataName, setStockDataName] = useState([]);

  const methods = useForm();

  const stockName = useWatch({
    control: methods.control,
    name: "name", // Adjusted to reflect stock name properly
    defaultValue: "",
  });

  const quantityNumber = useWatch({
    control: methods.control,
    name: "quantityNumber",
    defaultValue: 1,
  });

  // Fetch data from API
  const fetchStockData = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;
    let token = Cookies.get("authToken");

    try {
      const response = await axios.get(
        `${apiUrl}/api/warehouse-stock/fetch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stockData = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      const options = stockData.map((stock) => ({
        label: `${stock.serial_no} ( ${stock.name} - ${stock.manufacturer}  - ${stock.model_name} )`,
        value: stock.serial_no,
      }));

      setStockOptions(options);
      setStockData(stockData); // Save the full stock data
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = async (
    index,
    stockName = "",
    manufacturer = "",
    serialNo = ""
  ) => {
    try {
      setLoading(true);
      let token = Cookies.get("authToken");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/warehouse-stock/fetch`,
        {
          params: {
            serial_no: serialNo,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stockData = response.data.data || [];

      // Find the exact match for the serial number
      const selectedStock =
        stockData.find((stock) => stock.serial_no === serialNo) || stockData[0];

      if (selectedStock) {
        // Update form values
        methods.setValue(`name${index}`, selectedStock.name);
        methods.setValue(`manufacturer${index}`, selectedStock.manufacturer);
        methods.setValue(`model_name${index}`, selectedStock.model_name);

        // Prepare options for dropdowns
        const stockNames = [
          {
            label: selectedStock.name,
            value: selectedStock.name,
          },
        ];

        const manufacturers = [
          {
            label: selectedStock.manufacturer,
            value: selectedStock.manufacturer,
          },
        ];

        const models = [
          {
            label: selectedStock.model_name,
            value: selectedStock.model_name,
          },
        ];

        const serialNumbers = [
          {
            label: serialNo,
            value: serialNo,
            id: selectedStock.id,
          },
        ];

        // Update state for each dropdown
        setStockDataName((prev) => {
          const updated = [...(prev || [])];
          updated[index] = stockNames;
          return updated;
        });

        setSelectedStockName((prev) => {
          const updated = [...(prev || [])];
          updated[index] = selectedStock.name;
          return updated;
        });

        setSelectedManufacturer((prev) => {
          const updated = [...(prev || [])];
          updated[index] = selectedStock.manufacturer;
          return updated;
        });

        setAdditionalData((prev) => {
          const updated = [...(prev || [])];
          updated[index] = manufacturers;
          return updated;
        });

        setModelOptions((prev) => {
          const updated = [...(prev || [])];
          updated[index] = models;
          return updated;
        });

        setSerialOptions((prev) => {
          const updated = [...(prev || [])];
          updated[index] = serialNumbers;
          return updated;
        });
        setSelectedSerialNumbers((prev) => {
          const updated = [...prev];
          updated[index] = serialNo; // Update the serial number for the specific device
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  // Ensure stockData is always an array
  useEffect(() => {
    if (!Array.isArray(stockData)) {
      console.error("stockData is not an array:", stockData);
      return;
    }

    // Ensure that serialInputs is not empty and stockData is valid
    serialInputs.forEach((_, index) => {
      const stockName = methods.getValues(`name${index}`);
      if (!stockName) return; // If stockName is undefined or empty, skip this iteration

      const selectedStock = stockData.find((stock) => stock.name === stockName);

      if (selectedStock) {
        methods.setValue(`model_name${index}`, selectedStock.model_name || "");
        methods.setValue(
          `manufacturer${index}`,
          selectedStock.manufacturer || ""
        );
      }
    });
  }, [stockData, methods, serialInputs]);

  const { handleSubmit, control, register } = methods;

  useEffect(() => {
    const quantity = parseInt(quantityNumber) || 1;
    const newInputs = Array.from({ length: quantity }, (_, index) => ({
      id: `serialNumber${index + 1}`,
      value: "",
    }));
    setSerialInputs(newInputs);
  }, [quantityNumber]);

  // ✅ Handle form submission

  const onSubmit = async (data) => {
    const devices = [];

    // Iterating through each serial input and collecting data for each device
    serialInputs.forEach((_, index) => {
      const selectedSerialNo = data[`serial_no${index}`];

      // Find the stock item matching the selected serial number
      const matchedStock = serialOptions[index]?.find(
        (item) => item.value === selectedSerialNo
      );

      // Construct the device data object
      const deviceData = {
        name: data[`name${index}`],
        sign_code: data[`signCode${index}`],
        codeplug: data[`codeplug${index}`],
        channels: data[`channels${index}`],
        unit: data[`unit${index}`],
        serial_no: selectedSerialNo, // Send as a simple value
        model_name: data[`model_name${index}`],
        manufacturer: data[`manufacturer${index}`],
        id: matchedStock ? matchedStock.id : null,
      };

      // Add deviceData only if serial_no and name are valid (adjust conditions as needed)
      if (deviceData.serial_no && deviceData.name) {
        devices.push(deviceData);
      }
    });

    // Prevent submission if devices array is empty
    if (devices.length === 0) {
      toast.error("No valid devices to update. Please check your inputs.");
      return;
    }

    const payload = {
      devices,
      request_id: currentRowData.id,
    };

    // Send the data to the API
    try {
      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY; // Ensure the correct API URL here

      const response = await fetch(
        `${apiUrl}/api/warehouse-stock/updateStock`,
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
        await response.json();
        toast.success("Changes saved successfully!"); // Show success toast
        setTimeout(() => {
          setModalOpen(false); // Close the modal after a 1 second delay
          fetchData(); // Fetch the updated data
        }, 1000); // 1-second delay before executing the above actions
      } else {
        toast.error("Failed to update stock. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Show error toast
      toast.error("Failed to update stock. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-5xl shadow-lg relative max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">Add New Stock</h2>
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className=" right-2 text-gray-500 hover:text-red-700 text-xl"
            >
              <AiOutlineClose className="" />
            </button>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Quantity Number Input */}
              <InputField
                label="Enter the Quantity Number"
                name="quantityNumber"
                icon={MdOutlineNumbers}
                defaultValue={1}
                placeholder="Enter Quantity Number"
                type="number"
                {...register("quantityNumber")}
              />

              {/* Dynamic Device Inputs */}
              <div
                className={`gap-4 mt-4 ${
                  serialInputs.length > 1 ? "grid grid-cols-2" : "block"
                }`}
              >
                {serialInputs.map((input, index) => (
                  <div
                    key={`deviceGroup${index}`}
                    className="border border-gray-300 p-4 rounded-md shadow-md space-y-4"
                  >
                    <h4 className="font-semibold text-gray-600">
                      Device {index + 1}
                    </h4>

                    <Controller
                      name={`serial_no${index}`}
                      control={methods.control}
                      render={({ field }) => {
                        const filteredOptions = stockOptions.filter(
                          (option) =>
                            !selectedSerialNumbers.includes(option.value) ||
                            option.value === field.value
                        );

                        return (
                          <SelectField
                            label="Serial Number"
                            name={`serial_no${index}`}
                            icon={MdLibraryAdd}
                            placeholder="Select Serial Number"
                            showIcon={true}
                            show={true}
                            options={filteredOptions} // Pass filtered options here
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const selectedSerialNo =
                                e?.target?.value || field.value;

                              // Call handleStockChange with the updated serial_no value
                              handleStockChange(
                                index,
                                selectedStockName[index],
                                selectedManufacturer[index],
                                selectedSerialNo
                              );
                            }}
                            error={
                              methods.formState.errors[`serial_no${index}`]
                                ?.message
                            }
                          />
                        );
                      }}
                    />

                    <Controller
                      name={`name${index}`}
                      control={methods.control}
                      render={({ field }) => (
                        <SelectField
                          label="Stock Name"
                          name={`name${index}`}
                          icon={MdLibraryAdd}
                          placeholder="Select Stock Name"
                          showIcon={true}
                          options={stockDataName?.[index] || []}
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleStockChange(
                          //     index,
                          //     stockDataName,
                          //     e.target.value
                          //   ); // Pass index & stock name
                          // }}
                          error={
                            methods.formState.errors[`name${index}`]?.message
                          }
                        />
                      )}
                    />

                    <Controller
                      name={`manufacturer${index}`}
                      control={methods.control}
                      render={({ field }) => (
                        <SelectField
                          label="Manufacturer"
                          name={`manufacturer${index}`}
                          icon={MdLibraryAdd}
                          placeholder="Select Manufacturer"
                          showIcon={true}
                          options={additionalData?.[index] || []}
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleStockChange(
                          //     index,
                          //     selectedStockName[index],
                          //     e.target.value
                          //   ); // Pass index & stock name
                          // }}
                          error={
                            methods.formState.errors[`manufacturer${index}`]
                              ?.message
                          }
                        />
                      )}
                    />

                    <Controller
                      name={`model_name${index}`}
                      control={methods.control}
                      render={({ field }) => (
                        <SelectField
                          label="Model Name"
                          name={`model_name${index}`}
                          icon={MdLibraryAdd}
                          placeholder="Select Model Name"
                          showIcon={true}
                          options={modelOptions[index] || []} // Use index-specific options
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleStockChange(
                          //     index,
                          //     selectedStockName[index],
                          //     selectedManufacturer[index]
                          //   );
                          // }}
                          error={
                            methods.formState.errors[`model_name${index}`]
                              ?.message
                          }
                        />
                      )}
                    />

                    {/* Sign Code */}
                    <Controller
                      name={`signCode${index}`} // Make sure this name is dynamic and matches with onSubmit
                      control={methods.control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          label="Sign Code"
                          placeholder={`Enter Sign Code ${index + 1}`}
                          icon={GrCertificate}
                          type="text"
                        />
                      )}
                    />

                    {/* Codeplug */}
                    <Controller
                      name={`codeplug${index}`}
                      control={methods.control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          label="Codeplug"
                          placeholder={`Enter Codeplug ${index + 1}`}
                          icon={GrTechnology}
                          type="text"
                        />
                      )}
                    />

                    {/* Channels */}
                    <Controller
                      name={`channels${index}`}
                      control={methods.control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          label="Channels"
                          placeholder={`Enter Channels ${index + 1}`}
                          icon={GrChannel}
                          type="text"
                        />
                      )}
                    />

                    {/* Unit */}
                    <Controller
                      name={`unit${index}`}
                      control={methods.control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          label="Unit"
                          placeholder={`Enter Unit ${index + 1}`}
                          icon={GrCube}
                          type="text"
                        />
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-md px-4 py-2 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-4 py-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default StockModel;
