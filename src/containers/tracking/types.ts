export interface TrackingDataItem {
  trackingNo: string;
  carrier: string;
  status: string;
  weightsG: number | string; // Can be number or formatted string (e.g., "500g")
  order: string;
  date: string;
  orderId?: string; // Optional orderId for payment status check
}
