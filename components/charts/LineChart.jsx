import React from "react";
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart = ({ data }) => {
  const chartOptions = {
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
          reset: true
        }
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        opacity: 0.2,
        blur: 10,
        xOffset: 0,
        yOffset: 0,
        top: 10,
        left: 2,
        blur: 6,
        
      }
    },
    xaxis: {
      categories: data.months,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#4B5563'
        }
      },
      title: {
        text: 'Months',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Reports',
        style: {
          fontSize: '1px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    colors: ['#8B5CF6'], // Purple color
    stroke: {
      width: 6,
      curve: 'smooth',
      lineCap: 'round'
    },
    markers: {
      size: 6,
      colors: ['#8B5CF6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#C4B5FD'],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      }
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (val) {
          return val + " reports"
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Monthly Reports</h3>
        <p className="text-gray-600 mt-1">Overview of monthly reporting trends</p>
      </div>
      
      <div className="mt-4">
        <ApexCharts
          options={chartOptions}
          series={[
            {
              name: "Monthly Reports",
              data: data.values
            }
          ]}
          type="line"
          height={350}
        />
      </div>
{/*       
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing data for {data.months[0]} - {data.months[data.months.length - 1]}
      </div> */}
    </div>
  );
};

export default LineChart;