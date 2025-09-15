"use client";
import React, { useState, useMemo } from "react";
import { ordersData } from "./data";
import Search from "@/src/components/common/search";

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const results = ordersData.filter((order) =>
      order.orderNumber.toLowerCase().includes(value.toLowerCase()) ||
      order.customerName.toLowerCase().includes(value.toLowerCase()) ||
      order.status.toLowerCase().includes(value.toLowerCase())
    );

    console.log("Search term:", value);
    console.log("Filtered Orders:", results);
  };

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      
      {/* Search Component */}
      <div className="mb-6">
        <Search
          placeholder="Search by order number, customer, or status..."
          onSearch={handleSearch}
          variant="primary"
          rounded={true}
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 border-b">Order #</th>
              <th className="py-3 px-4 border-b">Customer</th>
              <th className="py-3 px-4 border-b">Date</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 border-b">{order.orderNumber}</td>
                  <td className="py-3 px-4 border-b">{order.customerName}</td>
                  <td className="py-3 px-4 border-b">{order.date}</td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">${order.total.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
