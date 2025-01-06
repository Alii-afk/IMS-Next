import React from "react";
import ApexCharts from "react-apexcharts";

const StatusPieChart = () => {
  const options = {
    chart: {
      type: "pie", 
      height: 350,
    },
    labels: ["Approved", "Pending", "Declined"], 
    colors: ["#2ecc71", "#e74c3c", "#f39c12"], 
    title: {
      text: "Approval Status",
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    dataLabels: {
      enabled: true, // Display data labels
    },
    legend: {
      position: "bottom", // Display the legend at the bottom
    },
  };

  const series = [45, 30, 25]; // Example data for pie chart

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Overview</h3>
        <p className="text-gray-600 mt-1">Current status</p>
      </div>
      <ApexCharts options={options} series={series} type="pie" height={350} />
      
    </div>
  );
};

export default StatusPieChart;
