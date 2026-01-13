import { User } from "@/src/services/api/apiTypes";

export interface Quote {
  status: string;
  user: User;
  orderId: string;
  id: string;
  name: string;
  orderNo: string;
  email: string;
  label: string;
  createdAt: string;
  totalCoins?: number;
}
