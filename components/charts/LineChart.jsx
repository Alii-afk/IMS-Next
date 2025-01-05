import React from "react";
import ApexCharts from "react-apexcharts";

const LineChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
    },
    xaxis: {
      categories: data.months,
    },
    colors: ["#8e44ad"],
    stroke: {
      width: 3,
      curve: "smooth",
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Monthly Reports
      </h3>
      <ApexCharts
        options={chartOptions}
        series={[{ name: "Reports", data: data.values }]}
        type="line"
        height={350}
      />
    </div>
  );
};

export default LineChart;
