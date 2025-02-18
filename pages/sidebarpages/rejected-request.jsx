import { columns } from "@/components/dummyData/FormData";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Pagination from "@/components/pagination";
const Table = dynamic(() => import("@/components/tables/table"), {
  ssr: false,
});

const RejectedRequest = () => {
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const router = useRouter();

  const fetchData = async (page) => {
    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    try {
      const response = await axios.get(`${apiUrl}/api/requests`, {
        params: { request_status: "rejected", per_page: perPage, page: page },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRejectedRequests(response.data);
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
            toast.error("Failed to fetch rejected requests.");
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
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white flex">
      <ToastContainer />

      {/* Sidebar Component */}
      <Sidebar className="w-64  min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:flex" />

      <div className="flex-1 md:ml-72">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex  px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Rejected Requests
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className=" px-6 py-8">
          <div className="flex-1 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-red-100 to-red-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-red-900 mb-2 capitalize">
                  Reject
                </h3>
                <p className="text-4xl font-bold text-red-600">
                  {rejectedRequests?.total}
                </p>
              </div>
            </div>
            <div className="flex md:items-start items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">
                Rejected Requests
              </h1>
            </div>
            <div className="px-6 py-8 flex flex-col">
              {/* Other Components */}

              {rejectedRequests?.data && rejectedRequests.data.length > 0 ? (
                <>
                  <div className="px-6">
                    <Table
                      columns={columns}
                      data={rejectedRequests?.data}
                      searchEnabled={true}
                      fetchData={fetchData}
                    />
                  </div>
                  {rejectedRequests?.data.length > 10 && (
                    <div className="bg-white shadow-sm">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(
                          rejectedRequests?.total / perPage
                        )}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div>No data available</div>
              )}
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

export default RejectedRequest;
