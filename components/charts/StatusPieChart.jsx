import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import Cookies from "js-cookie";

const StatusPieChart = () => {
  const [statusData, setStatusData] = useState({});
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  // Fetch the status data from your API
  const fetchStatusData = async () => {
    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    try {
      const response = await axios.get(`${apiUrl}/api/requests/ratios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the response structure includes status_counts and percentages
      setStatusData(response.data.status_counts);
    } catch (error) {
      console.error("Error fetching status data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRole(Cookies.get("role")); // Set the user role from cookies
    fetchStatusData();
  }, []);

  // Labels and series for pie chart
  let labels = ["Pending", "In Progress", "Completed", "Rejected"];
  let series = [
    statusData.pending || 0,
    statusData.in_progress || 0,
    statusData.complete || 0,
    statusData.rejected || 0,
  ];

  // If the user is backoffice, we only show In Progress and Completed
  if (role === "backoffice") {
    labels = ["In Progress", "Completed"];
    series = [statusData.in_progress || 0, statusData.complete || 0];
  }

  // Configure chart options
  const options = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: labels, // Use the conditionally modified labels
    colors: ["#f39c12", "#3498db", "#2ecc71", "#e74c3c"], // Colors for each status
    title: {
      text: "Approval Status",
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Requests Overview</h3>
        <p className="text-gray-600 mt-1">Current Status</p>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ApexCharts options={options} series={series} type="pie" height={350} />
      )}
    </div>
  );
};

export default StatusPieChart;
