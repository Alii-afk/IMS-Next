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
  const [frontOfficePDF, setFrontOfficePDF] = useState(false);
  const [viewCard, setViewCard] = useState("");

  console.log(viewCard.request);

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

  // downlaod pdf
  const handleDownload = () => {
    // Define columns to export
    let columnsToExport = [
      "name",
      "organization",
      "type",
      "date_time",
      "request_status",
    ];

    // Conditionally include "notes" column based on userRole
    if (
      userRole === "admin" ||
      userRole === "backoffice" ||
      userRole === "frontoffice"
    ) {
      columnsToExport.push("notes");
    }

    const doc = new jsPDF();

    // Add header
    const header = columnsToExport.map((col) => {
      const column = columns.find((colObj) => colObj.key === col);
      return column ? column.name : col; // Get the name of the column (from columns array)
    });

    // Map filtered data to ensure every column exists, even if the value is missing
    const body = filteredData.map((row) => {
      const rowData = columnsToExport.map((column) => {
        // Check if the column exists and if the value is valid, fallback to empty string
        const value =
          row[column] !== undefined && row[column] !== null ? row[column] : "";

        // If 'date_time' is a date, format it (if needed)
        if (column === "date_time" && value instanceof Date) {
          return value.toLocaleString(); // Format date if needed
        }

        return value;
      });
      return rowData;
    });

    // Add table to PDF using autoTable
    doc.autoTable({
      head: [header],
      body: body,
    });

    // Save PDF with the name 'table_data.pdf'
    doc.save("table_data.pdf");
  };

  // downlaod report pdf fucntion
  const headerData = {
    adeegga: `${viewCard.request.name}`,
    type: `${viewCard.request.type}`,
    dateReceived: `${viewCard.request.date_time}`,
    datePickup: `${viewCard.request.date_time}`,
    codsiKaYimid: `${viewCard.request.user_name}`,
    hoggQeybta: `${viewCard.request.name}`,
    transactionRefNo: `${viewCard.request.name}`,
  };

  const mainTableData = [
    {
      model: "Motorola DP4801",
      serialNo: "445ABC123",
      id: "UNIT-001",
      codeSign: "ALPHA-1",
      codePlug: "CP-V1.2",
      ch: "CH-15",
    },
    {
      model: "Motorola DP4600",
      serialNo: "445DEF456",
      id: "UNIT-002",
      codeSign: "BETA-2",
      codePlug: "CP-V1.2",
      ch: "CH-16",
    },
    {
      model: "Motorola DP4401",
      serialNo: "445GHI789",
      id: "UNIT-003",
      codeSign: "GAMMA-3",
      codePlug: "CP-V1.2",
      ch: "CH-17",
    },
  ];

  // Dummy data for signature table
  const signatureData = [
    {
      name: "Baqaar Haye",
      magaca: "back office user name",
      saxiixa: "",
      tarikh: "2024-01-27",
    },
    {
      name: "Prog/Repair",

      magaca: "Back Office User Name ",
      saxiixa: "",
      tarikh: "2024-01-27",
    },
    {
      name: "Taliyaha Hogg. ICT",

      magaca: "Admin User Name ",
      saxiixa: "",
      tarikh: "2024-01-27",
    },
    {
      name: "Qofka Qaatey",

      magaca: "stays empty",
      saxiixa: "",
      tarikh: "2024-01-27",
    },
    {
      name: "Qofka Siiyey",

      magaca: "front office username ",
      saxiixa: "",
      tarikh: "2024-01-27",
    },
  ];

  // Dummy data for Notes section
  const dummyNotes = [
    {
      title: "Admin Notes",
      content:
        "Effective communication, whether in written or verbal form, is an essential skill in both personal and professional environments, as it allows individuals to express their ideas, collaborate effectively, resolve conflicts, and build meaningful relationships based on trust and mutual understanding.",
    },
    {
      title: "Front Office Notes",
      content:
        "This is an example of front office notes. The content is also limited to 255 characters. Ensure that the content is visible and fits within the allocated space in the PDF. This helps maintain consistency in the formatting.",
    },
    {
      title: "Back Office Notes",
      content:
        "This is an example of back office notes. Like the other sections, this note is limited to 255 characters for testing purposes. Adjust the content as necessary to fit the design of the PDF layout.",
    },
  ];

  const getPdfData = async (id) => {
    const token = Cookies.get("authToken");
    const requestId = id;
    const apiUrl = `${process.env.NEXT_PUBLIC_MAP_KEY}/api/requests/getPdfData`; // API URL for POST request

    try {
      const response = await fetch(apiUrl, {
        method: "POST", // Change the method to POST
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify({ id: requestId }), // Send the id in the body as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setViewCard(data);
      return data; // Return the response data
    } catch (error) {
      console.error("Error fetching PDF data:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  const downloadExcel = async (id) => {
    console.log("id", id);
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm", // Use millimeters for precision
      format: "a3", // A3 paper size for larger width
    });

    const data = await getPdfData(id); // Wait for the async data to be fetched
    // Title bar with navy blue background
    doc.setFillColor(31, 78, 121); // Dark blue color
    doc.rect(0, 0, 420, 15, "F"); // Adjusted width for landscape mode

    // Title text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("MAAREYNTA GACANKA ISGAARSIINTA", 200, 10, { align: "center" });

    // Reset text color and font for content
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let y = 25;
    doc.text(`Adeegga  ${headerData.adeegga}`, 20, y);
    doc.setTextColor(39, 174, 96); // Green color
    doc.text("Type (Prog /new)", 100, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Date Received", 230, y);
    doc.setTextColor(39, 174, 96); // Green color
    doc.text("Date Pickup", 350, y);

    y += 10;

    // Set the color to black
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Codsi Ka Yimid", 20, y);

    // Set the text color to green for the next texts
    doc.setTextColor(39, 174, 96); // Green color
    doc.text("Extracted From Name Of Request", 100, y);

    doc.text("Add Request form Date", 230, y);

    // Set the text color to red for "Date of Transaction Closing"
    doc.setTextColor(231, 76, 60); // Red color
    doc.text("Date of Transaction Closing", 350, y);

    y += 10;
    doc.setTextColor(0, 0, 0);
    doc.text("Hogg/Qeybta/Fadhiga/Saldhigga", 20, y);
    doc.setTextColor(39, 174, 96); // Green color
    doc.text("Extracted from Organization", 100, y);
    doc.text("maybe stays empty and is filled manually", 550, y, {
      align: "right",
    });

    y += 10;
    doc.setTextColor(0, 0, 0);
    doc.text("TRANSACTION REF NO", 20, y);
    doc.setTextColor(39, 174, 96); // Green color
    doc.text("(Auto-generated: SPF-ICT-1234)", 100, y);

    // Equipment Table
    const equipmentHeaders = [
      ["Model", "Serial NO", "ID", "Code Sign", "CodePlug", "CH"],
    ];

    const equipmentData = mainTableData.map((item) => [
      item.model,
      item.serialNo,
      item.id,
      item.codeSign,
      item.codePlug,
      item.ch,
    ]);

    doc.autoTable({
      startY: y + 15,
      head: equipmentHeaders,
      body: equipmentData,
      theme: "grid",
      headStyles: {
        fillColor: [65, 105, 225], // Royal blue
        textColor: [255, 255, 255],
        fontSize: 12,
        halign: "center",
      },
      styles: {
        cellPadding: 4,
        fontSize: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        halign: "center",
      },
      margin: { left: 20, right: 20 }, // Adjusted for landscape width
    });

    // Signature Table
    const signatureHeaders = [["Title", "Magaca", "Saxiixa", "Tarikh"]];
    const signatureTableData = signatureData.map((item) => [
      item?.name || "Stays Empty",
      item.magaca || "Stays Empty",
      item.saxiixa || "Stays Empty", // Use ellipsis if the signature is empty
      item.tarikh || "Stays Empty",
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: signatureHeaders,
      body: signatureTableData,
      theme: "grid",
      headStyles: {
        fillColor: [65, 105, 225], // Royal blue
        textColor: [255, 255, 255],
        fontSize: 12,
        halign: "center",
      },
      styles: {
        cellPadding: 4,
        fontSize: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        halign: "center",
      },
      columnStyles: {
        0: { fillColor: [255, 255, 255], halign: "center" }, // Center align column 0
        1: { fillColor: [240, 240, 240], halign: "center" }, // Center align column 1
        2: { fillColor: [255, 255, 255], halign: "center" }, // Center align column 2
      },
      margin: { left: 20, right: 20 },
    });

    // Notes Section
    let notesY = doc.lastAutoTable.finalY + 15;

    // Set table headers
    const noteHeaders = [["Notes", "Content"]];

    // Prepare data for the table
    const noteTableData = dummyNotes.map((note) => [
      note.title,
      note.content.length > 255 ? note.content.substring(0, 255) : note.content, // Limit content to 255 chars
    ]);

    doc.autoTable({
      startY: notesY, // Start after the previous content
      head: noteHeaders, // Table headers
      body: noteTableData, // Data for the table
      theme: "grid", // Apply grid style
      headStyles: {
        fillColor: [65, 105, 225], // Royal blue for header
        textColor: [255, 255, 255], // White text for header
        fontSize: 12,
        halign: "center", // Center align header text
      },
      styles: {
        cellPadding: 5, // Padding inside each cell
        fontSize: 10, // Font size for table cells
        lineColor: [0, 0, 0], // Black border color
        lineWidth: 0.1, // Thin border lines
        halign: "left", // Left align text in cells
      },
      columnStyles: {
        0: { halign: "center" }, // Center the title column
        1: { halign: "left" }, // Left align content column
      },
      margin: { left: 20, right: 20 }, // Adjust margins for landscape format
    });

    // Save the PDF
    doc.save("MAAREYNTA_GACANKA_ISGAARSIINTA.pdf");
  };

  return (
    <>
      <div className="mt-8 flow-root z-10">
        <ToastContainer />
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle px-4">
            {/* Search Input */}
            {searchEnabled && (
              <div className="relative z-10 flex rounded-md shadow-lg bg-white outline-1 outline-gray-300 max-w-sm mb-6">
                <input
                  type="text"
                  className="block w-full border-2 rounded-md pl-10 pr-4 py-2 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                                  {row.request_status === "complete" && (
                                    <button
                                      className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition-all"
                                      onClick={handleDownload}
                                    >
                                      <FaDownload className="w-5 h-5" />
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
                                  {row.request_status === "complete" && (
                                    <div>
                                      <button
                                        className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all items-center"
                                        onClick={() => frontpdfOpen(row)}
                                      >
                                        <FaEdit className="w-6 h-8" />
                                      </button>
                                    </div>
                                  )}

                                  {row.request_status === "complete" && (
                                    <button
                                      className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition-all"
                                      onClick={handleDownload}
                                    >
                                      <FaDownload className="w-5 h-5" />
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
                                      <button
                                        className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer transition-all"
                                        onClick={() => handleEditClick(row)}
                                      >
                                        <FaEdit className="w-5 h-5" />
                                      </button>
                                      <button
                                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition-all"
                                        onClick={handleDownload}
                                      >
                                        <FaDownload className="w-5 h-5" />
                                      </button>
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
                                    <MdPictureAsPdf className="w-6 h-8 flex items-center" />
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
                            new Date(row[column.key]).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false, // 24-hour format
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

        {frontOfficePDF && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-10"
            style={{
              animation: frontOfficePDF
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
