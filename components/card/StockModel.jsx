import { useEffect, useState } from "react";
import { MdLibraryAdd, MdOutlineNumbers } from "react-icons/md";
import {
  GrCertificate,
  GrTechnology,
  GrChannels,
  GrCube,
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

const StockModel = ({ userRole, currentRowData, handleCloseModal }) => {
  console.log(currentRowData.id);
  const [serialInputs, setSerialInputs] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modelOptions, setModelOptions] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [serialOptions, setSerialOptions] = useState([]);
  const [selectedStockName, setSelectedStockName] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState([]);

  console.log(serialOptions);

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

    try {
      const response = await axiosInstance.get(
        `${apiUrl}/api/warehouse-stock/fetch`
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
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  // This function will be called when the stock name is selected
  const handleStockChange = async (
    index,
    stockName,
    manufacturer = "",
    serial_no = "" // Ensure this parameter is passed correctly
  ) => {
    console.log("serial_no:", serial_no); // Verify if it's passed correctly

    // Initialize arrays if empty
    setSelectedStockName((prev) => {
      const updated = [...(prev || [])];
      updated[index] = stockName;
      return updated;
    });

    setSelectedManufacturer((prev) => {
      const updated = [...(prev || [])];
      updated[index] = manufacturer;
      return updated;
    });

    try {
      setLoading(true);

      // Log the request URL and parameters
      console.log(
        "Request URL:",
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/warehouse-stock/fetch`
      );
      console.log("Params:", { name: stockName, serial_no: serial_no });

      // Make sure serial_no is included in the first API call
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/warehouse-stock/fetch`,
        {
          params: { name: stockName, serial_no: serial_no }, // Send serial_no in request
        }
      );

      const stockData = response.data.data || [];

      const manufacturers = stockData.map((stock) => ({
        label: stock.manufacturer,
        value: stock.manufacturer,
      }));

      setAdditionalData((prev) => {
        const updated = [...(prev || [])];
        updated[index] = manufacturers;
        return updated;
      });

      if (manufacturer) {
        // Send serial_no in the second request as well
        const modelsResponse = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_MAP_KEY}/api/warehouse-stock/fetch`,
          {
            params: { name: stockName, manufacturer, serial_no: serial_no }, // Send serial_no in request
          }
        );

        const modelsData = modelsResponse.data.data || [];

        const models = modelsData.map((model) => ({
          label: model.model_name,
          value: model.model_name,
        }));

        setModelOptions((prev) => {
          const updated = [...(prev || [])];
          updated[index] = models;
          return updated;
        });

        if (models.length > 0) {
          // Send serial_no in the third request as well
          const serialResponse = await axiosInstance.get(
            `${process.env.NEXT_PUBLIC_MAP_KEY}/api/warehouse-stock/fetch`,
            {
              params: {
                name: stockName,
                manufacturer,
                model_name: models[0].value,
                serial_no: serial_no, // Send serial_no in request
              },
            }
          );

          const serialData = serialResponse.data.data || [];

          const serialNumbers = serialData.map((serial) => ({
            label: serial.serial_no,
            value: serial.serial_no,
            id: serial.id,
          }));

          setSerialOptions((prev) => {
            const updated = [...(prev || [])];
            updated[index] = serialNumbers;
            return updated;
          });
        }
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

    serialInputs.forEach((_, index) => {
      const selectedSerialNo = data[`serial_no${index}`];

      // Find the stock item matching the selected serial number
      const matchedStock = serialOptions[index]?.find(
        (item) => item.value === selectedSerialNo
      );

      const deviceData = {
        name: data[`name${index}`],
        sign_code: data[`signCode${index}`],
        codeplug: data[`codeplug${index}`],
        channels: data[`channels${index}`],
        unit: data[`unit${index}`],
        serial_no: selectedSerialNo, // Send as a simple value
        model_name: data[`model_name${index}`],
        manufacturer: data[`manufacturer${index}`],
        id: matchedStock ? matchedStock.id : null, // Include the ID
      };

      devices.push(deviceData);
    });

    const submissionData = {
      devices,
      request_Id:currentRowData.id
    };

    console.log("submissionData", submissionData);
  };

  return (
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
                    name={`name${index}`}
                    control={methods.control}
                    render={({ field }) => (
                      <SelectField
                        label="Stock Name"
                        name={`name${index}`}
                        icon={MdLibraryAdd}
                        placeholder="Select Stock Name"
                        showIcon={true}
                        options={stockOptions}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleStockChange(index, e.target.value); // Pass index here
                        }}
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
                        onChange={(e) => {
                          field.onChange(e);
                          handleStockChange(
                            index,
                            selectedStockName[index],
                            e.target.value
                          ); // Pass index & stock name
                        }}
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
                        onChange={(e) => {
                          field.onChange(e);
                          handleStockChange(
                            index,
                            selectedStockName[index],
                            selectedManufacturer[index]
                          );
                        }}
                        error={
                          methods.formState.errors[`model_name${index}`]
                            ?.message
                        }
                      />
                    )}
                  />

                  <Controller
                    name={`serial_no${index}`}
                    control={methods.control}
                    render={({ field }) => (
                      <SelectField
                        label="Serial Number"
                        name={`serial_no${index}`}
                        icon={MdLibraryAdd}
                        placeholder="Select Serial Number"
                        showIcon={true}
                        options={serialOptions[index] || []} // Use index-specific options
                        {...field}
                        onChange={(e) => {
                          field.onChange(e); // Update react-hook-form field value
                          const selectedSerialNo =
                            e?.target?.value || field.value; // Get the selected serial_no value

                          // Call handleStockChange with the updated serial_no value
                          handleStockChange(
                            index,
                            selectedStockName[index],
                            selectedManufacturer[index],
                            selectedSerialNo // Pass serial_no here
                          );
                        }}
                        error={
                          methods.formState.errors[`serial_no${index}`]?.message
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
                        icon={GrChannels}
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
  );
};

export default StockModel;
