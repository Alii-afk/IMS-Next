import { useEffect, useState } from "react";
import axios from "axios"; // Optional, if you're using axios
import Sidebar from "@/components/Sidebar";
import Table from "@/components/tables/table";
import { columns } from "@/components/dummyData/FormData";
import Cookies from "js-cookie";

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(requests);

  const refreshAuthToken = async () => {
    try {
      const refreshToken = Cookies.get("authToken"); // Get refresh token from cookies (or localStorage)
      const response = await axios.post(
        "http://127.0.0.1:8000/api/refresh-token",
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

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      let token = Cookies.get("authToken"); // Fetch token from cookies (or localStorage)

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      // Try to fetch data with the existing token
      let response = await axios.get("http://127.0.0.1:8000/api/requests", {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                  Total Request
                </h3>
                <p className="text-4xl font-bold text-indigo-600">24</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Pending
                </h3>
                <p className="text-4xl font-bold text-orange-600">
                  {requests?.status_counts?.pending}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Reject
                </h3>
                <p className="text-4xl font-bold text-red-600">
                  {" "}
                  {requests?.status_counts?.rejected}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  In Progress
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {" "}
                  {requests?.status_counts?.in_progress}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Completed
                </h3>
                <p className="text-4xl font-bold text-blue-600">
                  {" "}
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
    </div>
  );
};

export default RequestManagement;
