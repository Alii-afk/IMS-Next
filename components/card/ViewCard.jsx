import React, { useState } from 'react';

const NotesCard = ({ title, notes, maxLength = 15 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const truncatedNotes = notes && notes.length > maxLength 
    ? `${notes.substring(0, maxLength)}...` 
    : notes || `No ${title.toLowerCase()} notes available`;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{truncatedNotes}</p>
      
      {notes && notes.length > maxLength && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
        >
          See More
          <svg 
            className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl transform transition-all">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                {title}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ViewCard = ({
  selectedRow,
  currentRowData,
  userRole,
  setSelectedRow,
}) => {
  if (!selectedRow || !currentRowData) return null;

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/30";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 ring-red-500/30";
      case "approved":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/30";
      case "complete":
        return "bg-green-50 text-green-700 border-green-200 ring-green-500/30";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/30";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-50 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
            Request Details
          </h2>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize border ring-2 ring-opacity-20 ${getStatusClasses(
              currentRowData?.request_status
            )}`}
          >
            {currentRowData?.request_status?.replace(/\_/g, " ") || "No status"}
          </span>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)] custom-scrollbar">
          <div className="space-y-6">
            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {currentRowData.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Organization</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {currentRowData.organization || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date & Time</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {currentRowData.date_time
                      ? new Date(currentRowData.date_time).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {currentRowData.type || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="grid md:grid-cols-3 gap-4">
              <NotesCard 
                title="Front Office Notes" 
                notes={currentRowData.front_office_notes}
              />
              <NotesCard 
                title="Admin Notes" 
                notes={currentRowData.admin_notes}
              />
              <NotesCard 
                title="Back Office Notes" 
                notes={currentRowData.back_office_notes}
              />
            </div>

            {/* Warehouse Stocks */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">Warehouse Stocks</h3>
              </div>
              <div className="grid gap-4">
                {currentRowData.warehouse_stocks?.map((stock) => (
                  <div 
                    key={stock.id} 
                    className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Name:</span>
                          <span className="text-gray-600 ml-2">{stock.name}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Manufacturer:</span>
                          <span className="text-gray-600 ml-2">{stock.manufacturer}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Model:</span>
                          <span className="text-gray-600 ml-2">{stock.model_name}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Serial No:</span>
                          <span className="text-gray-600 ml-2">{stock.serial_no}</span>
                        </p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Sign Code:</span>
                          <span className="text-gray-600 ml-2">{stock.sign_code}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Codeplug:</span>
                          <span className="text-gray-600 ml-2">{stock.codeplug}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Unit:</span>
                          <span className="text-gray-600 ml-2">{stock.unit}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className="text-gray-600 ml-2">{stock.status}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="border-t bg-white px-6 py-4 flex justify-end sticky bottom-0">
          <button
            onClick={() => setSelectedRow(false)}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            Close
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default ViewCard;