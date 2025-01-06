import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Sidebar from "@/components/Sidebar";
import InputField from "@/components/InputGroup/InputField";
import {
  HashtagIcon,
  HomeIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { MdLibraryAdd } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "@/components/validation/validationSchema ";
import SelectField from "@/components/SelectField";
import { stockNames} from "@/components/dummyData/FormData";

const Addstock = () => {
  const [serialInputs, setSerialInputs] = useState([]);
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const quantityNumber = methods.watch("quantityNumber");

  useEffect(() => {
    const quantity = parseInt(quantityNumber) || 0;
    const newInputs = Array.from({ length: quantity }, (_, index) => ({
      id: `serialNumber${index + 1}`,
      value: "",
    }));
    setSerialInputs(newInputs);
  }, [quantityNumber]);

  // Handle form submission
  const onSubmit = (data) => {
    // Filter out empty serial numbers
    const serialNumbers = Object.keys(data)
      .filter((key) => key.startsWith("serialNumber") && data[key] !== "")
      .map((key) => data[key]);

    // Create cleaned submission data
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
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                

                {/* Manually register SelectField */}
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
                      {...field} // Spread the field properties from react-hook-form
                      error={methods.formState.errors.stockName?.message}
                    />
                  )}
                />

                <InputField
                  label="Model Number"
                  name="modelNumber"
                  icon={IdentificationIcon}
                  placeholder="Enter Model Number"
                  type="text"
                  register={methods.register}
                  error={methods.formState.errors.modelNumber?.message}
                />

                <InputField
                  label="Manufacturer"
                  name="manufacturer"
                  icon={HomeIcon}
                  placeholder="Enter Manufacturer"
                  type="text"
                  register={methods.register}
                  error={methods.formState.errors.manufacturer?.message}
                />

                <InputField
                  label="Enter the Quantity Number"
                  name="quantityNumber"
                  icon={HashtagIcon}
                  defaultValue={1}
                  placeholder="Enter Quantity Number"
                  type="number"
                  register={methods.register}
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
                        <InputField
                          key={input.id}
                          label={`Serial Number ${index + 1}`}
                          name={input.id}
                          icon={HashtagIcon}
                          placeholder={`Enter Serial Number ${index + 1}`}
                          type="text"
                          register={methods.register}
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
