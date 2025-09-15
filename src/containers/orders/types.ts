export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  date: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  total: number;
}