import React from "react";
import { useForm, FormProvider } from "react-hook-form";
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

const Addstock = () => {
  const methods = useForm({
    resolver: yupResolver(validationSchema), 
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log(data); 
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-white flex">
      {/* Sidebar Component */}
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md" />

      <div className="md:ml-72 lg:ml-0 flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex max-w-7xl mx-auto px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Add Stock</h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex-1 bg-white shadow-sm">
            <div className="flex max-w-7xl mx-auto md:items-start items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">Add Stock</h1>
            </div>

            {/* Form Section */}
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Stock Name */}
                <InputField
                  label="Stock Name"
                  name="stockName"
                  icon={MdLibraryAdd}
                  placeholder="Enter Stock Name"
                  type="text"
                  register={methods.register}
                  error={methods.formState.errors.stockName?.message}

                />

                {/* Model Number */}
                <InputField
                  label="Model Number"
                  name="modelNumber"
                  icon={IdentificationIcon}
                  placeholder="Enter Model Number"
                  type="text"
                  register={methods.register}
                  error={methods.formState.errors.modelNumber?.message}

                />

                {/* Manufacturer */}
                <InputField
                  label="Manufacturer"
                  name="manufacturer"
                  icon={HomeIcon}
                  placeholder="Enter Manufacturer"
                  type="text"
                  register={methods.register}
                  error={methods.formState.errors.manufacturer?.message}

                />

                {/* Serial Number */}
                <InputField
                  label="Serial Number"
                  name="serialNumber"
                  icon={HashtagIcon}
                  placeholder="Enter Serial Number"
                  type="text"
                  register={methods.register}
                  error={methods.formState.errors.serialNumber?.message}

                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
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
