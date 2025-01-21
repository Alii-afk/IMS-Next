import { columns, peoples } from "@/components/dummyData/FormData";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/tables/table";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const AcceptedRequest = () => {
  const [InprogressRequests, setInprogressRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    try {
      const response = await axios.get(`${apiUrl}/api/requests`, {
        params: { request_status: "in_progress" },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInprogressRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="min-h-screen  bg-white flex">
      {/* Sidebar Component */}
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-72">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex  px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Approved Requests
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className=" px-6 py-8">
          <div className="flex-1 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-100 to-green-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-green-900 mb-2 capitalize">
                  Approved
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {InprogressRequests?.total_requests}
                </p>
              </div>
            </div>
            <div className="flex  md:items-start items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">
                Approved Requests
              </h1>
            </div>
            <div className="px-6">
              <Table
                columns={columns}
                data={InprogressRequests?.data}
                fetchData={fetchData}
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

export default AcceptedRequest;
