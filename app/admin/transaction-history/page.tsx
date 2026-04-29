import type { Metadata } from "next";
import { internalRoutes, noindexRobots } from "@/src/constants/internalRoutes";
import AdminTransactionHistory from "@/src/containers/admin/transaction-history";

export const metadata: Metadata = {
  ...internalRoutes.ADMIN_TRANSACTION_HISTORY,
  robots: noindexRobots,
};

export default function TransactionHistoryPage() {
  return <AdminTransactionHistory />;
}
