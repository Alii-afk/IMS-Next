import React from "react";
import ApexCharts from "react-apexcharts";

const DeclinedChart = ({ data }) => {
  const options = {
    chart: {
      type: "line",
      height: 350,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May"],
    },
    colors: ["#e74c3c"],  // Red for declined
    title: {
      text: "Declined Requests",
      align: "left",
    },
  };

  const series = [
    {
      name: "Declined",
      data: data,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <ApexCharts options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default DeclinedChart;
