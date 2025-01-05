import React from "react";
import ApexCharts from "react-apexcharts";

const BarChart = () => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "45%", // Adjust the width of the bars (space between will increase with smaller width)
      },
    },
    colors: ["#2ecc71", "#e74c3c", "#f39c12"], // Green (Approved), Red (Pending), Yellow (Declined)
    xaxis: {
      categories: ["Status 1", "Status 2", "Status 3", "Status 4"], // Multiple categories to spread out bars
      tickPlacement: 'between', // Adds spacing between groups
    },
    dataLabels: {
      enabled: true,
    },
    title: {
      text: "Approval Status",
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    grid: {
      show: true, // Show gridlines
      borderColor: '#f1f1f1', // Set a color for gridlines
    },
  };

  const series = [
    {
      name: "Approved",
      data: [45, 45, 45, 45], // Example data for each category
    },
    {
      name: "Pending",
      data: [30, 50, 40, 35], // Example data for each category
    },
    {
      name: "Declined",
      data: [25, 25, 25, 25], // Example data for each category
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Stock Overview
      </h3>
      <ApexCharts options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
