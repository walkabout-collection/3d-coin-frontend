'use client';
import React, { useState } from 'react';
import Table from '@/src/components/common/Table';
import { TableColumn } from '@/src/components/common/Table/types';
import { orderData } from './data';
import { OrderDataItem } from './types';
import PayNowModal from '@/src/components/PayNowModal';

const Orders = () => {
  const [data, setData] = useState(orderData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDataItem | null>(null);

  const handlePayNowClick = (row: OrderDataItem) => {
    setSelectedOrder(row);
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async (trackingNo: string) => {
    try {
      await fetch('/api/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNo, status: 'APPROVED' }),
      });
      setData((prevData) =>
        prevData.map((order) =>
          order.trackingNo === trackingNo ? { ...order, status: 'APPROVED' } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const orderColumns: TableColumn<OrderDataItem>[] = [
    { key: 'trackingNo', label: 'Order No.', width: 'w-42' },
    { key: 'packaging', label: 'Packaging', width: 'w-28' },
    { key: 'order', label: 'Order', width: 'w-32' },
    { key: 'date', label: 'Date', width: 'w-35' },
    { key: 'status', label: 'Status', width: 'w-38' },
    { key: 'paymentMethod', label: 'Payment Method', width: 'w-52' },
    { key: 'price', label: 'Price', width: 'w-42', render: (value) => `$${Number(value).toFixed(2)}` },
  ];

  const actions: { label: string; onClick?: (row: OrderDataItem) => void; variant?: 'primary' | 'secondary' | 'danger' | 'success'; show?: (row: OrderDataItem) => boolean }[] = [
    {
      label: 'Pay Now',
      onClick: handlePayNowClick,
      variant: 'primary',
      show: (row: OrderDataItem) => row.status === 'PENDING' && row.paymentMethod === 'MANUAL',
    },
    {
      label: 'Paid',
      variant: 'success', 
      show: (row: OrderDataItem) => row.status === 'APPROVED' && row.paymentMethod === 'MANUAL',
    },
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h1>
      <Table
        columns={orderColumns}
        data={data}
        alternatingRows={true}
        searchable={true}
        searchPlaceholder="Search orders..."
        sortable={true}
        currentSort="newest"
        showActions={true}
        actions={actions}
      />
      {selectedOrder && (
        <PayNowModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trackingNo={selectedOrder.trackingNo}
          price={selectedOrder.price}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default Orders;