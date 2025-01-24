import { columns, peoples } from "@/components/dummyData/FormData";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExcelJS from "exceljs";
import { DownloadIcon } from "lucide-react";
import dynamic from "next/dynamic";
const Table = dynamic(() => import("@/components/tables/table"), { 
  ssr: false 
});


const userRole = Cookies.get("role");

const updatedColumns = columns.map((column) => {
  if (column.key === "notes") {
    if (userRole === "admin") {
      return { ...column, name: "Admin Notes" };
    } else if (userRole === "backoffice") {
      return { ...column, name: "Backoffice Notes" };
    } else if (userRole === "frontoffice") {
      return { ...column, name: "Front Office Notes" };
    }
  }
  return column;
});
const Completed = () => {
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);

  const fetchData = async () => {
    let token = Cookies.get("authToken");
    const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

    try {
      const response = await axios.get(`${apiUrl}/api/requests`, {
        params: { request_status: "complete" },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompletedRequests(response.data);
    }  catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Unauthorized. Please log in again.");
        } else if (error.response?.status === 404) {
          toast.error("Requests not found.");
        } else {
          toast.error("Failed to fetch pending requests.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
   };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Define consistent styles
    const styles = {
      title: {
        font: { bold: true, size: 16, color: { argb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "1F4E79" },
        },
        border: {
          top: { style: "medium", color: { argb: "1F4E79" } },
          left: { style: "medium", color: { argb: "1F4E79" } },
          bottom: { style: "medium", color: { argb: "1F4E79" } },
          right: { style: "medium", color: { argb: "1F4E79" } },
        },
      },
      sectionHeader: {
        font: { bold: true, size: 11, color: { argb: "FFFFFF" } },
        alignment: { horizontal: "left", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" },
        },
        border: {
          top: { style: "thin", color: { argb: "4472C4" } },
          left: { style: "thin", color: { argb: "4472C4" } },
          bottom: { style: "thin", color: { argb: "4472C4" } },
          right: { style: "thin", color: { argb: "4472C4" } },
        },
      },
      tableHeader: {
        font: { bold: true, size: 11, color: { argb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" },
        },
        border: {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        },
      },
      normalCell: {
        font: { size: 10 },
        alignment: { horizontal: "left", vertical: "middle" },
        border: {
          top: { style: "thin", color: { argb: "D9D9D9" } },
          left: { style: "thin", color: { argb: "D9D9D9" } },
          bottom: { style: "thin", color: { argb: "D9D9D9" } },
          right: { style: "thin", color: { argb: "D9D9D9" } },
        },
      },
      alternateRow: {
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F2F2F2" },
        },
      },
    };

    // Set column widths
    worksheet.columns = [
      { width: 4 }, // A
      { width: 3 }, // B
      { width: 20 }, // C - NO
      { width: 20 }, // D - Model
      { width: 20 }, // E - Serial NO
      { width: 20 }, // F - ID
      { width: 20 }, // G - Sign Code
      { width: 20 }, // H - CodePlug
      { width: 20 }, // I - CH
    ];

    // Add title
    const titleRow = worksheet.addRow([
      "",
      "",
      "MAAREYNTA GACANKA ISGAARSIINTA",
    ]);
    worksheet.mergeCells("C1:I1");
    titleRow.getCell(3).style = styles.title;
    worksheet.addRow([]); // Spacing

    // Add header information
    const headerData = [
      [
        "A.",
        "Adeegga",
        "",
        "",
        "",
        "Date Received",
        "Date Pickup",
      ],
      [
        "B.",
        "Codsi Ref No.",
        "",
        "",
        "",
        "",
        "",
      ],
      ["C.", "Ka Yimid", ""],
      ["D.", "Shaqo Gaar Ah", ""],
      ["E.", "TRANSACTION REF NO", "", ""],
    ];

    headerData.forEach((rowData, rowIndex) => {
      const row = worksheet.addRow(["", "", ...rowData]);
      row.getCell(3).style = styles.sectionHeader;
    
      if (rowIndex === 4) {
        // Merge cells for "TRANSACTION REF NO"
        worksheet.mergeCells(`D${row.number}:E${row.number}`);
        row.getCell(3).value = rowData[2]; // Assign value to the merged cell
        row.getCell(3).style = styles.sectionHeader; // Apply style to the merged cell
      }
    
      row.height = 20;
    });
    

    worksheet.addRow([]); // Spacing

    // Add table headers
    const tableHeaders = [
      "NO",
      "Model",
      "Serial NO",
      "ID",
      "Sign Code",
      "CodePlug",
      "CH",
    ];
    const headerRow = worksheet.addRow(["", "", ...tableHeaders]);
    headerRow.eachCell((cell, colNumber) => {
      if (colNumber > 2) {
        cell.style = styles.tableHeader;
      }
    });
    headerRow.height = 25;

    // Add table data
    const tableData = [
      [1, "Moto R7", "865EAQB494", "1139", "GORGOR 11", "R7-G-D-290125", "ch1"],
      [2, "Moto R7", "865EAQB877", "1044", "OB 1", "R7-G-DA-290125", "ch2"],
      [3, "Moto R7", "865EAQB311", "831", "DAYAX 4", "R7-G-A-290125", "Ch3"],
      [4, "Moto R7", "865EAQB241", "", "", "MOTO-R7-L-290125", "ch4"],
    ];

    tableData.forEach((rowData, index) => {
      const row = worksheet.addRow(["", "", ...rowData]);
      row.eachCell((cell, colNumber) => {
        if (colNumber > 2) {
          cell.style = styles.normalCell;
          if (index % 2 === 1) {
            cell.style = { ...styles.normalCell, ...styles.alternateRow };
          }
        }
      });
      row.height = 20;
    });

    // Add empty rows
    for (let i = 0; i < 6; i++) {
      const emptyRow = worksheet.addRow([
        "",
        "",
        i + 5,
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      emptyRow.eachCell((cell, colNumber) => {
        if (colNumber > 2) {
          cell.style = styles.normalCell;
          if (i % 2 === 1) {
            cell.style = { ...styles.normalCell, ...styles.alternateRow };
          }
        }
      });
      emptyRow.height = 20;
    }

    worksheet.addRow([]); // Spacing

    // Add signature section
    const signatureHeaders = ["", "Magaca", "Saxiixa", "Tariikh"];
    const signatureHeaderRow = worksheet.addRow(["", "", "", ...signatureHeaders]);
    signatureHeaders.style = styles.tableHeader;
    worksheet.mergeCells(`D21:E21`); // Merge cells C21 and D21
    const mergedCell = worksheet.getCell('D21'); // Get the starting cell of the merged range
    mergedCell.value = "Magaca"; // Set the value for the merged cell
    mergedCell.style = styles.tableHeader; // Apply the desired style
    signatureHeaderRow.height = 25;


    

    const signatures = [
      ["Baqaar Haye", "","","", ""],
      ["Prog/Repair", "","","", ""],
      ["Taliyaha Hogg. ICT", "S/G Salad Maxamed Gouled","","",  ""],
      ["Qofka Qaatey", "","","", ""],
      ["Qofka Siiyey", "","","", ""],
    ];

    signatures.forEach((rowData, index) => {
      const row = worksheet.addRow(["", "", ...rowData]);
      row.eachCell((cell, colNumber) => {
        if (colNumber > 2) {
          cell.style = styles.normalCell;
          if (index % 2 === 1) {
            cell.style = { ...styles.normalCell, ...styles.alternateRow };
          }
        }
      });
      row.height = 50;
    });

    worksheet.mergeCells(`D22:E22`); 
    worksheet.mergeCells(`D23:E23`); 
    worksheet.mergeCells(`D24:E24`); 
    worksheet.mergeCells(`D25:E25`); 
    worksheet.mergeCells(`D26:E26`); 

    const mergedCell2 = worksheet.getCell('D22');
    const mergedCell3 = worksheet.getCell('D23');
    const mergedCell4 = worksheet.getCell('D24');
    const mergedCell5 = worksheet.getCell('D25');
    const mergedCell6 = worksheet.getCell('D26');

    mergedCell2.value = "";
    mergedCell3.value = "";
    mergedCell4.value = "S/G Salad Maxamed Gouled";
    mergedCell5.value = "";
    mergedCell6.value = "";
    worksheet.getCell('F21').style  = styles.tableHeader;
    worksheet.getCell('G21').style  = styles.tableHeader;

    // Add notes section
    worksheet.addRow([]); // Spacing
    const notesRow = worksheet.addRow(["", "", "Notes"]);
    notesRow.getCell(3).style = styles.sectionHeader;

    worksheet.mergeCells(`C28:G28`);
    const mergedCellN = worksheet.getCell('C28');
    mergedCellN.value = "Notes";
    mergedCellN.style = styles.sectionHeader;

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "app_report.xlsx";
    link.click();
  };

  return (
    <div className="min-h-screen bg-white flex">
      <ToastContainer />

      {/* Sidebar Component */}
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md hidden md:block" />

      <div className="flex-1 md:ml-72">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex  px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Completed Requests
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className=" px-6 py-8">
          <div className="flex-1 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 capitalize">
                  Completed
                </h3>
                <p className="text-4xl font-bold text-blue-600">
                  {completedRequests?.total_requests}
                </p>
              </div>
            </div>
            <div className="flex  md:items-start items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">
                Completed Requests
              </h1>
            </div>
            {/* Download Button - Positioned Outside the Table */}
            <div className="mb-8 flex flex-col items-end">
              <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                Export Report
              </h1>
              <div className="flex items-center space-x-3">
                <button
                  onClick={downloadExcel}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center transition-transform transform hover:scale-105"
                >
                  <DownloadIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">Download Excel</span>
                </button>
              </div>
            </div>

            <div className="px-6">
              <Table
                columns={columns}
                data={completedRequests?.data}
                showDownload={true}
                fetchData={fetchData}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative">
            <ClipLoader color="#ffffff" loading={loading} size={50} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Completed;
