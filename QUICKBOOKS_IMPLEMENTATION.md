# QuickBooks Implementation Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [OAuth Flow](#oauth-flow)
4. [API Endpoints](#api-endpoints)
5. [React Hooks](#react-hooks)
6. [Components](#components)
7. [Error Handling](#error-handling)
8. [Usage Examples](#usage-examples)
9. [Admin Features](#admin-features)
10. [Best Practices](#best-practices)

---

## Overview

This document describes the QuickBooks integration implementation in the 3D Coin Frontend application. The integration allows users to:

- Connect their QuickBooks account via OAuth 2.0
- Create invoices in QuickBooks from approved quotes
- Sync payment transactions between the platform and QuickBooks
- View transaction history
- Manage QuickBooks connections

### Key Features

- **OAuth 2.0 Authentication**: Secure connection to QuickBooks accounts
- **Invoice Creation**: Automatically create invoices from approved quotes
- **Payment Sync**: Synchronize payment transactions
- **Transaction Management**: View and manage QuickBooks transactions
- **Admin Dashboard**: Comprehensive admin tools for managing connections and syncs

---

## Architecture

### File Structure

```
src/
├── hooks/
│   ├── useQuickBooks.ts          # Main QuickBooks hook
│   └── useQueries.ts             # React Query hooks for QuickBooks
├── services/
│   └── apiServices.ts            # API service functions
├── utils/
│   └── quickbooksErrors.ts       # Error message mappings
├── components/
│   └── QuickBooks/
│       ├── QuickBooksPaymentModal.tsx
│       └── CreateQuickBooksInvoice.tsx
└── app/
    ├── payment/
    │   └── quickbooks/           # OAuth callback handler
    └── settings/
        └── quickbooks/           # Settings/disconnect page
```

### Technology Stack

- **React Query** (`@tanstack/react-query`): Data fetching and caching
- **Next.js**: Framework and routing
- **TypeScript**: Type safety
- **Axios**: HTTP client for API calls

---

## OAuth Flow

### 1. Initiate Connection

When a user wants to connect their QuickBooks account:

```typescript
const { connect } = useQuickBooks();

// This will redirect to QuickBooks OAuth page
connect();
```

**Backend Flow:**

1. Frontend calls `POST /quickbooks/connect`
2. Backend generates OAuth authorization URL
3. User is redirected to QuickBooks authorization page
4. User grants permissions
5. QuickBooks redirects back to `/payment/quickbooks/callback`

### 2. OAuth Callback

The callback handler (`/app/payment/quickbooks/callback/page.tsx`) processes the OAuth response:

```typescript
// Extracts code and realmId from URL params
// Calls backend to exchange code for tokens
// Stores tokens securely on backend
// Redirects user to success page
```

### 3. Token Management

- Access tokens and refresh tokens are stored securely on the backend
- Tokens are automatically refreshed when expired
- Connection status is checked via `GET /quickbooks/status`

---

## API Endpoints

### User Endpoints

#### 1. Get Connection Status

```typescript
GET /quickbooks/status

Response:
{
  success: boolean;
  data: {
    connected: boolean;
    expired: boolean;
    connectedAt?: string;
    expiresAt?: string;
    companyId?: string;
  };
}
```

#### 2. Connect QuickBooks

```typescript
POST /quickbooks/connect

Response:
{
  success: boolean;
  data: {
    authUri: string;  // OAuth authorization URL
  };
  message?: string;
}
```

#### 3. Disconnect QuickBooks

```typescript
POST /quickbooks/disconnect

Response:
{
  success: boolean;
  message?: string;
}
```

#### 4. Create Invoice

```typescript
POST /quickbooks/invoice/create

Request Body:
{
  quoteId: string;
  amount: number;
}

Response:
{
  success: boolean;
  data: {
    invoiceId: string;
    invoiceNumber?: string;
    quickbooksInvoiceId: string;
    status: string;
    paymentId: string;
  };
  message?: string;
}
```

#### 5. Get Invoice Status

```typescript
GET /quickbooks/invoice/:invoiceId/status

Response:
{
  success: boolean;
  data: {
    invoiceId: string;
    quickbooksInvoiceId: string;
    status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
    amount: number;
    amountPaid: number;
    amountDue: number;
    dueDate?: string;
    paidDate?: string;
  };
}
```

#### 6. Get Transactions

```typescript
GET /quickbooks/transactions?limit=10&offset=0

Response:
{
  success: boolean;
  data: {
    transactions: Array<{
      id: string;
      date: string;
      amount: number;
      description: string;
      type: "INVOICE" | "PAYMENT" | "EXPENSE";
      status: string;
      customerName?: string;
    }>;
    total: number;
    hasMore: boolean;
  };
}
```

#### 7. Sync Transactions

```typescript
POST /quickbooks/sync

Response:
{
  success: boolean;
  data: {
    syncedCount: number;
    lastSyncAt: string;
  };
  message?: string;
}
```

### Admin Endpoints

#### 1. Get All Connections

```typescript
GET /admin/quickbooks/connections

Response:
{
  success: boolean;
  data: QuickBooksConnection[];
}
```

#### 2. Get Sync Status

```typescript
GET /admin/quickbooks/sync-status

Response:
{
  success: boolean;
  data: {
    total: number;
    statusCounts: {
      SYNCED: number;
      PENDING: number;
      FAILED: number;
      NOT_SYNCED: number;
    };
    payments: Payment[];
  };
}
```

#### 3. Sync Payment

```typescript
POST /admin/quickbooks/sync-payment/:paymentId

Response:
{
  success: boolean;
  message?: string;
}
```

#### 4. Get Errors

```typescript
GET /admin/quickbooks/errors

Response:
{
  success: boolean;
  data: QuickBooksSyncError[];
}
```

#### 5. Map Transaction

```typescript
POST /admin/quickbooks/map-transaction

Request Body:
{
  transactionId: string;
  orderId: string;
}

Response:
{
  success: boolean;
  message?: string;
}
```

#### 6. Retry Failed Syncs

```typescript
POST / admin / quickbooks / retry - failed - syncs;

Response: {
  success: boolean;
  data: {
    retriedCount: number;
  }
}
```

---

## React Hooks

### Main Hook: `useQuickBooks`

The primary hook that provides a unified interface for all QuickBooks operations:

```typescript
import { useQuickBooks } from "@/src/hooks/useQuickBooks";

const {
  // Status
  status,
  isConnected,
  isExpired,
  connectedAt,
  expiresAt,
  statusLoading,
  statusError,

  // Connection
  connect,
  disconnect,
  isConnecting,
  isDisconnecting,

  // Invoice
  createInvoice,
  isCreatingInvoice,
  createInvoiceError,

  // Transactions
  transactions,
  transactionsLoading,
  refetchTransactions,

  // Sync
  syncTransactions,
  isSyncing,

  // Utilities
  refetchStatus,
} = useQuickBooks({
  autoRefresh: true,
  refreshInterval: 30000,
  onConnectionChange: (connected) => {
    console.log("Connection status:", connected);
  },
});
```

### Individual Hooks

#### Connection Status

```typescript
import { useQuickBooksStatus } from "@/src/hooks/useQueries";

const { data, isLoading, error, refetch } = useQuickBooksStatus();
```

#### Connect QuickBooks

```typescript
import { useConnectQuickBooks } from "@/src/hooks/useQueries";

const { mutate: connect, isPending } = useConnectQuickBooks({
  onSuccess: (response) => {
    if (response.success && response.data?.authUri) {
      window.location.href = response.data.authUri;
    }
  },
  onError: (error) => {
    console.error("Connection failed:", error);
  },
});
```

#### Disconnect QuickBooks

```typescript
import { useDisconnectQuickBooks } from "@/src/hooks/useQueries";

const { mutate: disconnect, isPending } = useDisconnectQuickBooks({
  onSuccess: () => {
    toast.success("QuickBooks disconnected");
  },
});
```

#### Create Invoice

```typescript
import { useCreateQuickBooksInvoice } from "@/src/hooks/useQueries";

const { mutate: createInvoice, isPending } = useCreateQuickBooksInvoice({
  onSuccess: (response) => {
    if (response.success) {
      toast.success("Invoice created successfully!");
    }
  },
});

// Usage
createInvoice({
  quoteId: "quote-123",
  amount: 1000.0,
});
```

#### Get Invoice Status

```typescript
import { useQuickBooksInvoiceStatus } from "@/src/hooks/useQueries";

const { data, isLoading } = useQuickBooksInvoiceStatus(invoiceId);
// Automatically polls every 10 seconds if status is PENDING
```

#### Get Transactions

```typescript
import { useQuickBooksTransactions } from "@/src/hooks/useQueries";

const { data, isLoading } = useQuickBooksTransactions({
  limit: 10,
  offset: 0,
});
```

#### Sync Transactions

```typescript
import { useSyncQuickBooksTransactions } from "@/src/hooks/useQueries";

const { mutate: sync, isPending } = useSyncQuickBooksTransactions({
  onSuccess: (response) => {
    toast.success(`Synced ${response.data?.syncedCount} transactions`);
  },
});
```

### Admin Hooks

```typescript
// Get all connections
const { data: connections } = useAdminQuickBooksConnections();

// Get sync status
const { data: syncStatus } = useAdminQuickBooksSyncStatus();

// Get errors
const { data: errors } = useAdminQuickBooksErrors();

// Sync payment
const { mutate: syncPayment } = useSyncAdminQuickBooksPayment();

// Map transaction
const { mutate: mapTransaction } = useMapAdminQuickBooksTransaction();

// Retry failed syncs
const { mutate: retryFailedSyncs } = useRetryAdminQuickBooksFailedSyncs();
```

---

## Components

### QuickBooksPaymentModal

A modal component for creating QuickBooks invoices from quotes:

```typescript
import QuickBooksPaymentModal from '@/src/components/QuickBooks/QuickBooksPaymentModal';

<QuickBooksPaymentModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  quoteId="quote-123"
  amount={1000.00}
  orderId="order-456"
  onPaymentSuccess={() => {
    // Handle successful payment
    router.push('/dashboard/orders');
  }}
/>
```

**Features:**

- Automatically checks connection status
- Opens OAuth modal if not connected
- Creates invoice when connected
- Polls invoice status until paid
- Shows loading states and error messages

### CreateQuickBooksInvoice

A button component for creating invoices:

```typescript
import CreateQuickBooksInvoice from '@/src/components/QuickBooks/CreateQuickBooksInvoice';

<CreateQuickBooksInvoice
  quoteId="quote-123"
  amount={1000.00}
  onSuccess={() => console.log('Invoice created')}
  disabled={false}
/>
```

---

## Error Handling

### Error Message Utility

The `getQuickBooksErrorMessage` function provides user-friendly error messages:

```typescript
import { getQuickBooksErrorMessage } from "@/src/utils/quickbooksErrors";

try {
  await createInvoice({ quoteId, amount });
} catch (error) {
  const message = getQuickBooksErrorMessage(error);
  toast.error(message);
}
```

### Error Codes

The error handler maps HTTP status codes and error messages:

- **400**: Bad Request
  - "Quote not approved"
  - "QuickBooks not connected"
  - "Payment already completed"
- **401**: Unauthorized
  - User must be logged in
- **403**: Forbidden
  - Insufficient permissions
- **404**: Not Found
  - Quote not found
- **500**: Server Error
  - "QuickBooks API error"
  - "Failed to create invoice"
  - "OAuth configuration error"
  - "Invalid redirect URI"

### Error Handling Best Practices

1. **Always use the error utility**:

   ```typescript
   const message = getQuickBooksErrorMessage(error);
   toast.error(message);
   ```

2. **Handle specific error cases**:

   ```typescript
   if (error.response?.status === 400) {
     // Handle bad request
   }
   ```

3. **Provide fallback messages**:
   ```typescript
   const message =
     getQuickBooksErrorMessage(error) || "An unexpected error occurred";
   ```

---

## Usage Examples

### Example 1: Connect QuickBooks Account

```typescript
'use client';

import { useQuickBooks } from '@/src/hooks/useQuickBooks';
import Button from '@/src/components/common/button/Button';

export default function ConnectQuickBooks() {
  const { connect, isConnecting, isConnected } = useQuickBooks();

  if (isConnected) {
    return <p>QuickBooks is connected!</p>;
  }

  return (
    <Button
      onClick={() => connect()}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect QuickBooks'}
    </Button>
  );
}
```

### Example 2: Create Invoice from Quote

```typescript
'use client';

import { useCreateQuickBooksInvoice } from '@/src/hooks/useQueries';
import { useQuickBooksStatus } from '@/src/hooks/useQueries';
import { toast } from 'react-toastify';

export default function CreateInvoiceButton({ quoteId, amount }) {
  const { data: status } = useQuickBooksStatus();
  const isConnected = status?.data?.connected ?? false;

  const { mutate: createInvoice, isPending } = useCreateQuickBooksInvoice({
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          `Invoice created! #${response.data.invoiceNumber}`
        );
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create invoice');
    }
  });

  const handleCreateInvoice = () => {
    if (!isConnected) {
      toast.error('Please connect QuickBooks first');
      return;
    }

    createInvoice({ quoteId, amount });
  };

  return (
    <button
      onClick={handleCreateInvoice}
      disabled={!isConnected || isPending}
    >
      {isPending ? 'Creating...' : 'Create Invoice'}
    </button>
  );
}
```

### Example 3: Display Transactions

```typescript
'use client';

import { useQuickBooksTransactions } from '@/src/hooks/useQueries';

export default function TransactionsList() {
  const { data, isLoading, error } = useQuickBooksTransactions({
    limit: 20,
    offset: 0
  });

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions</div>;

  const transactions = data?.data?.transactions || [];

  return (
    <div>
      <h2>QuickBooks Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <div>
              <strong>{transaction.description}</strong>
              <span>${transaction.amount}</span>
              <span>{transaction.type}</span>
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 4: Sync Transactions

```typescript
'use client';

import { useSyncQuickBooksTransactions } from '@/src/hooks/useQueries';
import { useQuickBooks } from '@/src/hooks/useQuickBooks';
import { toast } from 'react-toastify';

export default function SyncButton() {
  const { isConnected, syncTransactions, isSyncing } = useQuickBooks();

  const handleSync = () => {
    if (!isConnected) {
      toast.error('Please connect QuickBooks first');
      return;
    }

    syncTransactions();
  };

  return (
    <button
      onClick={handleSync}
      disabled={!isConnected || isSyncing}
    >
      {isSyncing ? 'Syncing...' : 'Sync Transactions'}
    </button>
  );
}
```

### Example 5: Complete Payment Flow with Invoice

```typescript
'use client';

import { useState } from 'react';
import { useQuickBooks } from '@/src/hooks/useQuickBooks';
import QuickBooksPaymentModal from '@/src/components/QuickBooks/QuickBooksPaymentModal';

export default function PaymentFlow({ quoteId, amount, orderId }) {
  const [showModal, setShowModal] = useState(false);
  const { isConnected } = useQuickBooks();

  const handlePaymentSuccess = () => {
    // Redirect or update UI after successful payment
    router.push('/dashboard/orders');
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Pay with QuickBooks
      </button>

      <QuickBooksPaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        quoteId={quoteId}
        amount={amount}
        orderId={orderId}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
```

---

## Admin Features

### Admin Dashboard Overview

The admin dashboard provides comprehensive tools for managing QuickBooks integrations:

1. **View All Connections**: See all users who have connected QuickBooks
2. **Monitor Sync Status**: Track payment synchronization status
3. **Handle Errors**: View and resolve sync errors
4. **Map Transactions**: Manually map unmapped transactions to orders
5. **Retry Failed Syncs**: Retry failed synchronization attempts

### Example: Admin Sync Status Page

```typescript
'use client';

import { useAdminQuickBooksSyncStatus } from '@/src/hooks/useQueries';
import { useSyncAdminQuickBooksPayment } from '@/src/hooks/useQueries';

export default function AdminSyncStatus() {
  const { data: syncStatus, isLoading } = useAdminQuickBooksSyncStatus();
  const { mutate: syncPayment } = useSyncAdminQuickBooksPayment();

  if (isLoading) return <div>Loading...</div>;

  const { total, statusCounts, payments } = syncStatus?.data || {};

  return (
    <div>
      <h1>QuickBooks Sync Status</h1>

      <div>
        <h2>Summary</h2>
        <p>Total: {total}</p>
        <p>Synced: {statusCounts?.SYNCED}</p>
        <p>Pending: {statusCounts?.PENDING}</p>
        <p>Failed: {statusCounts?.FAILED}</p>
        <p>Not Synced: {statusCounts?.NOT_SYNCED}</p>
      </div>

      <div>
        <h2>Payments</h2>
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Sync Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.userName} ({payment.userEmail})</td>
                <td>${payment.amount}</td>
                <td>{payment.status}</td>
                <td>{payment.syncStatus}</td>
                <td>
                  {payment.syncStatus !== 'SYNCED' && (
                    <button
                      onClick={() => syncPayment(payment.paymentId)}
                    >
                      Sync
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. Connection Status Checks

Always check connection status before performing QuickBooks operations:

```typescript
const { isConnected, isExpired } = useQuickBooks();

if (!isConnected || isExpired) {
  // Prompt user to connect
  return <ConnectPrompt />;
}
```

### 2. Error Handling

Always use the error utility for consistent error messages:

```typescript
import { getQuickBooksErrorMessage } from "@/src/utils/quickbooksErrors";

try {
  await createInvoice({ quoteId, amount });
} catch (error) {
  const message = getQuickBooksErrorMessage(error);
  toast.error(message);
}
```

### 3. Loading States

Provide clear loading feedback:

```typescript
{isCreatingInvoice && <Spinner />}
{isSyncing && <p>Syncing transactions...</p>}
```

### 4. Polling for Status

Use React Query's built-in polling for invoice status:

```typescript
const { data } = useQuickBooksInvoiceStatus(invoiceId);
// Automatically polls every 10 seconds if status is PENDING
```

### 5. Token Refresh

The backend handles token refresh automatically. The frontend should:

- Check connection status periodically
- Handle expired connections gracefully
- Prompt users to reconnect if needed

### 6. User Experience

- Show clear connection status indicators
- Provide helpful error messages
- Guide users through the OAuth flow
- Confirm actions before disconnecting

### 7. Security

- Never store tokens on the frontend
- Always use HTTPS for OAuth redirects
- Validate user permissions before operations
- Sanitize user input before API calls

### 8. Performance

- Use React Query caching to minimize API calls
- Implement pagination for transaction lists
- Debounce sync operations if needed
- Use optimistic updates where appropriate

---

## Troubleshooting

### Common Issues

#### 1. OAuth Redirect URI Mismatch

**Error**: "Invalid redirect URI"

**Solution**: Ensure the redirect URI in the backend environment variables matches exactly with the QuickBooks Developer Portal settings (case-sensitive, no trailing slashes).

#### 2. Connection Expired

**Error**: Connection status shows `expired: true`

**Solution**: User needs to reconnect their QuickBooks account. The tokens have expired and need to be refreshed.

#### 3. Invoice Creation Fails

**Error**: "Failed to create invoice"

**Possible Causes**:

- Quote not approved
- QuickBooks not connected
- Payment already completed
- Invalid quote ID or amount

**Solution**: Check quote status, connection status, and ensure the quote hasn't already been paid.

#### 4. Sync Errors

**Error**: "Failed to sync payment"

**Possible Causes**:

- No QuickBooks connection
- Invalid payment data
- QuickBooks API error

**Solution**: Check connection status, verify payment data, and check admin error logs.

---

## Environment Variables

### Backend Required Variables

```env
QUICKBOOKS_CLIENT_ID=your_client_id
QUICKBOOKS_CLIENT_SECRET=your_client_secret
QUICKBOOKS_REDIRECT_URI=https://yourdomain.com/payment/quickbooks/callback
QUICKBOOKS_ENVIRONMENT=sandbox  # or production
```

### Frontend Configuration

The frontend uses the API base URL from environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## API Service Functions

All QuickBooks API functions are located in `src/services/apiServices.ts`:

- `getQuickBooksStatus()`
- `connectQuickBooks()`
- `disconnectQuickBooks()`
- `createQuickBooksInvoice()`
- `getQuickBooksInvoiceStatus()`
- `getQuickBooksTransactions()`
- `syncQuickBooksTransactions()`
- `getAdminQuickBooksConnections()`
- `getAdminQuickBooksSyncStatus()`
- `syncAdminQuickBooksPayment()`
- `getAdminQuickBooksErrors()`
- `mapAdminQuickBooksTransaction()`
- `retryAdminQuickBooksFailedSyncs()`

---

## Testing

### Manual Testing Checklist

- [ ] Connect QuickBooks account
- [ ] Disconnect QuickBooks account
- [ ] Create invoice from approved quote
- [ ] Check invoice status
- [ ] View transactions
- [ ] Sync transactions
- [ ] Handle expired connection
- [ ] Error handling for various scenarios
- [ ] Admin dashboard features

### Test Scenarios

1. **Happy Path**: Connect → Create Invoice → Payment → Sync
2. **Error Handling**: Invalid quote, expired connection, API errors
3. **Edge Cases**: Multiple invoices, large transaction lists, network failures

---

## Future Enhancements

Potential improvements to the QuickBooks integration:

1. **Webhook Support**: Real-time updates from QuickBooks
2. **Batch Operations**: Create multiple invoices at once
3. **Advanced Filtering**: More transaction filtering options
4. **Export Functionality**: Export transactions to CSV/Excel
5. **Analytics Dashboard**: Visualize QuickBooks data
6. **Automated Sync**: Scheduled automatic synchronization
7. **Multi-Company Support**: Support for multiple QuickBooks companies

---

## Support

For issues or questions:

1. Check the error messages in the console
2. Review the error logs in the admin dashboard
3. Verify OAuth configuration
4. Check QuickBooks Developer Portal for API status
5. Contact the development team

---

## Changelog

### Version 1.0.0

- Initial QuickBooks integration
- OAuth 2.0 authentication
- Invoice creation
- Transaction synchronization
- Admin dashboard

---

## License

This implementation is part of the 3D Coin Frontend application.
