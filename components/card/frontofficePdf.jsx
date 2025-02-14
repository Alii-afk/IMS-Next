import React from "react";

const FrontOfficeBackOfficePDF = ({ data }) => {
  const { front_office_pdf, back_office_pdf } = data;

  return (
    <div className="space-y-4">
      {/* Display Front Office PDF if available */}
      {front_office_pdf && (
        <div>
          Front Office PDF:
          <a
            href={`${process.env.NEXT_PUBLIC_MAP_KEY}${front_office_pdf}`} // Assuming the PDF files are stored in the 'uploads' folder
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View/Download PDF
          </a>
        </div>
      )}
      {/* Display Back Office PDF if available */}
      {back_office_pdf && (
        <div>
          Back Office Signed PDF:
          <a
            href={`${process.env.NEXT_PUBLIC_MAP_KEY}${back_office_pdf}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View/Download PDF
          </a>
        </div>
      )}

      {/* Display message if no PDFs are available */}
      {!front_office_pdf && !back_office_pdf && (
        <div>No PDFs available.</div>
      )}
    </div>
  );
};

export default FrontOfficeBackOfficePDF;
