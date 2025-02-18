import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller, useWatch } from "react-hook-form";
import Sidebar from "@/components/Sidebar";
import InputField from "@/components/InputGroup/InputField";
import { HomeIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { MdLibraryAdd, MdOutlineNumbers } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectField from "@/components/SelectField";

import axios from "axios";
import validationSchema from "@/components/validation/validationSchema ";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";
const Addstock = () => {
  const [serialInputs, setSerialInputs] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [additionalData, setAdditionalData] = useState(null);
  const [selectedStockName, setSelectedStockName] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [serialOptions, setSerialOptions] = useState([]);
  const [selectedStockId, setSelectedStockId] = useState(null); // Track selected stock id

  const router = useRouter();

  const fetchStockData = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;
    let token = Cookies.get("authToken");

    try {
      const response = await axios.get(
        `${apiUrl}/api/stock-products/fetchStockNameData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stockData = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (stockData.length === 0) {
        setTimeout(() => {
          toast.error("No Default Stock Name Found. Setup Stock First.");
        }, 3000);

        setStockOptions([]);
        setStockData([]);
      } else {
        const options = stockData.map((stock) => ({
          label: stock.name,
          value: stock.name,
        }));

        setStockOptions(options);
        setStockData(stockData);
        // toast.success("Stock data retrieved successfully.");
      }
    } catch (error) {
      // Handle errors (401, 404, etc.)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setTimeout(() => {
            toast.error("Unauthorized. Please log in again.");
          }, 3000);
          router.push("/"); // Redirect to login page
        } else if (error.response?.status === 404) {
          setTimeout(() => {
            toast.error("Name Data not found.");
          }, 3000);
        } else {
          setTimeout(() => {
            toast.error("Failed to fetch Name Data.");
          }, 3000);
        }
      } else {
        setTimeout(() => {
          toast.error("An unexpected error occurred.");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStockData();
  }, []);

  const handleStockChange = async (stockName, manufacturer = "") => {
    setSelectedStockName(stockName);
    setSelectedManufacturer(manufacturer);
    let token = Cookies.get("authToken");

    try {
      setLoading(true);

      // Fetch manufacturers based on stock name
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products/fetchStockNameData`,

        {
          params: { name: stockName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stockData = response.data.data || [];

      // if (stockData.length === 0) {
      //   toast.error("No Default Stock Name Found. Setup Stock First.");
      //   setAdditionalData([]);
      //   setModelOptions([]);
      //   setSerialOptions([]);
      //   return;
      // }

      // Map stock data to extract manufacturer
      const manufacturers = stockData.map((stock) => ({
        label: stock.manufacturer,
        value: stock.manufacturer,
        id: stock.id,
      }));

      // Update manufacturer data
      setAdditionalData(manufacturers);

      // If manufacturer is selected, fetch model data
      if (manufacturer) {
        const modelsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products/fetchStockNameData`,
          {
            params: { name: stockName, manufacturer: manufacturer },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
          const serialResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products/fetchStockNameData`,
            {
              params: {
                name: stockName,
                manufacturer: manufacturer,
                model_name: models[0].value,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const serialData = serialResponse.data.data || [];
          const serialNumbers = serialData.map((serial) => ({
            label: serial.serial_no,
            value: serial.serial_no,
            id: serial.id, // Include id
          }));

          // Update serial number options in state
          setSerialOptions(serialNumbers);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if the error is a 404
        if (error.response && error.response.status === 404) {
          setTimeout(() => {
            toast.error("No stock data found matching the criteria.");
          }, 3000);
        } else {
        }
      } else {
        setTimeout(() => {
          toast.error("An unexpected error occurred.");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    handleStockChange();
  }, []);
  // Fetch data when the component mounts
  // useEffect(() => {
  // }, []);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

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
    } catch (error) {}
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

  // Handle quantity change and dynamically update serial inputs
  useEffect(() => {
    const quantity = parseInt(quantityNumber) || 1;
    const newInputs = Array.from({ length: quantity }, (_, index) => ({
      id: `${index + 1}`,
      value: "",
    }));
    setSerialInputs(newInputs);
  }, [quantityNumber]);

  // Handle form submission
  const onSubmit = async (data) => {
    const serial_no = Object.keys(data)
      .filter((key) => key.startsWith("serial_") && data[key])
      .map((key) => data[key]);

    const duplicates = serial_no.filter(
      (item, index) => serial_no.indexOf(item) !== index
    );

    if (duplicates.length > 0) {
      setTimeout(() => {
        toast.error(`Duplicate serial numbers found: ${duplicates.join(", ")}`);
      }, 3000);

      return;
    }

    const submissionData = {
      name: data.name,
      model_name: data.model_name,
      manufacturer: data.manufacturer,
      serial_no,
      stock_id: additionalData?.[0]?.id,
    };

    const token = Cookies.get("authToken");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/warehouse-stock`,
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTimeout(() => {
        toast.success("Stock successfully added!");
      }, 3000);

      methods.reset();
      setSerialInputs([]);
      setSerialOptions([]);
      setSelectedStockName([]);
      setSelectedManufacturer([]);
      location.reload();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message ===
          "Some serial numbers already exist in the database."
      ) {
        const existingSerials = error.response.data.existing_serial_no || [];
        setTimeout(() => {
          toast.error(
            `Error: Some serial numbers already exist in the database: ${existingSerials.join(
              ", "
            )}`
          );
        }, 3000);
      } else {
        // Generic error handling
        setTimeout(() => {
          toast.error("Error submitting stock data.");
        }, 3000);
      }

      // Optionally log the error for debugging purposes
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <ToastContainer />

      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />
      <div className="flex-1 md:ml-72">
        <div className="bg-white shadow-sm">
          <div className="flex max-w-7xl mx-auto px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Add Stock</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex-1 bg-white shadow-sm rounded-lg p-6">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
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
                      show={false}
                      options={stockOptions}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleStockChange(e.target.value); // Call handler on stock selection
                      }}
                      error={methods.formState.errors.name?.message}
                    />
                  )}
                />

                {/* Select Manufacturer */}
                <Controller
                  name="manufacturer"
                  control={methods.control}
                  render={({ field }) => (
                    <SelectField
                      label="Manufacturer"
                      name="manufacturer"
                      icon={HomeIcon}
                      placeholder="Select Manufacturer"
                      options={additionalData}
                      showIcon={true}
                      show={false}
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

                {/* Select Model Name */}
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
                      options={modelOptions} // Dynamically populated models
                      {...field}
                      error={methods.formState.errors.model_name?.message}
                    />
                  )}
                />

                {/* Quantity Input */}
                <InputField
                  label="Enter the Quantity Number"
                  name="quantityNumber"
                  icon={MdOutlineNumbers}
                  defaultValue={1}
                  placeholder="Enter Quantity Number"
                  type="number"
                  {...methods.register("quantityNumber")}
                />

                {/* Dynamic Serial Number Inputs */}
                {serialInputs.length > 0 && (
                  <div className="space-y-4">
                    <div
                      className={`grid gap-4 ${
                        serialInputs.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-2"
                      }`}
                    >
                      {serialInputs.map((input, index) => (
                        <Controller
                          key={input.id}
                          name={`serial_${input.id}`} // Ensure each serial input has a unique name
                          control={methods.control}
                          render={({ field }) => (
                            <InputField
                              {...field}
                              label={`Serial no ${index + 1}`} // Customize label for each serial number
                              placeholder={`Enter Serial Number ${index + 1}`}
                              icon={MdOutlineNumbers}
                              type="text"
                            />
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Submit
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addstock;
