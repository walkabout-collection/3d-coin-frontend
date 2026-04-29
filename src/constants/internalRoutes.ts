import type { Metadata } from "next";

export const noindexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export const internalRoutes = {
  DRAFTS: {
    title: "Drafts | Legacy Forge",
    description:
      "Your private workspace for in-progress coin designs. Save, revisit, and refine custom 3D coin concepts before placing an order with Legacy Forge. Drafts are tied to your account and are never shared publicly or shown in search results.",
  },
  DRAFT_DETAIL: {
    title: "Draft Detail | Legacy Forge",
    description:
      "Review the full specifications of a saved coin design draft, including dimensions, materials, edge style, text rings, and artwork. Pick up exactly where you left off and move your custom coin closer to production.",
  },
  DRAFT_EDIT: {
    title: "Edit Draft | Legacy Forge",
    description:
      "Continue editing your custom coin draft on Legacy Forge. Adjust dimensions, materials, edges, text rings, and artwork in our 3D builder before submitting your design for a quote or order.",
  },
  PAYMENT: {
    title: "Payment | Legacy Forge",
    description:
      "Secure payment processing for Legacy Forge custom coin orders. This area handles checkout flows, payment confirmations, and integration callbacks, and is restricted to authenticated user sessions only.",
  },
  PAYMENT_CANCEL: {
    title: "Payment Cancelled | Legacy Forge",
    description:
      "Your payment was cancelled before it could be completed. No charge was made. You can return to your quote at any time and finish checkout when you are ready to place your custom coin order.",
  },
  PAYMENT_SUCCESS: {
    title: "Payment Successful | Legacy Forge",
    description:
      "Your payment has been received and your custom coin order has been confirmed. You will receive an email receipt with the next steps and a link to track production progress from your account dashboard.",
  },
  PAYMENT_QB_SUCCESS: {
    title: "QuickBooks Connected | Legacy Forge",
    description:
      "Your QuickBooks account has been successfully connected to Legacy Forge. Invoices and payment records will now sync automatically so your accounting team always has up-to-date order data.",
  },
  PAYMENT_QB_ERROR: {
    title: "QuickBooks Connection Failed | Legacy Forge",
    description:
      "We could not complete the QuickBooks connection for your Legacy Forge account. Review the error details, retry the connection, or contact support if the issue persists.",
  },
  SETTINGS: {
    title: "Settings | Legacy Forge",
    description:
      "Manage account-level settings and integrations for Legacy Forge, including QuickBooks connection status, billing preferences, and other configuration options that apply across your account.",
  },
  SETTINGS_QUICKBOOKS: {
    title: "QuickBooks Integration | Legacy Forge",
    description:
      "Manage your Legacy Forge QuickBooks integration. Connect, disconnect, or review the status of QuickBooks for invoice and payment syncing across your custom coin orders.",
  },
  ADMIN_PENDING_PAYMENTS: {
    title: "Pending Payments | Legacy Forge Admin",
    description:
      "Internal admin view for monitoring pending payments across all Legacy Forge customers. Review payments awaiting reconciliation, identify stuck transactions, and take action before orders move into production.",
  },
  ADMIN_TRANSACTION_HISTORY: {
    title: "Transaction History | Legacy Forge Admin",
    description:
      "Internal admin view of the complete transaction history across all Legacy Forge customer accounts. Audit payments, refunds, and QuickBooks sync activity for any time range.",
  },
  DASHBOARD_TRACKING: {
    title: "Order Tracking | Legacy Forge",
    description:
      "Track the production and shipping progress of your custom Legacy Forge coin orders. View milestones from design approval through manufacturing, quality control, packaging, and final delivery.",
  },
} as const;
