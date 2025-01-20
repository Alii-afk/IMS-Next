import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Sidebar from "@/components/Sidebar";
import LineChart from "@/components/charts/LineChart";
import RejectedChart from "@/components/charts/RejectedChart";
import StockPieChart from "@/components/charts/StatusPieChart";
import StockBarChart from "@/components/charts/StockBarChart";
import { ClipLoader } from "react-spinners";

const Home = () => {
  // State for user role and name

  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const router = useRouter();

  // Chart Data
  const barData = [120, 45];
  const pieData = [300, 50, 100];
  const lineData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May"],
    values: [30, 40, 45, 50, 49],
  };
  const rejectedData = [20, 30, 25, 40, 35];

  useEffect(() => {
    setRole(Cookies.get("role"));
    setName(Cookies.get("name"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 flex flex-col md:ml-64">
        <div className="bg-white shadow-sm w-full">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 px-6">Dashboard</h1>
          </div>
        </div>

        <div className="px-4 md:px-12 lg:px-20 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-center">
          {/* Conditionally render charts based on user role */}
          <StockPieChart data={barData} />
          <StockBarChart data={pieData} />
          {role !== "backoffice" && (
            <>
              {/* Always render the RejectedChart */}
              <LineChart data={lineData} />
              <RejectedChart data={rejectedData} />
            </>
          )}
         
        </div>
      </div>
       
    </div>
  );
};

export default Home;
