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
import validationSchema from "@/components/validation/validationSchema ";

const Addstock = () => {
  const [serialInputs, setSerialInputs] = useState([]);
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const quantityNumber = useWatch({ control: methods.control, name: "quantityNumber", defaultValue: 1 });

  useEffect(() => {
    const quantity = parseInt(quantityNumber) || 1; 
    const newInputs = Array.from({ length: quantity }, (_, index) => ({
      id: `serialNumber${index + 1}`,
      value: "",
    }));
    setSerialInputs(newInputs); 
  }, [quantityNumber]); 

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form submitted with data:", data); 
    const serialNumbers = Object.keys(data)
      .filter((key) => key.startsWith("serialNumber") && data[key] !== "")
      .map((key) => data[key]);
  
    const submissionData = {
      stockName: data.stockName,
      modelNumber: data.modelNumber,
      manufacturer: data.manufacturer,
      quantityNumber: data.quantityNumber,
      serialNumbers,
    };
  
    console.log("Cleaned submission data:", submissionData); 
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
            <div className="flex max-w-7xl mx-auto md:items-start items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">Add Stock</h1>
            </div>

            <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Select stock name */}
                <Controller
                  name="stockName"
                  control={methods.control}
                  render={({ field }) => (
                    <SelectField
                      label="Stock Name"
                      name="stockName"
                      icon={MdLibraryAdd}
                      placeholder="Enter Stock Name"
                      showIcon={true}
                      options={stockNames}
                      {...field} 
                      error={methods.formState.errors.stockName?.message}
                    />
                  )}
                />

                {/* Model Number and Manufacturer fields */}
                <InputField
                  label="Model Number"
                  name="modelNumber"
                  icon={IdentificationIcon}
                  placeholder="Enter Model Number"
                  type="text"
                  error={methods.formState.errors.modelNumber?.message}
                />

                <InputField
                  label="Manufacturer"
                  name="manufacturer"
                  icon={HomeIcon}
                  placeholder="Enter Manufacturer"
                  type="text"
                  error={methods.formState.errors.manufacturer?.message}
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
                        serialInputs.length === 1 ? "grid-cols-1" : "grid-cols-2"
                      }`}
                    >
                      {serialInputs.map((input, index) => (
                        <Controller
                          key={input.id}
                          name={input.id}
                          control={methods.control}
                          render={({ field }) => (
                            <InputField
                              {...field}
                              label={`Serial no ${index + 1}`}
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
