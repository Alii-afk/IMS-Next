import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { AiOutlineFilePdf } from "react-icons/ai";
import FileUpload from "@/components/InputGroup/FileUpload";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const FrontOfficePdf = ({ currentRowData, fetchData, setFrontOfficePDF }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm();

  const onSubmit = async (data) => {
    if (!data.front_office_pdf || data.front_office_pdf.length === 0) {
      toast.error("No file selected. Please attach a PDF.");
      return;
    }

    const file = data.front_office_pdf;
    const formData = new FormData();
    formData.append("request_id", currentRowData.id);
    formData.append("front_office_pdf", file);

    try {
      setIsSubmitting(true);
      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      const response = await fetch(`${apiUrl}/api/requests/uploadBackOfficePdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("File uploaded successfully!");
        fetchData();
        setFrontOfficePDF(false);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to upload file. Error: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Upload Supporting Document
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please attach the required PDF document to proceed.
        </p>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="front_office_pdf"
              control={methods.control}
              render={({ field }) => (
                <FileUpload
                  label="Attach Front Office Supporting Document"
                  icon={AiOutlineFilePdf}
                  onFileChange={(file) => field.onChange(file)}
                />
              )}
            />

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setFrontOfficePDF(false)}
                className="py-2 px-4 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md transition duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-6 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default FrontOfficePdf;
