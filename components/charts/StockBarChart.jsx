import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Cookies from "js-cookie";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const StockBarChart = ({ data }) => {
  const [statusData, setStatusData] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter()
  const fetchStatusData = async () => {
    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;
  
    try {
      const response = await axios.get(`${apiUrl}/api/warehouse-stock/ratios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the response structure includes status_counts
      setStatusData(response.data.status_counts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle known Axios errors
        if (error.response?.status === 401) {
          toast.error("Unauthorized: Please log in again.");
          router.push("/");
        } else if (error.response?.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Failed to fetch data. Please check your connection.");
        }
      } else {
        // Handle unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Unexpected Error:", error); // Log for debugging
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, []);
  const totalStock =
  (statusData?.in_house || 0) + (statusData?.on_field || 0);

  // Prepare data for the chart
  const chartData = [
    statusData?.in_house || 0, // In Warehouse
    statusData?.on_field || 0,  // On Field
    totalStock || data?.total_stock || 0,
  ];

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
        distributed: true, 
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      categories: ["In Warehouse", "On Field", "Total Stock"],
      labels: {
        style: {
          fontSize: '12px',
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
      show: false
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
    colors: [
      '#EF4444', 
      '#10B981', 
      '#F59E0B', 
    ],
    theme: {
      mode: 'light'
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
            <ToastContainer />

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Stock Overview</h3>
        <p className="text-gray-600 mt-1">Current Inventory Status</p>
      </div>

      <div className="mt-4">
        <ApexCharts
          options={chartOptions}
          series={[{
            name: "Stock Status",
            data: chartData
          }]}
          type="bar"
          height={350}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
          <span className="text-sm text-gray-600">In Warehouse</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-600">On Field</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-amber-500 mr-2"></div>
          <span className="text-sm text-gray-600">Total Stock</span>
        </div>
      </div>
    </div>
  );
};

export default StockBarChart;
