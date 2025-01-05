import Sidebar from '@/components/Sidebar'
import React from 'react'

const Backofficetodos = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-white flex">
    {/* Sidebar Component */}
    <Sidebar className="w-64 min-h-screen fixed top-0 left-0 bg-white shadow-md" />
      
      {/* Main Content Area */}
      <div className="lg:ml-72 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pending Requests</h1>
            <p className="mt-2 text-gray-600">Manage and review pending requests</p>
          </div>

          {/* Content Container */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Total Pending</h3>
                <p className="text-3xl font-bold text-indigo-600">24</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">High Priority</h3>
                <p className="text-3xl font-bold text-orange-600">8</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Processing</h3>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 px-4 font-semibold text-gray-600">Request ID</th>
                    <th className="pb-4 px-4 font-semibold text-gray-600">Title</th>
                    <th className="pb-4 px-4 font-semibold text-gray-600">Status</th>
                    <th className="pb-4 px-4 font-semibold text-gray-600">Priority</th>
                    <th className="pb-4 px-4 font-semibold text-gray-600">Date</th>
                    <th className="pb-4 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample table rows - replace with your actual data */}
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">#REQ-001</td>
                    <td className="py-4 px-4">Equipment Request</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        High
                      </span>
                    </td>
                    <td className="py-4 px-4">2024-12-29</td>
                    <td className="py-4 px-4">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                        Review
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">#REQ-002</td>
                    <td className="py-4 px-4">Software License</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Low
                      </span>
                    </td>
                    <td className="py-4 px-4">2024-12-28</td>
                    <td className="py-4 px-4">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                        Review
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>  )
}

export default Backofficetodos