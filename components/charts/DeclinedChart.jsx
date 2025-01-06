import React from "react";
import dynamic from "next/dynamic";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const DeclinedChart = ({ data }) => {
  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      dropShadow: {
        enabled: true,
        color: "#EF4444",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
    },
    stroke: {
      curve: "smooth",
      width: 6,
      lineCap: "round",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May"],
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
          colors: "#4B5563",
        },
      },
      title: {
        text: "Month",
        style: {
          fontSize: "14px",
          fontWeight: 600,
          color: "#1F2937",
        },
      },
    },
    yaxis: {
      title: {
        text: "Number of Declined Requests",
        style: {
          fontSize: "14px",
          fontWeight: 600,
          color: "#1F2937",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
        formatter: function (value) {
          return Math.round(value);
        },
      },
    },
    colors: ["#EF4444"], // Red for declined
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#FCA5A5"],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      },
    },
    markers: {
      size: 6,
      colors: ["#EF4444"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 8,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (val) {
          return val + " requests declined";
        },
      },
    },
    title: {
      text: "Declined Requests Overview",
      align: "left",
      style: {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#1F2937",
      },
    },
    subtitle: {
      text: "Monthly trend of declined requests",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#6B7280",
      },
    },
  };

  const series = [
    {
      name: "Declined Requests",
      data: data,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="space-y-6">
        <ApexCharts options={options} series={series} type="line" height={350} />
      </div>
    </div>
  );
};

export default DeclinedChart;
