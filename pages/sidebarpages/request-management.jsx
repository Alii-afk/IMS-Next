import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { columns } from "@/components/dummyData/FormData";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Pagination from "@/components/pagination";

const Table = dynamic(() => import("@/components/tables/table"), {
  ssr: false,
});

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const router = useRouter();

  const fetchData = async (page) => {
    try {
      let token = Cookies.get("authToken");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      const response = await axios.get(`${apiUrl}/api/requests`, {
        params: {
          per_page: perPage,
          page: page,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setTimeout(() => {
            toast.error("Unauthorized. Please log in again.");
          }, 3000);
          router.push("/");
        } else if (error.response?.status === 404) {
          setTimeout(() => {
            toast.error("Resource not found.");
          }, 3000);
        } else {
          setTimeout(() => {
            toast.error("An unexpected error occurred.");
          }, 3000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]); // Fetch data whenever currentPage changes

  return (
    <div className="min-h-screen bg-white flex">
      <ToastContainer />
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
        <div className="px-6 py-8 flex flex-col">
          {/* Other Components */}
          <div className="px-6">
            <Table
              columns={columns}
              data={requests?.data?.data}
              searchEnabled={true}
              fetchData={fetchData}
            />
          </div>
          <div className=" bg-white shadow-sm">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(requests?.data?.total / perPage)}
              onPageChange={(page) => setCurrentPage(page)}
            />
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
