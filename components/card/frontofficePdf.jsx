import React from "react";

const FrontOfficeBackOfficePDF = ({ data, userRole }) => {
  const {
    front_office_pdf,
    back_office_pdf,
    front_office_notes,
    back_office_notes,
    request_status,
  } = data;

  // Get the correct PDF URL based on user role
  const getPdfUrl = () => {
    if (userRole === "backoffice" && front_office_pdf) {
      return front_office_pdf; // Show front office PDF for backoffice users
    } else if (userRole === "frontoffice" && back_office_pdf) {
      return back_office_pdf; // Show back office PDF for front office users
    } else {
      return null; // No PDF available
    }
  };

  const pdfUrl = getPdfUrl();

  return (
    <div className="space-y-4">
      {/* Display the PDF */}
      {pdfUrl ? (
        <div>
          {userRole === "backoffice"
            ? "Download Front Office PDF:"
            : "Download Back Office PDF:"}
          <a
            href={`/uploads/${pdfUrl}`} // Assuming the PDF files are stored in the 'uploads' folder
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View/Download PDF
          </a>
        </div>
      ) : (
        <div>No PDF available for this role.</div>
      )}
    </div>
  );
};

export default FrontOfficeBackOfficePDF;
