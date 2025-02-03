import React, { useState, useEffect } from "react";
import { FaDownload, FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa"; // Import icons for edit and delete
import { useForm } from "react-hook-form";

import DeleteConfirmation from "../card/DeleteConfirmation";

import Cookies from "js-cookie";

import EditDetailsModal from "../card/EditDetailsModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ViewCard from "../card/ViewCard";
import { MdPictureAsPdf } from "react-icons/md";
import FrontOfficePdf from "../models/FrontOfficepdf";
import FrontOfficePdfModal from "../models/FrontOfficepdf";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Table = ({
  columns,
  data,
  searchEnabled = false,
  showDownload = false,
  fetchData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [completed, setCompleted] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
  const [frontOfficePDFs, setFrontOfficePDF] = useState(false);
  const [viewCard, setViewCard] = useState("");

  console.log(data);

  const frontpdfOpen = (row) => {
    setCurrentRowData(row);
    setFrontOfficePDF(true);
  };

  const openViewCardModal = (row) => {
    setCurrentRowData(row);
    setSelectedRow(true);
  };

  const openModal = (row) => {
    setCurrentRowData(row);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

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

  const label =
    userRole === "admin"
      ? "Admin Notes"
      : userRole === "frontoffice"
      ? "Frontend Office Notes"
      : "Backoffice Notes";

  const handleDelete = async () => {
    try {
      if (!currentRowData) {
        toast.error("No item selected for deletion");
        return;
      }

      const token = Cookies.get("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_MAP_KEY;

      const response = await fetch(
        `${apiUrl}/api/requests/${currentRowData.id}`, // Use currentRowData.id
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Item deleted successfully!");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData?.message || "Failed to delete the item.";
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }

    closeModal();
    fetchData();
    // fetchPendingRequests();
  };

  const parseTime = (time) => {
    if (!time) {
      // Return a default or an empty value if time is not provided
      return "Invalid Time";
    }

    const daysAgo = parseInt(time.split(" ")[0], 10);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - daysAgo);

    return currentDate.toISOString().slice(0, 16);
  };

  const handleEditClick = (rowData) => {
    setCurrentRowData(rowData);
    setModalOpen(true);
  };

  // Filter data based on search term
  const filteredData = Array.isArray(data)
    ? data.filter((row) =>
        columns.some((column) =>
          row[column.key]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      )
    : [];
  const truncate = (text, maxLength) => {
    if (!text) return "No Notes Available"; // Handle null or undefined text
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleDownload = () => {
    // Define columns to export
    let columnsToExport = [
      "name",
      "organization",
      "type",
      "date_time",
      "request_status",
    ];

    // Conditionally include the appropriate notes based on the user role
    if (userRole === "admin") {
      columnsToExport.push("admin_notes");
    } else if (userRole === "frontoffice") {
      columnsToExport.push("front_office_notes");
    } else if (userRole === "backoffice") {
      columnsToExport.push("back_office_notes");
    }

    const doc = new jsPDF();

    // Add header
    const header = columnsToExport.map((col) => {
      const column = columns.find((colObj) => colObj.key === col);
      return column ? column.name : col; // Get the name of the column from the columns array
    });

    // Map filtered data and include the role-specific notes
    const body = filteredData.map((row) => {
      const rowData = columnsToExport.map((column) => {
        const value =
          row[column] !== undefined && row[column] !== null ? row[column] : "";

        return column === "date_time" && value instanceof Date
          ? value.toLocaleString() // Format the date if needed
          : value;
      });
      return rowData;
    });

    // Generate the PDF table
    doc.autoTable({
      head: [header],
      body: body,
    });

    // Save PDF with the name 'table_data.pdf'
    doc.save("table_data.pdf");
  };

  const handleFinalPdfDownload = (filePath) => {
    if (!filePath) {
      alert("No file available for download.");
      return;
    }

    // Assuming your Laravel app is on localhost:8000
    const fileUrl = `http://localhost:8000${filePath}`;
    console.log(fileUrl);

    // Create an anchor element to trigger the download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank"; // Open in a new tab if needed

    // Force file download (ensure download is triggered)
    link.download = filePath.split("/").pop(); // Extract file name for download

    // Append the link to the document, simulate a click, and remove it afterward
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = async (id) => {
    console.log("id", id);
    const doc = new jsPDF({
      orientation: "portrait", // Change orientation to portrait
      unit: "mm",
      format: "a4", // A4 size in portrait
    });

    const getPdfData = async (id) => {
      const token = Cookies.get("authToken");
      const apiUrl = `${process.env.NEXT_PUBLIC_MAP_KEY}/api/requests/getPdfData`;

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching PDF data:", error);
        throw error;
      }
    };

    const data = await getPdfData(id); // Wait for the async data to be fetched

    const request = data.request;
    const user = request.user;
    const adminUser = data.admin_user;
    const warehouseStocks = request.warehouse_stocks;

    const wallpaper = new Image();
    wallpaper.src = "http://localhost:3000/images/wallpaper.jpeg"; // Ensure the image is in the correct directory

    wallpaper.onload = () => {
      // Set opacity (using Graphics State)
      const gState = doc.internal.write("q"); // Save state
      doc.setGState(new doc.GState({ opacity: 0.09 })); // Adjust opacity (0 to 1)

      // Add wallpaper image (covering the full page)
      doc.addImage(wallpaper, "JPEG", 0, 40, 210, 210, "", "NONE"); // Adjust for portrait size

      doc.internal.write("Q"); // Restore state
      // Title bar with navy blue background
      doc.setFillColor(31, 78, 121); // Dark blue color
      doc.rect(0, 0, 210, 15, "F"); // Adjust width for portrait

      const img = new Image();
      img.src = "http://localhost:3000/images/logo.jpg"; // Ensure the image is in the correct directory

      // Title text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "HOGGAANKA ICT                 MAAREYNTA GACANKA ISGAARSIINTA",
        105, // Center the title for portrait layout
        10,
        { align: "center" }
      );
      doc.addImage(img, "PNG", 75, 0, 15, 15); // Adjust x and y for portrait

      // Reset text color and font for content
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      let y = 25;

      // Title section with dynamic values
      doc.setTextColor(0, 0, 0);
      doc.text(`Adeegga:`, 10, y); // Display the "name" from request object

      let type; // Define type variable outside the if-else block

      if (request.type === "programming") {
        type = "Programming/Repair";
      } else {
        type = "New";
      }

      doc.setTextColor(31, 78, 121); // Green color for type
      doc.text(`${type}`, 26, y);

      doc.setTextColor(0, 0, 0);
      doc.text("TRANSACTION REF NO:", 120, y);

      doc.setTextColor(31, 78, 121); // Green color
      const formattedId = String(request.id).padStart(4, "0");
      doc.text(`SPF-ICT-${formattedId}`, 162, y);

      y += 7;
      // Notes section (front office, back office)
      doc.setTextColor(0, 0, 0);
      doc.text("Codsi Ka Yimid:", 10, y);

      doc.setTextColor(31, 78, 121); // Green color
      doc.text(`${request.name}`, 36, y);

      doc.setTextColor(0, 0, 0);
      doc.text(`Date Received:`, 120, y);

      const date = new Date(request.date_time);
      const formattedDate = date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Enables 12-hour format
      });
      doc.setTextColor(31, 78, 121); // Green color
      doc.text(`${formattedDate}`, 146, y); // Adjust position for portrait

      y += 7;

      // Transaction Reference Number
      // More dynamic content for Hogg/Qeybta/Fadhiga/Saldhigga
      doc.setTextColor(0, 0, 0);
      doc.text("Hogg/Qeybta/Fadhiga/Saldhigga:", 10, y);

      doc.setTextColor(31, 78, 121); // Green color
      doc.text(`${request.organization}`, 63, y); // Adjust position

      doc.setTextColor(0, 0, 0); // Green color for Date Pickup
      doc.text("Date Pickup:", 120, y);

      doc.setTextColor(31, 78, 121); // Red color for "Date of Transaction Closing"
      doc.text("", 350, y);

      // Equipment Table
      const equipmentHeaders = [
        ["Serial No", "Model", "Unit Id", "Code Sign", "Codeplug", "CH"],
      ];

      const selectedStocks =
        request.type === "programming"
          ? request.programming_stocks
          : warehouseStocks;

      const equipmentData = Array.isArray(selectedStocks)
        ? selectedStocks.map((item) => [
            item.serial_no,
            item.product_name || item.model_name,
            item.unit,
            item.sign_code,
            item.codeplug,
            item.channels,
          ])
        : [];

      doc.autoTable({
        startY: y + 7,
        head: equipmentHeaders,
        body: equipmentData,
        theme: "grid",
        headStyles: {
          fillColor: [65, 105, 225], // Royal blue
          textColor: [255, 255, 255],
          fontSize: 10,
          halign: "center",
        },
        styles: {
          cellPadding: 2,
          fontSize: 9, // Adjust font size for portrait
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
          fillColor: false,
        },
        // columnStyles: {
        //   1: { cellWidth: 20 }, // Adjust column width
        //   2: { cellWidth: 20 },
        // },
        margin: { left: 5, right: 5 },
      });

      // Signature Table with Dynamic Data
      const signatureHeaders = [["Title", "Magaca", "Saxiixa", "Tarikh"]];
      let backofficename;
      if (request.type === "programming") {
        backofficename = request.programming_stocks[0]?.user.name;
      } else {
        backofficename = request.warehouse_stocks[0]?.user.name;
      }

      const signatureData = [
        {
          name: "Baqaar Haye",
          magaca: `${backofficename}`,
          saxiixa: "",
          tarikh: "",
        },
        {
          name: "Prog/Repair",
          magaca: `${backofficename}`,
          saxiixa: "",
          tarikh: "",
        },
        {
          name: "Taliyaha Hogg. ICT",
          magaca: adminUser?.name,
          saxiixa: "",
          tarikh: "",
        },
        {
          name: "Qofka Qaatey",
          magaca: "",
          saxiixa: "",
          tarikh: "",
        },
        {
          name: "Qofka Siiyey",
          magaca: user?.name,
          saxiixa: "",
          tarikh: "",
        },
      ];

      const signatureTableData = signatureData.map((item) => [
        item.name || "",
        item.magaca || "",
        item.saxiixa || "",
        item.tarikh || "",
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 3,
        head: signatureHeaders,
        body: signatureTableData,
        theme: "grid",
        headStyles: {
          fillColor: [65, 105, 225],
          textColor: [255, 255, 255],
          fontSize: 10,
          halign: "center",
        },
        styles: {
          cellPadding: 4.5,
          fontSize: 9, // Adjust font size
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
          fillColor: false,
        },
        margin: { left: 5, right: 5 },
      });

      // Notes Section
      let notesY = doc.lastAutoTable.finalY + 3;

      const noteHeaders = [["Notes", "Content"]];
      const noteTableData = [
        ["Front Office", request.front_office_notes],
        ["Back Office", request.back_office_notes],
        ["Admin", request.admin_notes || "No notes"],
      ];

      doc.autoTable({
        startY: notesY,
        head: noteHeaders,
        body: noteTableData,
        theme: "grid",
        headStyles: {
          fillColor: [65, 105, 225],
          textColor: [255, 255, 255],
          fontSize: 10,
          halign: "center",
        },
        styles: {
          cellPadding: 3.5,
          fontSize: 9, // Adjust font size
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
          fillColor: false,
        },
        margin: { left: 5, right: 5 },
      });
      
      doc.save(`SPF-ICT-${formattedId}.pdf`);
    };
  };

  return (
    <>
      <div className="mt-8 flow-root z-10">
        <ToastContainer />
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle px-4">
            {/* Search Input */}
            {searchEnabled && (
              <div className="relative  flex rounded-md shadow-lg bg-white outline-1 outline-gray-300 max-w-sm mb-6">
                <input
                  type="text"
                  className="block w-full border-2 rounded-md pl-10 pr-4 py-2 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Search Icon */}
                <div className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch className="w-5 h-5" />
                </div>
              </div>
            )}

            <div className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-lg shadow-md">
              <table className="min-w-full table-auto border-separate border-spacing-0 shadow-xl rounded-lg overflow-hidden bg-white">
                <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                  <tr className="text-center">
                    {updatedColumns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="sticky top-0 z-10 py-4 px-6 text-lg font-semibold tracking-wider text-start capitalize whitespace-nowrap"
                      >
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-indigo-50 transition-all duration-200 ease-in-out"
                    >
                      {updatedColumns.map((column) => (
                        <td
                          key={column.key}
                          className={classNames(
                            "border-b border-gray-200",
                            "py-4 px-6  font-medium text-gray-800 whitespace-nowrap text-base text-start items-center"
                          )}
                        >
                          {column.key === "action" ? (
                            <div className="flex items-center space-x-2">
                              {/* Admin Role */}
                              {userRole === "admin" && (
                                <>
                                  {/* {row.request_status === "complete" && (
                                    <button
                                      className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition-all"
                                      onClick={() => handleDownload(row)}
                                    >
                                      <FaDownload className="w-5 h-5" />
                                    </button>
                                  )} */}
                                  {row.request_status === "complete" &&
                                    row.final_pdf && (
                                      <button
                                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition-all"
                                        onClick={() =>
                                          handleFinalPdfDownload(row.final_pdf)
                                        }
                                      >
                                        <MdPictureAsPdf className="w-6 h-6 flex items-center text-green-500" />
                                      </button>
                                    )}
                                  {row.request_status === "approved" && (
                                    <button
                                      className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                      onClick={() => handleEditClick(row)}
                                    >
                                      <FaEdit className="w-5 h-5" />
                                    </button>
                                  )}

                                  {row.request_status === "rejected" && (
                                    <>
                                      <button
                                        className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                        onClick={() => handleEditClick(row)}
                                      >
                                        <FaEdit className="w-5 h-5" />
                                      </button>
                                      <button
                                        className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer transition-all"
                                        onClick={() => openModal(row)}
                                      >
                                        <FaTrash className="w-5 h-5" />
                                      </button>
                                    </>
                                  )}
                                  {row.request_status === "pending" && (
                                    <>
                                      <button
                                        className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                        onClick={() => handleEditClick(row)}
                                      >
                                        <FaEdit className="w-5 h-5" />
                                      </button>
                                      <button
                                        className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer transition-all"
                                        onClick={() => openModal(row)}
                                      >
                                        <FaTrash className="w-5 h-5" />
                                      </button>
                                    </>
                                  )}
                                </>
                              )}

                              {/* FrontOffice Role */}
                              {userRole === "frontoffice" && (
                                <>
                                  {row.request_status === "complete" &&
                                    !row.final_pdf && (
                                      <div>
                                        <button
                                          className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all items-center"
                                          onClick={() => frontpdfOpen(row)}
                                        >
                                          <FaEdit className="w-6 h-6 text-green-500" />
                                        </button>
                                      </div>
                                    )}

                                  {row.request_status === "complete" &&
                                    row.final_pdf && (
                                      <button
                                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition-all"
                                        onClick={() =>
                                          handleFinalPdfDownload(row.final_pdf)
                                        }
                                      >
                                        <MdPictureAsPdf className="w-6 h-6 flex items-center text-green-500" />
                                      </button>
                                    )}
                                  {/* {row.request_status === "complete" && (
                                    <button
                                      className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition-all"
                                      onClick={handleDownload}
                                    >
                                      <FaDownload className="w-5 h-5" />
                                    </button>
                                  )} */}
                                  {row.request_status === "approved" && (
                                    <button
                                      className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                      onClick={() => handleEditClick(row)}
                                    >
                                      <FaEdit className="w-5 h-5" />
                                    </button>
                                  )}

                                  {row.request_status === "pending" && (
                                    <>
                                      <button
                                        className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                        onClick={() => handleEditClick(row)}
                                      >
                                        <FaEdit className="w-5 h-5" />
                                      </button>
                                      <button
                                        className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer transition-all"
                                        onClick={() => openModal(row)}
                                      >
                                        <FaTrash className="w-5 h-5" />
                                      </button>
                                    </>
                                  )}

                                  {row.request_status === "rejected" && (
                                    <button
                                      className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                      onClick={() => openViewCardModal(row)} // Function to open the view modal
                                    >
                                      <FaEye className="w-5 h-5" />{" "}
                                      {/* View Icon */}
                                    </button>
                                  )}
                                </>
                              )}

                              {/* BackOffice Role */}
                              {userRole === "backoffice" && (
                                <>
                                  {row.request_status === "complete" && (
                                    <>
                                      {/* <button
                                        className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                        onClick={() => openViewCardModal(row)} // Function to open the view modal
                                      >
                                        <FaEye className="w-5 h-7" />{" "}
                                     
                                      </button> */}
                                      {!row.final_pdf && ( // Hide Edit button if final_pdf exists
                                        <button
                                          className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                          onClick={() => handleEditClick(row)}
                                        >
                                          <FaEdit className="w-5 h-5" />
                                        </button>
                                      )}
                                      {/* <button
                                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition-all"
                                        onClick={handleDownload}
                                      >
                                        <FaDownload className="w-5 h-5" />
                                      </button> */}
                                    </>
                                  )}
                                  {row.request_status === "approved" && (
                                    <button
                                      className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                      onClick={() => handleEditClick(row)}
                                    >
                                      <FaEdit className="w-5 h-5" />
                                    </button>
                                  )}
                                </>
                              )}

                              {row.request_status === "complete" && (
                                <div>
                                  <button
                                    className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all items-center"
                                    onClick={() => downloadExcel(row.id)} // Pass row.id directly to downloadExcel
                                  >
                                    <MdPictureAsPdf className="w-6 h-8 flex items-center text-red-500" />
                                  </button>
                                </div>
                              )}
                              {row.request_status === "complete" && (
                                <div>
                                  <button
                                    className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                    onClick={() => openViewCardModal(row)} // Function to open the view modal
                                  >
                                    <FaEye className="w-5 h-7" />{" "}
                                    {/* View Icon */}
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : column.key === "notes" ? (
                            <span>
                              {userRole === "admin"
                                ? truncate(row?.admin_notes, 30)
                                : userRole === "frontoffice"
                                ? truncate(row?.front_office_notes, 30)
                                : truncate(row?.back_office_notes, 30)}
                            </span>
                          ) : column.key === "date_time" ? (
                            new Date(row[column.key]).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true, // Enables 12-hour format
                            })
                          ) : row[column.key] !== undefined &&
                            row[column.key] !== null ? (
                            row[column.key]
                          ) : (
                            "Not Found"
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for delete confirmation */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-10"
            style={{
              animation: isModalOpen
                ? "scaleUp 0.3s ease-out"
                : "scaleDown 0.3s ease-in",
            }}
          >
            <div className="">
              <DeleteConfirmation
                handleDelete={handleDelete}
                closeModal={closeModal}
              />
            </div>
          </div>
        )}

        {/* // Modal for editing */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-10"
            style={{
              animation: modalOpen
                ? "scaleUp 0.3s ease-out"
                : "scaleDown 0.3s ease-in",
            }}
          >
            <EditDetailsModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              currentRowData={currentRowData}
              userRole={userRole}
              fetchData={fetchData}
              // onSubmit={onSubmit}
            />
          </div>
        )}

        {selectedRow && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-10"
            style={{
              animation: selectedRow
                ? "scaleUp 0.3s ease-out"
                : "scaleDown 0.3s ease-in",
            }}
          >
            <ViewCard
              selectedRow={selectedRow}
              setModalOpen={setModalOpen}
              setSelectedRow={setSelectedRow}
              currentRowData={currentRowData}
              userRole={userRole}
              fetchData={fetchData}
              // onSubmit={onSubmit}
            />
          </div>
        )}

        {frontOfficePDFs && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-10"
            style={{
              animation: frontOfficePDFs
                ? "scaleUp 0.3s ease-out"
                : "scaleDown 0.3s ease-in",
            }}
          >
            <FrontOfficePdf
              currentRowData={currentRowData}
              fetchData={fetchData}
              setFrontOfficePDF={setFrontOfficePDF}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
