import React from "react";
import ApexCharts from "react-apexcharts";

const BarChart = ({ data }) => {
  const [approved, pending] = data; // Destructure the data

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: true, // Enable data labels for better visibility
    },
    xaxis: {
      categories: ["Approved", "Pending"], // Show both Approved and Pending categories
    },
    colors: ["#2ecc71", "#e74c3c"], // Green for Approved, Red for Pending
  };

  const series = [
    { name: "Approved", data: [approved] },
    { name: "Pending", data: [pending] },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Tracking</h3>
      <ApexCharts
        options={chartOptions}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarChart;
