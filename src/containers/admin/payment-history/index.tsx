import { TableColumn } from '@/src/components/common/Table/types';
import { paymentData } from './data';
import { PaymentDataItem } from './types';
import AdminTable from '@/src/components/admin/AdminTable';

const AdminPaymentHistory = () => {
  const paymentColumns: TableColumn<PaymentDataItem>[] = [
    { key: 'paymentMethod', label: 'Payment Method', width: 'w-32' },
    { key: 'order', label: 'Order', width: 'w-20' },
    { key: 'total', label: 'Total', width: 'w-24' },
    { key: 'date', label: 'Date', width: 'w-32' },
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Payment History</h1>
      <AdminTable
        columns={paymentColumns}
        data={paymentData}
        alternatingRows={true}
        searchable={true}
        searchPlaceholder="Search payments..."
        sortable={true}
        currentSort="newest"
      />
    </div>
  );
};

export default AdminPaymentHistory;