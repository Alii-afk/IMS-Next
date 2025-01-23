import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Sidebar from "@/components/Sidebar";
import InputField from "@/components/InputGroup/InputField";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { GrOrganization } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import SelectField from "@/components/SelectField";
import {
  people,
  peoples,
  TypeOption,
  TypeOptions,
} from "@/components/dummyData/FormData";
import InputSearch from "@/components/InputGroup/InputSearch";
import { FileType } from "lucide-react";
import { MdNumbers } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { AiOutlineFilePdf } from "react-icons/ai";
import FileUpload from "@/components/InputGroup/FileUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import addValidationSchema from "@/components/validation/AddValidationSchema";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import DateInputField from "@/components/InputGroup/DateInput";

const AddRequestForm = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [serialInputs, setSerialInputs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stockOptions, setStockOptions] = useState([]);

  const router = useRouter();

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

  // get all list
  useEffect(() => {
    const fetchStockData = async () => {
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
        setStockOptions(data); // Adjust based on the actual structure
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStockData();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true); // Start the submission process

    try {
      // Extract serial numbers from the form data
      const serialNumbers = Object.keys(data)
        .filter((key) => key.startsWith("serialNumber") && data[key] !== "")
        .map((key) => data[key]);

      const duplicates = serialNumbers.filter(
          (item, index) => serialNumbers.indexOf(item) !== index
        );
    
        if (duplicates.length > 0) {
          toast.error(`Duplicate serial numbers found: ${duplicates.join(", ")}`);
          return; 
        }


      // Prepare the request payload as raw JSON
      const requestPayload = {
        name: data.name,
        organization: data.organization,
        date_time: data.date_time,
        type: data.type.toLowerCase(),
        front_office_notes: data.front_office_notes || "",
        front_office_pdf:
          data.front_office_pdf instanceof File ? data.front_office_pdf : "",

        // If type is programming, include programming stock data
        programmingStockData:
          data.type.toLowerCase() === "programming"
            ? [
                {
                  product_name: data.product_name,
                  serial_no: serialNumbers,
                  product_id: data.product_id || "",
                  description: data.description || "",
                },
              ]
            : [],
      };

      // Get the API URL and auth token
      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      // Make the API request with raw JSON
      const response = await axios({
        method: "post",
        url: `${apiUrl}/api/requests`,
        data: requestPayload, // Send as raw JSON
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Set to application/json
        },
      });

      if (response.status === 201) {
        toast.success("Request submitted successfully");
        methods.reset();
        setShowModal(false);
        router.push("/sidebarpages/request-management"); // Redirect to the desired page
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false); // Reset the submitting state after the request completes
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <Sidebar className="min-h-screen fixed bg-white shadow-md hidden md:block" />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72">
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

              <DateInputField
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
                register={methods.register}
                showIcon={true}
                show={false}
                options={TypeOptions}
                error={methods.formState.errors.type?.message}
              />

              {selectedValue === "programming" && (
                <InputField
                  label="Product Name (Compulsory)"
                  name="product_name"
                  type="text"
                  icon={FileType}
                  placeholder="Enter Product Name"
                  register={methods.register}
                  // error={methods.formState.errors.id?.message}
                />
              )}

              {selectedValue === "programming" && (
                <InputField
                  label="ID (Optional)"
                  name="product_id"
                  type="text"
                  icon={MdNumbers}
                  placeholder="Enter ID"
                  register={methods.register}
                  // error={methods.formState.errors.id?.message}
                />
              )}

              {selectedValue === "programming" && (
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
              {selectedValue === "programming" && (
                <InputField
                  label="Enter the Quantity Number"
                  name="quantityNumber"
                  icon={MdNumbers}
                  defaultValue={1}
                  placeholder="Enter Quantity Number"
                  type="number"
                  {...methods.register("quantityNumber")}
                />
              )}

              {serialInputs.length > 0 && selectedValue === "programming" && (
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
              <Controller
                name="front_office_notes"
                control={methods.control}
                render={({ field }) => (
                  <InputField
                    label="Enter the Notes"
                    name="front_office_notes"
                    icon={TbFileDescription}
                    placeholder="Enter Notes "
                    type="text"
                    {...field}
                  />
                )}
              />

              <Controller
                name="front_office_pdf"
                control={methods.control}
                render={({ field }) => (
                  <FileUpload
                    label="Attach Front Office Supporting Document"
                    icon={AiOutlineFilePdf}
                    onFileChange={(file) => field.onChange(file)}
                    // error={methods.formState.errors.pdfUpload?.message}
                  />
                )}
              />

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 
                    ${
                      isSubmitting
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
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
