import { User } from "@/src/services/api/apiTypes";
import { PaymentMethod } from "../admin/order-history/types";

export interface CoinDesign {
  id: string;
  userId: string;
  name: string;
  status: string;
  totalCoins: number;
  imageUrl: string | null;
  prompt: string | null;
  is3DGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Packaging {
  id: string;
  description: string;
  referenceImg?: string | null;
  text?: string;
  userId: string;
  createdAt: string;
}


export interface Quote {
  id: string;
  email: string | null;
  status: string;
  amount: number | null;
  createdAt: string;
  feedback: string;
  method: PaymentMethod
  orderId: string | null;
  packaging?: Packaging;
  packagingId: string | null;
  totalCoins: number;
  coinDesignId: string;
  designStatus: string;
  coinDesign: CoinDesign;
  userId: string;
  user?: User;
}