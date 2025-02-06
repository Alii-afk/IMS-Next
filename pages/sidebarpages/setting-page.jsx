import React, { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Sidebar from "@/components/Sidebar";
import InputField from "@/components/InputGroup/InputField";
import { HomeIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { stockmanagement } from "@/components/dummyData/FormData";
import dynamic from "next/dynamic";
import ImageUpload from "@/components/InputGroup/ImageUplaod";
import { useRouter } from "next/router";
const StockSetup = dynamic(() => import("@/components/tables/StockSetup"), {
  ssr: false,
});

const Setting = () => {
  const [stockOptions, setStockOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();
  const fetchStockData = async () => {
    setLoading(true); // Show loader
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
      setStockOptions(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Unauthorized. Please log in again.");
          router.push("/");
        } else if (error.response?.status === 404) {
          toast.error("Requests not found.");
        } else {
          toast.error("Failed to fetch pending requests.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const methods = useForm();
  const [imageKey, setImageKey] = useState(Date.now()); // Unique key to force re-render
  const onSubmit = async (data) => {
    let token = Cookies.get("authToken");

    if (!token) {
      toast.error("You are not authorized. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("model_name", data.model_name);
    formData.append("manufacturer", data.manufacturer);

    if (imageFile) {
      if (imageFile.size > 2 * 1024 * 1024) {
        // 2MB in bytes
        const toastId = toast.error(
          "The selected image exceeds the maximum size of 2MB."
        );
        setTimeout(() => toast.dismiss(toastId), 3000);
        return; // Stop form submission
      }
      formData.append("stock_image", imageFile);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Do NOT include 'Content-Type' here
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      toast.success("Stock added successfully!");
      setTimeout(() => {
        fetchStockData();
      }, 1000);
      methods.reset();
      setImageFile(null);
      setImageKey(Date.now()); // Update key to reset ImageUpload component
    } catch (error) {
      toast.error(error.message || "Failed to add stock. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-72">
        <div className="bg-white shadow-sm">
          <div className="flex  px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Add Stock Name</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex-1 bg-white shadow-sm rounded-lg p-6">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Field */}
                <Controller
                  name="name"
                  control={methods.control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Name"
                      icon={IdentificationIcon}
                      placeholder="Enter Name"
                      type="text"
                    />
                  )}
                />
                {/* Model Name Field */}
                <Controller
                  name="model_name"
                  control={methods.control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Model Name"
                      icon={IdentificationIcon}
                      placeholder="Enter Model Name"
                      type="text"
                    />
                  )}
                />
                {/* Manufacturer Field */}
                <Controller
                  name="manufacturer"
                  control={methods.control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Manufacturer"
                      icon={HomeIcon}
                      placeholder="Enter Manufacturer"
                      type="text"
                    />
                  )}
                />
                {/* Image Upload */}
                <ImageUpload
                  key={imageKey}
                  label="Upload Product Image"
                  name="stock_image"
                  onImageChange={(file) => setImageFile(file)}
                  // error={imageFile ? "" : "Please upload an image"}
                />

                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Submit
                </button>
              </form>
            </FormProvider>
          </div>
          <div className="px-6">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <ClipLoader color="#3498db" size={50} />
              </div>
            ) : stockOptions && stockOptions.length > 0 ? (
              <StockSetup
                columns={stockmanagement}
                data={stockOptions}
                searchEnabled={false}
                fetchStockData={fetchStockData}
                hideSerialNumberInput={true}
              />
            ) : (
              <p>No stock data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default Setting;
