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
const StockSetup = dynamic(() => import("@/components/tables/StockSetup"), { 
  ssr: false 
});

const Setting = () => {
  const [stockOptions, setStockOptions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false); // Hide loader after data is fetched
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const methods = useForm();

  const onSubmit = async (data) => {
    let token = Cookies.get("authToken");

    if (!token) {
      toast.error("You are not authorized. Please log in.");
      return;
    }

    const submissionData = {
      name: data.name,
      model_name: data.model_name,
      manufacturer: data.manufacturer,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MAP_KEY}/api/stock-products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      toast.success("Stock added successfully!");
      fetchStockData();
      methods.reset();
    } catch (error) {
      toast.error(error.message || "Failed to add stock. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-72">
        <div className="bg-white shadow-sm">
          <div className="flex max-w-7xl mx-auto px-6 md:items-start items-center py-4">
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
                searchEnabled={true}
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
