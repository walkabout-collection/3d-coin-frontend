import { User } from "@/src/services/api/apiTypes";

export interface Quote {
  id: number;
  name: string;
  orderNo: string;
  email: string;
  label: string;
  createdAt: string;
  status: string;
  user?: User;
  orderId: string;
}