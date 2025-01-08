import React from "react";
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const StockBarChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
        columnWidth: "20%",
        distributed: true, // Enable individual colors for each bar
        dataLabels: {
          position: 'top'
        }
      }
    },
    // Remove colors array from here as we'll use individual colors
    xaxis: {
      categories: ["In Warehouse", "On Field", "Total Stock"],
      labels: {
        style: {
          fontSize: '3px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      title: {
        text: 'Stock Count',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toString();
      },
      style: {
        fontSize: '14px',
        fontWeight: 600
      }
    },
    legend: {
      show: false // Hide legend since we're using distributed colors
    },
    grid: {
      show: true,
      borderColor: '#E2E8F0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    // Define colors for individual bars
    colors: [
      '#F59E0B', // Amber for Total Stock
      '#10B981', // Green for on field
      '#EF4444', // Red for in warehouse
       
    ],
    theme: {
      mode: 'light'
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Stock Overview</h3>
        <p className="text-gray-600 mt-1">Current Inventory Status</p>
      </div>
      
      <div className="mt-4">
        <ApexCharts
          options={chartOptions}
          series={[{
            name: "Stock Status",
            data: data
          }]}
          type="bar"
          height={350}
        />
      </div>
      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-4">
      <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-amber-500 mr-2"></div>
          <span className="text-sm text-gray-600">Total Stock</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-emerald-500 mr-2"></div>
          <span className="text-sm text-gray-600">In Warehouse</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
          <span className="text-sm text-gray-600">On Field</span>
        </div>
        
      </div>
    </div>
  );
};

export default StockBarChart;