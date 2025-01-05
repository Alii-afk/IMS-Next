import { columns, peoples } from "@/components/dummyData/FormData";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/table";
import React from "react";

const AcceptedRequest = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-white flex">
      {/* Sidebar Component */}
      <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md" />

      <div className="md:ml-72 lg:ml-0 flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm ">
          <div className="flex max-w-7xl mx-auto px-6 md:items-start items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Accepted Request
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex-1  bg-white shadow-sm">
            <div className="flex max-w-7xl mx-auto md:items-start items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">
                Accepted Request
              </h1>
            </div>
            <div className="px-6">
              <Table columns={columns} data={peoples} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedRequest;
