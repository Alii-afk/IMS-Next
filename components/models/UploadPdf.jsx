import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { AiOutlineFilePdf } from "react-icons/ai";
import FileUpload from "@/components/InputGroup/FileUpload";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const UplaodBackPdf = ({ currentRowData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm();

  const onSubmit = async (data) => {
    // Check if file is selected
    if (!data.back_office_pdf || data.back_office_pdf.length === 0) {
      toast.error("No file selected. Please attach a PDF.");
      return;
    }

    const file = data.back_office_pdf;

    const formData = new FormData();
    formData.append("request_id", currentRowData.id);
    formData.append("back_office_pdf", file); 

    // Log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      setIsSubmitting(true);
      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      console.log("API URL:", apiUrl);
      console.log("Token:", token);

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
      } else {
        const errorData = await response.json();
        toast.error(`Failed to upload file. Error: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      toast.error("An unexpected error occurred. Please try again.");
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
                  console.log("File selected:", file); // Log the file selected
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
                ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
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
