'use client';
import { TableColumn } from '@/src/components/common/Table/types';
import { orderData } from './data';
import { OrderDataItem } from './types';
import AdminTable from '@/src/components/admin/AdminTable';

const OrdersHistory = () => {
  const orderColumns: TableColumn<OrderDataItem>[] = [
    { key: 'trackingNo', label: 'Order No.', width: 'w-32' },
    { key: 'packaging', label: 'Packaging', width: 'w-24', },
    { key: 'order', label: 'Order', width: 'w-20' },
    { key: 'date', label: 'Date', width: 'w-32' },
    { key: 'payment', label: 'Payment', width: 'w-32' },
    { key: 'status', label: 'Status', width: 'w-28' },
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h1>
      <AdminTable
        columns={orderColumns}
        data={orderData}
        alternatingRows={true}
        searchable={true}
        searchPlaceholder="Search orders..."
        sortable={true}
        currentSort="newest"
        pagination={    
          {
            currentPage: 1,
            entriesPerPage: 10,
            totalEntries: orderData.length,
            totalPages: Math.ceil(orderData.length / 10),
            onPageChange: (page: number) => {
              console.log(`Current page: ${page}`);
            },
          }
        }
      />
    </div>
  );
};

export default OrdersHistory;