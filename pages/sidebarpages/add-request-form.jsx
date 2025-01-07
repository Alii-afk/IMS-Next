import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Sidebar from "@/components/Sidebar";
import InputField from "@/components/InputGroup/InputField";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { GrOrganization } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import SelectField from "@/components/SelectField";
import { people, TypeOptions } from "@/components/dummyData/FormData";
import InputSearch from "@/components/InputGroup/InputSearch";
import { FileType } from "lucide-react";
import { MdNumbers } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { AiOutlineFilePdf } from "react-icons/ai";
import FileUpload from "@/components/InputGroup/FileUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import addValidationSchema from "@/components/validation/AddValidationSchema";

const AddRequestForm = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [serialInputs, setSerialInputs] = useState([]);

  const methods = useForm({
    resolver: yupResolver(addValidationSchema),
  });

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const quantityNumber = methods.watch("quantityNumber");

  useEffect(() => {
    const quantity = parseInt(quantityNumber) || 0;
    const newInputs = Array.from({ length: quantity }, (_, index) => ({
      id: `serialNumber${index + 1}`,
      value: "",
    }));
    setSerialInputs(newInputs);
  }, [quantityNumber]);

  const onSubmit = (data) => {
    // Filter out empty serial numbers
    const serialNumbers = Object.keys(data)
      .filter((key) => key.startsWith("serialNumber") && data[key] !== "")
      .map((key) => data[key]);

    // Create cleaned submission data
    const submissionData = {
      name: data.name,
      organization: data.organization,
      date_time: data.date_time,
      quantityNumber: data.quantityNumber,
      serialNumbers,
      type: data.type,
      notes: data.notes,
      productList: data.productList,
      serialNo: data.serialNo,
      id: data.id,
      description: data.description,
      pdfUpload: data.pdfUpload,
    };

    console.log("Cleaned submission data:", submissionData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <Sidebar className="min-h-screen fixed bg-white shadow-md hidden md:block" />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 ml-32">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex max-w-7xl mx-auto px-6 py-4 md:items-start items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Add Request Form
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-900">
              Add New Task Request
            </h1>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <InputField
                label="Name"
                name="name"
                icon={EnvelopeIcon}
                placeholder="Enter Name"
                type="text"
                register={methods.register}
                error={methods.formState.errors.name?.message}
              />

              <InputField
                label="Organization"
                name="organization"
                placeholder="Enter Organization"
                type="text"
                icon={GrOrganization}
                register={methods.register}
                error={methods.formState.errors.organization?.message}
              />

              <InputField
                label="Date & Time"
                name="date_time"
                type="datetime-local"
                icon={CiCalendarDate}
                placeholder="Enter Date & Time"
                register={methods.register}
                error={methods.formState.errors.date_time?.message}
              />

              {/* Manually register SelectField */}
              <SelectField
                label="Select the Type"
                name="type"
                value={selectedValue}
                onChange={handleSelectChange}
                icon={FileType}
                showIcon={true}
                options={TypeOptions}
                error={methods.formState.errors.type?.message}
              />

              {selectedValue === "Programming" && (
                <InputField
                  label="Enter the Quantity Number"
                  name="quantityNumber"
                  icon={MdNumbers}
                  defaultValue={1}
                  placeholder="Enter Quantity Number"
                  type="number"
                  register={methods.register}
                />
              )}

              {serialInputs.length > 0 && selectedValue === "Programming" && (
                <div className="space-y-4">
                  <div
                    className={`grid gap-4 ${
                      serialInputs.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {serialInputs.map((input, index) => (
                      <InputField
                        key={input.id}
                        label={`Serial Number ${index + 1}`}
                        name={input.id}
                        icon={MdNumbers}
                        placeholder={`Enter Serial Number ${index + 1}`}
                        type="text"
                        register={methods.register}
                      />
                    ))}
                  </div>
                </div>
              )}

              <InputField
                label="Notes"
                name="notes"
                type="text"
                icon={TbFileDescription}
                placeholder="Enter Notes"
                register={methods.register}
                error={methods.formState.errors.notes?.message}
              />

              {selectedValue === "Programming" && (
                <InputSearch
                  options={people}
                  label="Product List"
                  enableSearch={true}
                  register={methods.register}
                  error={methods.formState.errors.productList?.message}
                />
              )}

              {/* {selectedValue === "Programming" && (
                <InputField
                  label="Serial No (Compulsory)"
                  name="serialNo"
                  type="number"
                  icon={MdNumbers}
                  placeholder="Serial Number"
                  register={methods.register}
                  error={methods.formState.errors.serialNo?.message}
                />
              )} */}

              {selectedValue === "Programming" && (
                <InputField
                  label="ID (Optional)"
                  name="id"
                  type="text"
                  icon={MdNumbers}
                  placeholder="Enter ID"
                  register={methods.register}
                  error={methods.formState.errors.id?.message}
                />
              )}

              {selectedValue === "Programming" && (
                <InputField
                  label="Description (Optional)"
                  name="description"
                  type="text"
                  icon={TbFileDescription}
                  placeholder="Enter Description"
                  register={methods.register}
                  error={methods.formState.errors.description?.message}
                />
              )}

              <Controller
                name="pdfUpload"
                control={methods.control}
                render={({ field }) => (
                  <FileUpload
                    label="Attach Front Office Supporting Document"
                    icon={AiOutlineFilePdf}
                    onFileChange={(file) => field.onChange(file)}
                    error={methods.formState.errors.pdfUpload?.message}
                  />
                )}
              />

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default AddRequestForm;
