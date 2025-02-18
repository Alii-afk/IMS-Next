import { stockmanagementdata } from "@/components/dummyData/FormData";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const StockTable = dynamic(() => import("@/components/tables/stockTable"), {
  ssr: false,
});

const Stockmanagement = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusData, setStatusData] = useState({});
  const router = useRouter();

  // Fetch the status data from your API
  const fetchStatusData = async () => {
    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    try {
      const response = await axios.get(`${apiUrl}/api/warehouse-stock/ratios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatusData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setTimeout(() => {
            toast.error("Unauthorized. Please log in again.");
          }, 3000);
        } else if (error.response?.status === 404) {
          setTimeout(() => {
            toast.error("Ratios not found.");
          }, 3000);
        } else {
          setTimeout(() => {
            toast.error("Failed to fetch Stock Ratios.");
          }, 3000);
        }
      } else {
        setTimeout(() => {
          toast.error("An unexpected error occurred.");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, []);

  // Fetch data from API
  const fetchStockData = async () => {
    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    try {
      const response = await axios.get(`${apiUrl}/api/warehouse-stock`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the response data is an array, you can set it to the state
      setStockData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setTimeout(() => {
            toast.error("Unauthorized. Please log in again.");
          }, 3000);

          router.push("/");
        } else if (error.response?.status === 404) {
          setTimeout(() => {
            toast.error("Requests not found.");
          }, 3000);
        } else {
          setTimeout(() => {
            toast.error("Failed to fetch Stock.");
          }, 3000);
        }
      } else {
        setTimeout(() => {
          toast.error("No data Found");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };
  // Fetch data when the component mounts
  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <div className="min-h-screen  bg-white flex">
      <ToastContainer />

      {/* Sidebar Component */}
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-72">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex  px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Stock Management
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className=" px-6 py-8">
          <div className="flex-1 bg-white shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {/* Total Stock Card */}
              <div className="bg-indigo-50 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                <h3 className="text-xl font-semibold text-indigo-900 mb-3">
                  Total Stock
                </h3>
                <p className="text-5xl font-bold text-indigo-600">
                  {statusData.total_stock}
                </p>
              </div>

              {/* On Field Card */}
              <div className="bg-orange-50 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                <h3 className="text-xl font-semibold text-orange-900 mb-3">
                  On Field
                </h3>
                <p className="text-5xl font-bold text-orange-600">
                  {statusData?.status_counts?.on_field}
                </p>
              </div>

              {/* In House Card */}
              <div className="bg-green-50 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                <h3 className="text-xl font-semibold text-green-900 mb-3">
                  In Warehouse
                </h3>
                <p className="text-5xl font-bold text-green-600">
                  {statusData?.status_counts?.in_house}
                </p>
              </div>
            </div>

            <div className="flex  md:items-start items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">
                Stock Management
              </h1>
            </div>
            <div className="px-6">
              <StockTable
                columns={stockmanagementdata}
                data={stockData}
                searchEnabled={true}
                fetchStockData={fetchStockData}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative">
            <ClipLoader color="#ffffff" loading={loading} size={50} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Stockmanagement;
