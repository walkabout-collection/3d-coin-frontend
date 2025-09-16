import Table from '@/src/components/common/Table';
import { TableColumn } from '@/src/components/common/Table/types';
import { TrackingData } from './data';
import { TrackingDataItem } from './types';

const Tracking = () => {
  const orderColumns: TableColumn<TrackingDataItem>[] = [
    { key: 'trackingNo', label: 'Tracking No.', width: 'w-32' },
    { key: 'carrier', label: 'Carrier', width: 'w-24' },
    { key: 'status', label: 'Status', width: 'w-28' },
    { key: 'weightsG', label: 'Weights (G)', width: 'w-24' },
    { key: 'order', label: 'Order', width: 'w-20' },
    { key: 'date', label: 'Date', width: 'w-32' },
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tracking</h1>
      <Table
        columns={orderColumns}
        data={TrackingData}
        alternatingRows={true}
        searchable={true}
        searchPlaceholder="Search orders..."
      />
    </div>
  );
};

export default Tracking;