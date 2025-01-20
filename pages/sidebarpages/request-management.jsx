import { useEffect, useState } from "react";
import axios from "axios"; // Optional, if you're using axios
import Sidebar from "@/components/Sidebar";
import Table from "@/components/tables/table";
import { columns } from "@/components/dummyData/FormData";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshAuthToken = async () => {
    try {
      const refreshToken = Cookies.get("authToken"); // Get refresh token from cookies (or localStorage)
      const response = await axios.post(
        `   ${process.env.NEXT_PUBLIC_MAP_KEY}/api/refresh-token`,
        {
          token: refreshToken, // Send expired token to refresh it
        }
      );

      if (response && response.data.token) {
        Cookies.set("authToken", response.data.token, {
          expires: 7, // Set expiration
          path: "/",
          secure: false,
        });
        return response.data.token;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setError("Session expired. Please log in again.");
    }
  };

  const fetchData = async () => {
    try {
      let token = Cookies.get("authToken");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      // Try to fetch data with the existing token
      const response = await axios.get(`${apiUrl}/api/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data); // Store fetched data
    } catch (error) {
      if (error.response && error.response.data.error === "Token has expired") {
        const newToken = await refreshAuthToken();
        if (newToken) {
          await fetchData();
        }
      } else {
        console.error("Error fetching data:", error);
        setError("There was an error fetching the requests.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Component */}
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-72">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Request Management
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-6 py-8">
          <div className="flex-1 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-indigo-100 to-indigo-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2 capitalize">
                  Total Requests
                </h3>
                <p className="text-4xl font-bold text-indigo-600">
                  {requests?.total_requests}
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-orange-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-orange-900 mb-2 capitalize">
                  Pending
                </h3>
                <p className="text-4xl font-bold text-orange-600">
                  {requests?.status_counts?.pending}
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-100 to-red-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-red-900 mb-2 capitalize">
                  Reject
                </h3>
                <p className="text-4xl font-bold text-red-600">
                  {requests?.status_counts?.rejected}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-green-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-green-900 mb-2 capitalize">
                  In Progress
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {requests?.status_counts?.in_progress}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 capitalize">
                  Completed
                </h3>
                <p className="text-4xl font-bold text-blue-600">
                  {requests?.status_counts?.complete}
                </p>
              </div>
            </div>

            <div className="flex md:items-start items-center px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Request Management
              </h1>
            </div>

            <div className="px-6">
              <Table
                columns={columns}
                data={requests.data}
                searchEnabled={true}
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

export default RequestManagement;
