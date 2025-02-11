import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { AiOutlineFilePdf } from "react-icons/ai";
import FileUpload from "@/components/InputGroup/FileUpload";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const UplaodBackPdf = ({ currentRowData, fetchData, setModalOpen }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm();

  const onSubmit = async (data) => {
    // Check if file is selected
    if (!data.back_office_pdf || data.back_office_pdf.length === 0) {
      setTimeout(() => {
        toast.error("No file selected. Please attach a PDF.");
      }, 3000);
      return;
    }

    const file = data.back_office_pdf;

    const formData = new FormData();
    formData.append("request_id", currentRowData.id);
    formData.append("back_office_pdf", file);

    try {
      setIsSubmitting(true);
      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      const response = await fetch(
        `${apiUrl}/api/requests/uploadBackOfficePdf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setTimeout(() => {
          toast.success("File uploaded successfully!");
        }, 3000);
        fetchData();
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        setTimeout(() => {
          toast.error(
            `Failed to upload file. Error: ${
              errorData.message || "Unknown error"
            }`
          );
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error("An unexpected error occurred. Please try again.");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 flex">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full">
          <Controller
            name="back_office_pdf"
            control={methods.control}
            render={({ field }) => (
              <FileUpload
                label="Attach back Office Supporting Document"
                icon={AiOutlineFilePdf}
                onFileChange={(file) => {
                  field.onChange(file);
                }}
              />
            )}
          />

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
  );
};

export default UplaodBackPdf;
