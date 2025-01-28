import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { AiOutlineFilePdf } from "react-icons/ai";
import { FiAlertTriangle } from "react-icons/fi";
import FileUpload from "@/components/InputGroup/FileUpload";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const FrontOfficePdf = ({ currentRowData, fetchData, setFrontOfficePDF }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const methods = useForm();

  // Cleanup function to dismiss all toasts when component unmounts
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const handleConfirmSubmit = async () => {
    if (!selectedFile) {
      toast.error("No file selected. Please attach a PDF.", {
        toastId: 'pdf-error', // Prevent duplicate toasts
        autoClose: 3000
      });
      return;
    }

    const formData = new FormData();
    formData.append("request_id", currentRowData.id);
    formData.append("final_pdf", selectedFile);

    try {
      setIsSubmitting(true);
      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      const response = await fetch(`${apiUrl}/api/requests/uploadFinalPdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Clear any existing toasts
        toast.dismiss();
        
        // Show success toast with specific configuration
        toast.success("File uploaded successfully!", {
          toastId: 'upload-success',
          autoClose: 3000,
          onClose: () => {
            fetchData();
            setFrontOfficePDF(false);
          }
        });
        
        // Wait for toast animation before closing
        setTimeout(() => {
          setIsSubmitting(false);
          setShowConfirmation(false);
        }, 1000);
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to upload file. Error: ${errorData.message || "Unknown error"}`,
          {
            toastId: 'upload-error',
            autoClose: 3000
          }
        );
        setIsSubmitting(false);
        setShowConfirmation(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        toastId: 'unexpected-error',
        autoClose: 3000
      });
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const onSubmit = (data) => {
    if (!data.file_pdf || data.file_pdf.length === 0) {
      toast.error("No file selected. Please attach a PDF.", {
        toastId: 'file-required',
        autoClose: 3000
      });
      return;
    }
    setSelectedFile(data.file_pdf);
    setShowConfirmation(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 space-y-6 relative">
        {/* Rest of your component JSX remains the same */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-start">
          Upload Signature Document
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-start">
          Please attach the required PDF document to proceed.
        </p>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="file_pdf"
              control={methods.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Attach Front Office Signature Documents
                  </label>
                  <FileUpload
                    icon={AiOutlineFilePdf}
                    onFileChange={(file) => field.onChange(file)}
                    className="border border-gray-300 rounded-lg p-3 w-full"
                  />
                </div>
              )}
            />

            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => setFrontOfficePDF(false)}
                className="py-2 px-6 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-6 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ${
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

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="flex items-center justify-center mb-4 text-yellow-500">
                <FiAlertTriangle size={48} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Confirm Submission
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Please note that once submitted, this file cannot be edited or deleted.
                Are you sure you want to proceed?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ${
                    isSubmitting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Yes, Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontOfficePdf;