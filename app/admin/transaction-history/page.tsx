import type { Metadata } from "next";
import AdminTransactionHistory from "@/src/containers/admin/transaction-history";

export const metadata: Metadata = {
  title: "Transaction History | Legacy Forge",
  description: "Review the full transaction history across all accounts.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function TransactionHistoryPage() {
  return <AdminTransactionHistory />;
}
