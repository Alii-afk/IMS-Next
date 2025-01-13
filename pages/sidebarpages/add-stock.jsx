import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller, useWatch } from "react-hook-form";
import Sidebar from "@/components/Sidebar";
import InputField from "@/components/InputGroup/InputField";
import {
  HashtagIcon,
  HomeIcon,
  IdentificationIcon,
  MdNumbers,
} from "@heroicons/react/24/outline";
import { MdLibraryAdd } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectField from "@/components/SelectField";
import { stockNames } from "@/components/dummyData/FormData";
import axios from "axios";
import validationSchema from "@/components/validation/validationSchema ";
import Cookies from "js-cookie";

const Addstock = () => {
  const [serialInputs, setSerialInputs] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const quantityNumber = useWatch({ control: methods.control, name: "quantityNumber", defaultValue: 1 });

  const stockName = useWatch({
    control: methods.control,
    name: "name",
    defaultValue: "",
  });

  // Fetch stock options from the API
  useEffect(() => {
    const fetchStockData = async () => {
      const token = Cookies.get("authToken");
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/stock-products",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setStockOptions(data); // Adjust based on the actual structure
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStockData();
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
      id: `serialNumber${index + 1}`,
      value: "",
    }));
    setSerialInputs(newInputs);
  }, [quantityNumber]);

  // Handle form submission
  const onSubmit = async (data) => {
    const serial_no = Object.keys(data)
      .filter((key) => key.startsWith("serialNumber") && data[key] && data[key] !== null && data[key] !== "")
      .map((key) => data[key]);
  
    const submissionData = {
      name: data.name,
      model_name: data.model_name,
      manufacturer: data.manufacturer, 
      quantity_no: data.quantityNumber,
      serial_no,
    };
    const token = Cookies.get("authToken");
  
    // Submit data to the warehouse stock API
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/warehouse-stock",
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Stock successfully added:", response.data);
    } catch (error) {
      console.error("Error submitting stock data:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-white flex">
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
                {/* Select stock name */}
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
                      options={
                        Array.isArray(stockOptions)
                          ? stockOptions.map((stock) => ({
                              label: stock.name,
                              value: stock.name,
                            }))
                          : []
                      }
                      {...field}
                      error={methods.formState.errors.stockName?.message}
                    />
                  )}
                />

                {/* Model Name and Manufacturer as controlled inputs */}
                <Controller
                  name="model_name"
                  control={methods.control}
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Model Name"
                      icon={IdentificationIcon}
                      placeholder="Model Number"
                      type="text"
                    />
                  )}
                />

                <Controller
                  name="manufacturer"
                  control={methods.control}
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Manufacturer"
                      icon={HomeIcon}
                      placeholder="Manufacturer"
                      type="text"
                    />
                  )}
                />

                {/* Quantity Number Input */}
                <InputField
                  label="Enter the Quantity Number"
                  name="quantityNumber"
                  icon={MdNumbers}
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
                          name={input.id} // Ensure unique and correct name for each input
                          control={methods.control}
                          render={({ field }) => (
                            <InputField
                              {...field}
                              label={`Serial no ${index + 1}`} // Customize the label
                              placeholder={`Enter Serial Number ${index + 1}`}
                              icon={MdNumbers}
                              type="text"
                            />
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}

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
