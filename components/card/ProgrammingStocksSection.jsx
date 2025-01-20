const ProgrammingStocksSection = ({ currentRowData, userRole, editableField, setEditableField }) => {
    if (!currentRowData.programming_stocks?.length) return null;
  
    return (
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Programming Stocks</h3>
        {currentRowData.programming_stocks.map((stock) => (
          <div key={stock.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-md font-semibold text-gray-800">{stock.product_name}</h4>
              <span className="text-sm text-gray-500">Product ID: {stock.product_id}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Serial No:</span>
                <span className="text-sm font-medium">{stock.serial_no}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description:</p>
                {userRole === "backoffice" && (
                  <button
                    onClick={() =>
                      setEditableField((prev) => ({
                        ...prev,
                        [stock.id]: {
                          ...prev[stock.id],
                          editable: !prev[stock.id].editable,
                        },
                      }))
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {editableField[stock.id]?.editable ? (
                      <AiOutlineCheck className="w-5 h-5" />
                    ) : (
                      <FileEdit className="w-5 h-5" />
                    )}
                  </button>
                )}
                {editableField[stock.id]?.editable ? (
                  <textarea
                    value={editableField[stock.id]?.description}
                    onChange={(e) =>
                      setEditableField((prev) => ({
                        ...prev,
                        [stock.id]: {
                          ...prev[stock.id],
                          description: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Enter description..."
                  />
                ) : (
                  <p className="text-sm text-gray-700">
                    {stock.description || "No description available"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };


  export default ProgrammingStocksSection;