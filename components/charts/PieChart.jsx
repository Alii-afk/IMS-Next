import React from "react";
import ApexCharts from "react-apexcharts";

const PieChart = ({ data }) => {
  const chartOptions = {
    labels: ["In Stock", "Out of Stock", "Reserved"],
    colors: ["#3498db", "#e74c3c", "#f1c40f"],
    legend: {
      position: "bottom",
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Stock Overview
      </h3>
      <ApexCharts
        options={chartOptions}
        series={data}
        type="pie"
        height={350}
      />
    </div>
  );
};

export default PieChart;
