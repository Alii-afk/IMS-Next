import React from "react";
import Sidebar from "@/components/Sidebar";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import LineChart from "@/components/charts/LineChart";
import DeclinedChart from "@/components/charts/DeclinedChart";

const Home = () => {
  // Chart Data
  const barData = [120, 45];  // Approved, Pending
  const pieData = [300, 50, 100];  // In Stock, Out of Stock, Reserved
  const lineData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May"],
    values: [30, 40, 45, 50, 49],
  };
  const declinedData = [20, 30, 25, 40, 35];  // Declined Requests Over Time

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
          {/* BarChart */}
          <BarChart data={barData} />

          {/* PieChart */}
          <PieChart data={pieData} />

          {/* LineChart */}
          <LineChart data={lineData} />

          {/* DeclinedChart */}
          <DeclinedChart data={declinedData} />
        </div>
      </div>
    </div>
  );
};

export default Home;
