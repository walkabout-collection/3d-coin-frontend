# Payment System & Feature Implementation Plan

## 📋 Executive Summary

This document outlines the comprehensive implementation plan for payment system features, AI functionality, order management, and user experience enhancements. The plan is organized by feature area with clear specifications for what should be implemented, what's out of scope, and the high-level approach for each feature. This plan aligns backend and frontend implementation efforts.

---

## 🎯 Project Goals

1. **Complete Payment Integration**: Integrate QuickBooks, Stripe, and Manual Invoice payment methods
2. **Real-time Updates**: Implement real-time payment status updates across dashboards
3. **Comprehensive History**: Provide complete payment history with sorting, filtering, and search
4. **Admin Oversight**: Enable admin monitoring and management of all payment methods
5. **Error Resilience**: Robust error handling and duplicate submission prevention
6. **User Experience**: Seamless payment flows with receipt generation
7. **Order Management**: Payment-gated order progression and status visibility
8. **AI Functionality**: Validated coin generation with concurrency control
9. **Draft Management**: Complete save-as-draft functionality for designs

---

## 📊 Frontend UI Readiness Status

> **Note**: This section focuses ONLY on frontend UI readiness. See detailed implementation sections below for backend requirements.

### ✅ Frontend UI Ready (Can Connect to Backend Now)

1. ✅ **Stripe Payment Method Selection** - `src/containers/payment-method/index.tsx`
2. ✅ **Stripe Checkout Integration** - Connected to backend
3. ✅ **Manual Payment Entry Form** - `src/components/PayNowModal/index.tsx`
4. ✅ **Payment Proof Upload** - Base64 image upload working
5. ✅ **Admin Payment History** - `src/containers/admin/payment-history/index.tsx` (connected to API)
6. ✅ **Save as Draft Button** - `src/containers/design-summary/index.tsx` (basic save working)

### ⚠️ Frontend UI Partially Ready (Needs Enhancement)

1. ⚠️ **Payment History (User)** - UI exists, using mock data
   - ✅ Table component ready
   - ❌ Not connected to API (using `data.ts`)
   - ❌ No sorting/filtering UI

2. ⚠️ **Stripe Integration** - Basic ready, missing:
   - ❌ Real-time status updates UI
   - ❌ Receipt download button
   - ❌ Duplicate prevention UI

3. ⚠️ **Manual Invoice** - Form ready, missing:
   - ❌ Dashboard updates UI
   - ❌ Notifications UI
   - ❌ Payment timeline display

4. ⚠️ **Admin Payment Methods** - Placeholder only (dummy API call)

5. ⚠️ **Admin Stripe** - Basic monitoring, missing reporting dashboard

6. ⚠️ **Admin Manual Invoice** - Approval ready, missing invoice generation

7. ⚠️ **Save Draft** - Button exists, missing draft management UI

### ❌ Frontend UI Not Ready (Needs to be Built)

1. ❌ **QuickBooks Integration (User)** - UI commented out, needs full UI
2. ❌ **Payment Status Checks** - No payment gate component
3. ❌ **Paid/Unpaid Orders Filtering** - No status column/filters
4. ❌ **Admin QuickBooks Dashboard** - No component exists
5. ❌ **Admin Stripe Reporting** - No dashboard exists
6. ❌ **AI Generation Validation UI** - No validation display
7. ❌ **AI Generation Queue UI** - No queue status display
8. ❌ **Rate Limit Error Handling UI** - No error display
9. ❌ **Draft Management UI** - No list/load/update/delete

---

## 🎯 Feature Implementation (Frontend + Backend)

### 1. USER DASHBOARD FEATURES

#### 1.1 Payment Methods – QuickBooks Integration

**Status**: ✅ **FRONTEND IMPLEMENTED** / ⚠️ **BACKEND PENDING**  
**Priority**: High  
**Frontend UI Status**: ✅ READY  
**Backend Status**: ❌ NOT STARTED

---

##### 📋 Feature Overview

**Requirements**:

- Connect dashboard to QuickBooks
- Secure authentication and data handling
- Update user dashboard with transactions
- Error handling

##### ✅ Frontend - What's Already Done:

- ✅ Payment method selection UI structure exists (`src/containers/payment-method/index.tsx`)

##### ✅ Frontend - What's Completed:

- ✅ QuickBooks option **uncommented** in `src/containers/payment-method/data.ts`
- ✅ QuickBooks option **uncommented** in `src/components/PaymentMethodModal.tsx/data.ts`
- ✅ QuickBooks OAuth flow component (`src/components/QuickBooks/QuickBooksOAuthModal.tsx`)
- ✅ QuickBooks payment form/modal (`src/components/QuickBooks/QuickBooksPaymentModal.tsx`)
- ✅ QuickBooks transaction display (`src/components/QuickBooks/QuickBooksTransactions.tsx`)
- ✅ QuickBooks connection status UI (`src/components/QuickBooks/QuickBooksConnectionStatus.tsx`)
- ✅ Error handling UI for OAuth failures (integrated in all components)
- ✅ API integration (all API functions added to `apiServices.ts`)
- ✅ React Query hooks for QuickBooks (all hooks added to `useQueries.ts`)
- ✅ Real-time status polling (invoice status polling with 10s interval)
- ✅ Integration into payment method container
- ✅ Integration into orders page with Pay Now functionality

---

##### 🔧 Backend Implementation

**Estimated Time**: 3-4 weeks

**Step 1: Install Dependencies**

```bash
npm install node-quickbooks intuit-oauth
```

**Step 2: Create QuickBooks Service Layer**

- Create `src/services/quickbooks.service.ts`
- Methods:
  - `connectQuickBooks(userId, authCode)` - OAuth connection
  - `createInvoice(quoteId, amount)` - Create invoice in QuickBooks
  - `syncTransactions(userId)` - Sync payments from QuickBooks
  - `getPaymentStatus(invoiceId)` - Check invoice payment status
  - `refreshToken(userId)` - Refresh OAuth tokens

**Step 3: Create API Endpoints**

- `POST /api/quickbooks/connect` - Initiate OAuth flow
- `GET /api/quickbooks/callback` - OAuth callback handler
- `POST /api/quickbooks/invoice/create` - Create invoice for quote
- `GET /api/quickbooks/transactions` - Get user's QuickBooks transactions
- `POST /api/quickbooks/sync` - Manual sync trigger

**Step 4: Database Schema Updates**
Add to User model:

- `quickbooksCompanyId` String? @db.VarChar(255)
- `quickbooksAccessToken` String? @db.Text (encrypted)
- `quickbooksRefreshToken` String? @db.Text (encrypted)
- `quickbooksTokenExpiresAt` DateTime?
- `quickbooksConnectedAt` DateTime?

Add to Payment model:

- `quickbooksInvoiceId` String? @unique @db.VarChar(255)
- `quickbooksSyncStatus` String? @db.VarChar(50) // PENDING, SYNCED, FAILED
- `quickbooksLastSyncAt` DateTime?

**Step 5: Error Handling**

- Handle OAuth errors
- Handle API rate limits
- Handle token expiration
- Handle invoice creation failures
- Log all errors with context

**Files to Create**:

- `src/services/quickbooks.service.ts` (NEW)
- `src/controllers/quickbooks.controller.ts` (NEW)
- `src/routes/quickbooks.routes.ts` (NEW)
- `src/validators/quickbooks.validator.ts` (NEW)
- `src/middleware/quickbooksAuth.middleware.ts` (NEW)

**API Endpoints**:

```
POST /api/quickbooks/connect - Initiate OAuth
GET /api/quickbooks/callback - OAuth callback
POST /api/quickbooks/invoice/create - Create invoice
GET /api/quickbooks/transactions - Get transactions
POST /api/quickbooks/sync - Manual sync
```

---

##### 🎨 Frontend Implementation

**Estimated Time**: 1-2 weeks

**Step 1: Uncomment QuickBooks Option**

- Uncomment in `src/containers/payment-method/data.ts`
- Uncomment in `src/components/PaymentMethodModal.tsx/data.ts` (if exists)

**Step 2: Create QuickBooks OAuth Flow Component**

- Create `src/components/QuickBooksPayment/index.tsx`
- Handle OAuth redirect
- Store connection status
- Display connection status UI

**Step 3: Create QuickBooks Payment Form/Modal**

- Display connection status
- Show QuickBooks transactions
- Handle payment creation
- Show payment processing status

**Step 4: Add Error Handling UI**

- OAuth failures display
- Payment processing errors
- Token expiration handling
- User-friendly error messages

**Step 5: Update User Dashboard**

- Show QuickBooks connection status
- Display QuickBooks transactions
- Real-time updates (WebSocket or polling)

**Files to Create**:

- `src/components/QuickBooksPayment/index.tsx` (NEW)

**Files to Modify**:

- `src/containers/payment-method/data.ts` (UNCOMMENT QuickBooks)
- `src/components/PaymentMethodModal.tsx/data.ts` (UNCOMMENT QuickBooks)
- `src/services/apiServices.ts` (ADD QuickBooks API functions)
- `src/hooks/useQueries.ts` (ADD QuickBooks hooks)

**Frontend Tasks**:

- [x] Uncomment QuickBooks option in payment method selection
- [x] Create QuickBooks OAuth flow component
- [x] Create QuickBooks payment form/modal
- [x] Create QuickBooks transaction display
- [x] Add QuickBooks connection status UI
- [x] Add error handling UI for OAuth failures
- [x] Connect to backend API endpoints
- [x] Implement real-time status updates

**Frontend Files Created**:

- ✅ `src/components/QuickBooks/QuickBooksOAuthModal.tsx` - OAuth flow with popup and postMessage handling
- ✅ `src/components/QuickBooks/QuickBooksConnectionStatus.tsx` - Connection status display
- ✅ `src/components/QuickBooks/QuickBooksTransactions.tsx` - Transaction table with filters and pagination
- ✅ `src/components/QuickBooks/QuickBooksPaymentModal.tsx` - Payment/invoice creation modal
- ✅ `src/components/QuickBooks/index.ts` - Component exports

**Frontend Files Modified**:

- ✅ `src/containers/payment-method/data.ts` - Uncommented QuickBooks option
- ✅ `src/components/PaymentMethodModal.tsx/data.ts` - Uncommented QuickBooks option
- ✅ `src/containers/payment-method/index.tsx` - Integrated QuickBooks components
- ✅ `src/services/apiServices.ts` - Added all QuickBooks API functions
- ✅ `src/hooks/useQueries.ts` - Added all QuickBooks React Query hooks
- ✅ `src/containers/orders/index.tsx` - Added QuickBooks payment support

---

#### 1.2 Payment Methods – Stripe Integration (Enhancements)

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Priority**: Medium  
**Frontend UI Status**: ⚠️ PARTIALLY READY  
**Backend Status**: ⚠️ PARTIALLY DONE

---

##### 📋 Feature Overview

**Requirements**:

- Real-time status updates
- Handle errors, duplicate submissions
- Receipt generation

##### ✅ Frontend - What's Already Done:

- ✅ Stripe payment method selection UI (`src/containers/payment-method/index.tsx`)
- ✅ Stripe checkout integration (connected to backend)
- ✅ Payment processing flow working
- ✅ Basic payment method selection working

##### ❌ Frontend - What's Pending:

- ❌ Real-time status updates UI (WebSocket connection)
- ❌ Receipt download button in payment history
- ❌ Receipt generation status indicator
- ❌ Duplicate prevention UI (disable button, show processing state)
- ❌ Enhanced error handling UI

---

##### 🔧 Backend Implementation

**Estimated Time**: 1-2 weeks

**Step 1: Real-time Status Updates**

- Use existing WebSocket service
- Create channel: `payment-status-updates`
- Broadcast payment status changes
- Send updates on: PENDING → SUCCESS/FAILED

**Step 2: Receipt Generation**

- Create `src/services/receipt.service.ts`
- Generate PDF receipts using `pdfkit` or `puppeteer`
- Store receipts in S3 (already configured)
- Endpoint: `GET /api/payments/:paymentId/receipt`
- Endpoint: `POST /api/payments/:paymentId/receipt/generate`
- Email receipt to user after successful payment

**Step 3: Duplicate Submission Handling**

- Add `idempotencyKey` field to Payment model
- Check for existing pending payment for same quote
- Return existing payment if duplicate detected
- Add idempotency validation middleware

**Step 4: Enhanced Error Handling**

- Better error messages for common Stripe errors
- Retry logic for transient failures
- Error logging with full context

**Files to Create/Modify**:

- `src/services/receipt.service.ts` (NEW)
- `src/services/stripe.service.ts` (ENHANCE)
- `src/controllers/stripe.controller.ts` (ENHANCE)
- `src/routes/stripe.routes.ts` (ENHANCE)

**API Endpoints**:

```
GET /api/payments/:paymentId/receipt - Download receipt
POST /api/payments/:paymentId/receipt/generate - Generate receipt
WebSocket: payment-status-updates channel - Real-time status updates
```

**Database Schema Updates**:
Add to Payment model:

- `idempotencyKey` String? @unique @db.VarChar(255)
- `receiptUrl` String? @db.Text
- `receiptGeneratedAt` DateTime?

---

##### 🎨 Frontend Implementation

**Estimated Time**: 1 week

**Step 1: Real-time Status Updates**

- Connect to WebSocket `payment-status-updates` channel
- Update payment status in real-time
- Show loading states during processing
- Auto-refresh payment history after successful payment

**Step 2: Receipt Generation**

- Add receipt download button in payment history
- Show receipt generation status
- Display receipt link after payment
- Handle receipt download errors

**Step 3: Duplicate Prevention**

- Add idempotency key to payment requests
- Disable payment button after submission
- Show "Processing" state
- Prevent multiple checkout sessions

**Step 4: Enhanced Error Handling**

- Display user-friendly error messages
- Show retry options for failed payments
- Handle Stripe API errors gracefully

**Files to Modify**:

- `src/components/PayNowModal/index.tsx` (ADD WebSocket, duplicate prevention)
- `src/containers/payment-history/index.tsx` (ADD receipt download button)
- `src/services/apiServices.ts` (ADD receipt endpoints)
- `src/hooks/useQueries.ts` (ADD receipt hooks)

**Frontend Tasks**:

- [ ] Connect to WebSocket for real-time payment status
- [ ] Add receipt download button in payment history
- [ ] Show receipt generation status
- [ ] Display receipt link after payment
- [ ] Add idempotency key to payment requests
- [ ] Disable payment button after submission
- [ ] Show "Processing" state
- [ ] Prevent multiple checkout sessions
- [ ] Enhanced error handling UI

---

## cc

#### 1.4 Payment History – Payment History API (Enhancements)

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Priority**: Medium  
**Frontend UI Status**: ⚠️ PARTIALLY READY  
**Backend Status**: ⚠️ PARTIALLY DONE

---

##### 📋 Feature Overview

**Requirements**:

- Fetch all transactions with sorting/filtering
- Secure access per user
- Error handling and data accuracy

##### ✅ Frontend - What's Already Done:

- ✅ Table component UI exists (`src/containers/payment-history/index.tsx`)
- ✅ Search functionality working
- ✅ Basic table structure ready
- ✅ API hook exists (`getUserOrderHistory` in `useQueries.ts`)

##### ⚠️ Frontend - What's Partially Done:

- ⚠️ **Using mock data** from `src/containers/payment-history/data.ts` instead of real API

##### ❌ Frontend - What's Pending:

- ❌ Connect to real API (replace mock data)
- ❌ Sorting controls UI (date, amount, status)
- ❌ Filtering UI (status, method, date range)
- ❌ Pagination controls
- ❌ Loading state UI
- ❌ Error state UI

---

##### 🔧 Backend Implementation

**Estimated Time**: 1 week

**Step 1: Enhanced Query Parameters**

- Add sorting: `?sortBy=date|amount|status&sortOrder=asc|desc`
- Add filtering: `?status=SUCCESS|PENDING|FAILED&method=STRIPE|QUICKBOOKS|MANUAL`
- Add date range: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- Add pagination: `?page=1&limit=20`

**Step 2: Data Accuracy**

- Include all payment details (invoice number, transaction ID, etc.)
- Include related order information
- Include quote details
- Add payment metadata

**Step 3: Security**

- Ensure users can only access their own payments
- Validate all query parameters
- Rate limit the endpoint

**Files to Modify**:

- `src/services/order.service.ts` (ENHANCE)
- `src/controllers/order.controller.ts` (ENHANCE)
- `src/routes/order.routes.ts` (ENHANCE)
- `src/validators/order.validator.ts` (ENHANCE)

**API Endpoints**:

```
GET /api/order/user/history?sortBy=date&sortOrder=desc&status=SUCCESS&method=STRIPE&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=20
```

---

##### 🎨 Frontend Implementation

**Estimated Time**: 1 week

**Step 1: Replace Mock Data with API**

- Connect to `getUserOrderHistory` API
- Remove mock data from `src/containers/payment-history/data.ts`
- Handle loading and error states

**Step 2: Sorting & Filtering UI**

- Add sort dropdown (date, amount, status)
- Add filter dropdowns (status, method, date range)
- Add search by order ID
- Add pagination controls

**Step 3: Security**

- Ensure user can only see their own payments
- Validate API responses
- Handle unauthorized access

**Files to Modify**:

- `src/containers/payment-history/index.tsx` (REPLACE mock data, ADD filters)
- `src/containers/payment-history/data.ts` (REMOVE or keep as fallback)
- `src/containers/payment-history/types.ts` (UPDATE to match API)
- `src/components/common/Table/index.tsx` (ENHANCE sorting/filtering)

**Frontend Tasks**:

- [ ] Connect to real API (replace mock data)
- [ ] Add sorting controls UI (date, amount, status)
- [ ] Add filtering UI (status, method, date range)
- [ ] Add pagination controls
- [ ] Add loading state UI
- [ ] Add error state UI
- [ ] Handle unauthorized access

---

## 2. USER ORDERS API

#### 2.1 Move to Next Step Only If Paid

**Status**: ❌ **NOT IMPLEMENTED**  
**Priority**: High  
**Frontend UI Status**: ❌ NOT READY  
**Backend Status**: ❌ NOT STARTED

---

##### 📋 Feature Overview

**Requirements**:

- Move to next step only if paid
- API Integration at frontend

##### ✅ Frontend - What's Already Done:

- ✅ Orders page exists (`src/containers/orders/index.tsx`)
- ✅ Basic order display working
- ✅ Order list rendering working

##### ❌ Frontend - What's Pending:

- ❌ Payment gate component (`src/components/PaymentGate/index.tsx`)
- ❌ Payment status check before showing "Next Step" button
- ❌ Payment status badge component
- ❌ "Payment Required" message display
- ❌ Link to payment page from blocked step
- ❌ Auto-enable button when payment completes
- ❌ Payment status API integration
- ❌ Payment status polling

---

##### 🔧 Backend Implementation

**Estimated Time**: 1 week

**Step 1: Payment Verification Middleware**

- Create `src/middleware/paymentVerification.middleware.ts`
- Check payment status before allowing progression
- Verify payment is SUCCESS before quote approval
- Block order creation if payment not completed

**Step 2: API Endpoints**

- `GET /api/orders/:orderId/payment-status` - Check payment status
- `POST /api/orders/:orderId/proceed` - Proceed (validates payment)
- `GET /api/quotes/:quoteId/can-proceed` - Check if quote can proceed

**Step 3: Order Progression Logic**

- Quote status: PENDING → APPROVED (only if payment SUCCESS)
- Order status: PENDING → APPROVED (only if payment SUCCESS)
- Add validation in order service methods

**Files to Create/Modify**:

- `src/middleware/paymentVerification.middleware.ts` (NEW)
- `src/services/order.service.ts` (ENHANCE)
- `src/controllers/order.controller.ts` (ENHANCE)
- `src/routes/order.routes.ts` (ENHANCE)

**API Endpoints**:

```
GET /api/orders/:orderId/payment-status - Check payment status
POST /api/orders/:orderId/proceed - Proceed (validates payment)
GET /api/quotes/:quoteId/can-proceed - Check if can proceed
```

**API Response Format**:

```typescript
{
  success: boolean;
  data: {
    orderId: string;
    paymentStatus: "PAID" | "UNPAID" | "PENDING" | "FAILED";
    paymentMethod?: "STRIPE" | "QUICKBOOKS" | "MANUAL";
    paymentId?: string;
    paidAt?: string;
    canProceed: boolean;
  }
}
```

---

##### 🎨 Frontend Implementation

**Estimated Time**: 1 week

**Step 1: Payment Gate Component**

- Create `src/components/PaymentGate/index.tsx`
- Check payment status before showing "Next Step"
- Block progression if unpaid
- Show payment required message

**Step 2: Payment Status Checks**

- Call payment status API before rendering buttons
- Disable "Next Step" button if unpaid
- Show payment status badge
- Link to payment page

**Step 3: Real-time Updates**

- Poll payment status if pending
- Auto-enable button when payment completes
- WebSocket updates (if available)

**Files to Create**:

- `src/components/PaymentGate/index.tsx` (NEW)
- `src/components/PaymentStatusBadge/index.tsx` (NEW)

**Files to Modify**:

- `src/containers/orders/index.tsx` (ADD payment status checks)
- `src/containers/tracking/index.tsx` (ADD payment gate)
- `src/services/apiServices.ts` (ADD payment status endpoints)
- `src/hooks/useQueries.ts` (ADD payment status hooks)

**Frontend Tasks**:

- [ ] Create payment gate component
- [ ] Add payment status check before showing "Next Step" button
- [ ] Create payment status badge component
- [ ] Add "Payment Required" message display
- [ ] Add link to payment page from blocked step
- [ ] Auto-enable button when payment completes
- [ ] Implement payment status polling

---

#### 2.2 Show Paid/Unpaid Orders

**Status**: ❌ **NOT IMPLEMENTED**  
**Priority**: High  
**Frontend UI Status**: ❌ NOT READY  
**Backend Status**: ❌ NOT STARTED

---

##### 📋 Feature Overview

**Requirements**:

- Fetch all orders with payment status
- Filtering, sorting, real-time updates

##### ✅ Frontend - What's Already Done:

- ✅ Orders page exists (`src/containers/orders/index.tsx`)
- ✅ Basic order list display working
- ✅ Order table component working
- ✅ Order data fetching working (`useUserOrders`, `useUserOrderHistory`)

##### ❌ Frontend - What's Pending:

- ❌ Payment status column in orders table
- ❌ Payment status badge (PAID/UNPAID/PENDING) with colors
- ❌ Payment status filter dropdown
- ❌ Payment method filter
- ❌ Sort by payment status
- ❌ "Pay Now" button for unpaid orders
- ❌ "View Receipt" button for paid orders
- ❌ Real-time payment status updates
- ❌ Payment status API integration

---

##### 🔧 Backend Implementation

**Estimated Time**: 1 week

**Step 1: Enhanced Order Endpoints**

- Modify `GET /api/order/user` to include `paymentStatus`
- Add filtering: `?paymentStatus=PAID|UNPAID|PENDING`
- Add sorting by payment status
- Include payment method and payment date in response

**Step 2: Payment Status Calculation**

- PAID: Payment exists with status SUCCESS
- UNPAID: No payment or payment status PENDING/FAILED
- PENDING: Payment exists with status PENDING

**Step 3: Real-time Updates**

- WebSocket notifications when payment status changes
- Broadcast to user when payment completes

**Files to Modify**:

- `src/services/order.service.ts` (ENHANCE)
- `src/controllers/order.controller.ts` (ENHANCE)
- `src/routes/order.routes.ts` (ENHANCE)

**API Endpoints**:

```
GET /api/order/user?paymentStatus=PAID|UNPAID|PENDING - Filter by payment status
GET /api/order/user?sortBy=paymentStatus&sortOrder=asc - Sort by payment status
```

**API Response Format**:

```typescript
{
  success: boolean;
  data: {
    orders: Array<{
      id: string;
      paymentStatus: "PAID" | "UNPAID" | "PENDING";
      paymentMethod?: "STRIPE" | "QUICKBOOKS" | "MANUAL";
      paymentDate?: string;
      // ... other order fields
    }>;
  }
}
```

---

##### 🎨 Frontend Implementation

**Estimated Time**: 1 week

**Step 1: Payment Status Display**

- Add payment status column to orders table
- Show payment status badge (PAID/UNPAID/PENDING)
- Color-code status (green=paid, red=unpaid, yellow=pending)
- Show payment method if paid
- Display payment date if paid

**Step 2: Filtering & Sorting**

- Filter by payment status (All, Paid, Unpaid, Pending)
- Filter by payment method
- Sort by payment status
- Sort by payment date

**Step 3: Real-time Updates**

- Poll payment status for pending orders
- Update status automatically when payment completes
- Show notification when payment status changes
- WebSocket updates (if available)

**Step 4: Order Actions**

- "Pay Now" button for unpaid orders
- "View Receipt" for paid orders
- "Track Order" for paid orders
- "Retry Payment" for failed payments

**Files to Create**:

- `src/components/PaymentStatusBadge/index.tsx` (NEW)

**Files to Modify**:

- `src/containers/orders/index.tsx` (ADD payment status column, filters)
- `src/containers/orders/types.ts` (ADD payment status types)
- `src/components/common/Table/index.tsx` (ENHANCE filtering)
- `src/services/apiServices.ts` (ENSURE payment status in order data)
- `src/hooks/useQueries.ts` (ADD payment status polling)

**Frontend Tasks**:

- [ ] Add payment status column in orders table
- [ ] Create payment status badge (PAID/UNPAID/PENDING) with colors
- [ ] Add payment status filter dropdown
- [ ] Add payment method filter
- [ ] Add sort by payment status
- [ ] Add "Pay Now" button for unpaid orders
- [ ] Add "View Receipt" button for paid orders
- [ ] Implement real-time payment status updates

---

## 3. ADMIN DASHBOARD FEATURES

#### 3.1 Admin Payment Methods – QuickBooks Integration

**Status**: Not Implemented  
**Backend**: Not Started  
**Frontend**: UI exists but commented out

**What Needs to be Done**:

**Backend (3-4 weeks)**:

1. Install QuickBooks SDK (`node-quickbooks` or `intuit-oauth`)
2. Create QuickBooks OAuth flow
   - `POST /api/quickbooks/connect` - Initiate OAuth
   - `GET /api/quickbooks/callback` - OAuth callback
3. Create QuickBooks service layer
   - `POST /api/quickbooks/invoice/create` - Create invoice
   - `GET /api/quickbooks/transactions` - Get transactions
   - `POST /api/quickbooks/sync` - Manual sync
4. Add database fields:
   - User model: `quickbooksCompanyId`, `quickbooksAccessToken` (encrypted), `quickbooksRefreshToken` (encrypted)
   - Payment model: `quickbooksInvoiceId`, `quickbooksSyncStatus`
5. Implement error handling and token refresh

**Frontend (1-2 weeks)**:

1. Uncomment QuickBooks option in payment method selection
   - `src/containers/payment-method/data.ts`
   - `src/components/PaymentMethodModal.tsx/data.ts`
2. Create QuickBooks OAuth flow component
   - `src/components/QuickBooksPayment/index.tsx` (NEW)
   - Handle OAuth redirect
   - Store connection status
3. Create QuickBooks payment form/modal
   - Display connection status
   - Show QuickBooks transactions
   - Handle payment creation
4. Add error handling
   - OAuth failures
   - Payment processing errors
   - Token expiration handling
5. Update user dashboard
   - Show QuickBooks connection status
   - Display QuickBooks transactions
   - Real-time updates (WebSocket or polling)

**Files to Create/Modify**:

- `src/components/QuickBooksPayment/index.tsx` (NEW)
- `src/services/apiServices.ts` (ADD QuickBooks functions)
- `src/hooks/useQueries.ts` (ADD QuickBooks hooks)
- `src/containers/payment-method/data.ts` (UNCOMMENT QuickBooks)
- `src/components/PaymentMethodModal.tsx/data.ts` (UNCOMMENT QuickBooks)

---

### 1.2 Payment Methods – Stripe Integration ⚠️ **PARTIALLY DONE**

**Status**: Basic implementation done, enhancements pending  
**Backend**: Basic done, enhancements pending  
**Frontend**: Basic done, enhancements pending

**What's Done**:

- ✅ Stripe checkout session creation
- ✅ Payment processing
- ✅ Payment method selection UI

**What Needs to be Done**:

**Backend (1-2 weeks)**:

1. Real-time status updates
   - WebSocket channel: `payment-status-updates`
   - Broadcast payment status changes
2. Receipt generation
   - `GET /api/payments/:paymentId/receipt` - Download receipt
   - `POST /api/payments/:paymentId/receipt/generate` - Generate receipt
   - Store receipts in S3
   - Email receipt to user
3. Duplicate submission handling
   - Add `idempotencyKey` to Payment model
   - Check for existing pending payment
   - Return existing payment if duplicate

**Frontend (1 week)**:

1. Real-time status updates
   - Connect to WebSocket `payment-status-updates` channel
   - Update payment status in real-time
   - Show loading states during processing
2. Receipt generation
   - Add receipt download button in payment history
   - Show receipt generation status
   - Display receipt link after payment
3. Duplicate prevention
   - Add idempotency key to payment requests
   - Disable payment button after submission
   - Show "Processing" state
   - Prevent multiple checkout sessions

**Files to Modify**:

- `src/components/PayNowModal/index.tsx` (ADD WebSocket, duplicate prevention)
- `src/containers/payment-history/index.tsx` (ADD receipt download)
- `src/services/apiServices.ts` (ADD receipt endpoints)
- `src/hooks/useQueries.ts` (ADD receipt hooks)

---

### 1.3 Payment Methods – Manual Invoice ⚠️ **PARTIALLY DONE**

**Status**: Basic form done, enhancements pending  
**Backend**: Basic done, notifications pending  
**Frontend**: Basic form done, dashboard updates pending

**What's Done**:

- ✅ Manual payment entry form
- ✅ Payment proof upload
- ✅ Admin approval workflow

**What Needs to be Done**:

**Backend (1 week)**:

1. Dashboard updates
   - WebSocket notifications when admin approves/rejects
   - Real-time payment status updates
2. Notifications
   - Email notification when payment proof uploaded
   - Email notification when payment verified/rejected
   - In-app notification system

**Frontend (3-5 days)**:

1. Dashboard updates
   - Auto-refresh payment status
   - Show payment proof preview
   - Display payment timeline
   - Real-time status updates (WebSocket)
2. Notifications
   - Show notification badge
   - Display notification messages
   - Email notification preferences

**Files to Modify**:

- `src/components/PayNowModal/index.tsx` (ADD validation enhancements)
- `src/containers/payment-history/index.tsx` (ADD status updates)
- `src/services/apiServices.ts` (ADD notification endpoints)
- Create `src/components/NotificationBadge/index.tsx` (NEW)

---

### 1.4 Payment History – Payment History API ⚠️ **PARTIALLY DONE**

**Status**: Basic API exists, enhancements pending  
**Backend**: Basic endpoint done, filtering/sorting pending  
**Frontend**: Using mock data, needs API connection

**What's Done**:

- ✅ Basic payment history endpoint (`GET /api/order/user/history`)
- ✅ UI with table component
- ✅ API hook exists (`getUserOrderHistory`)

**What Needs to be Done**:

**Backend (1 week)**:

1. Enhanced query parameters
   - `?sortBy=date|amount|status&sortOrder=asc|desc`
   - `?status=SUCCESS|PENDING|FAILED&method=STRIPE|QUICKBOOKS|MANUAL`
   - `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
   - `?page=1&limit=20`
2. Data accuracy
   - Include all payment details (invoice number, transaction ID)
   - Include related order information
   - Include quote details
   - Add payment metadata

**Frontend (1 week)**:

1. Replace mock data with API
   - Connect to `getUserOrderHistory` API
   - Remove mock data from `src/containers/payment-history/data.ts`
   - Handle loading and error states
2. Sorting & Filtering UI
   - Add sort dropdown (date, amount, status)
   - Add filter dropdowns (status, method, date range)
   - Add search by order ID
   - Add pagination controls
3. Security
   - Ensure user can only see their own payments
   - Validate API responses
   - Handle unauthorized access

**Files to Modify**:

- `src/containers/payment-history/index.tsx` (REPLACE mock data, ADD filters)
- `src/containers/payment-history/data.ts` (REMOVE or keep as fallback)
- `src/containers/payment-history/types.ts` (UPDATE to match API)
- `src/components/common/Table/index.tsx` (ENHANCE sorting/filtering)

---

### 1.5 User Orders API - Move to Next Step Only If Paid ⚠️ **PENDING**

**Status**: Not Implemented  
**Backend**: Not Started  
**Frontend**: Not Started

**What Needs to be Done**:

**Backend (1 week)**:

1. Payment verification middleware
   - `src/middleware/paymentVerification.middleware.ts` (NEW)
   - Check payment status before allowing progression
   - Verify payment is SUCCESS before quote approval
2. API endpoints
   - `GET /api/orders/:orderId/payment-status` - Check payment status
   - `POST /api/orders/:orderId/proceed` - Proceed (validates payment)
   - `GET /api/quotes/:quoteId/can-proceed` - Check if can proceed
3. Order progression logic
   - Quote status: PENDING → APPROVED (only if payment SUCCESS)
   - Order status: PENDING → APPROVED (only if payment SUCCESS)

**Frontend (1 week)**:

1. Payment gate component
   - `src/components/PaymentGate/index.tsx` (NEW)
   - Check payment status before showing "Next Step"
   - Block progression if unpaid
   - Show payment required message
2. Payment status checks
   - Call payment status API before rendering buttons
   - Disable "Next Step" button if unpaid
   - Show payment status badge
   - Link to payment page
3. Real-time updates
   - Poll payment status if pending
   - Auto-enable button when payment completes
   - WebSocket updates (if available)

**Files to Create/Modify**:

- `src/components/PaymentGate/index.tsx` (NEW)
- `src/containers/orders/index.tsx` (ADD payment status checks)
- `src/containers/tracking/index.tsx` (ADD payment gate)
- `src/services/apiServices.ts` (ADD payment status endpoints)
- `src/hooks/useQueries.ts` (ADD payment status hooks)

---

### 1.6 Show Paid/Unpaid Orders ⚠️ **PENDING**

**Status**: Not Implemented  
**Backend**: Not Started  
**Frontend**: Not Started

**What Needs to be Done**:

**Backend (1 week)**:

1. Enhanced order endpoints
   - Modify `GET /api/order/user` to include `paymentStatus`
   - Add filtering: `?paymentStatus=PAID|UNPAID|PENDING`
   - Add sorting by payment status
2. Payment status calculation
   - PAID: Payment exists with status SUCCESS
   - UNPAID: No payment or payment status PENDING/FAILED
   - PENDING: Payment exists with status PENDING

**Frontend (1 week)**:

1. Payment status display
   - Add payment status column to orders table
   - Show payment status badge (PAID/UNPAID/PENDING)
   - Color-code status (green=paid, red=unpaid, yellow=pending)
   - Show payment method if paid
   - Display payment date if paid
2. Filtering & Sorting
   - Filter by payment status (All, Paid, Unpaid, Pending)
   - Filter by payment method
   - Sort by payment status
   - Sort by payment date
3. Real-time updates
   - Poll payment status for pending orders
   - Update status automatically when payment completes
   - Show notification when payment status changes
   - WebSocket updates (if available)
4. Order actions
   - "Pay Now" button for unpaid orders
   - "View Receipt" for paid orders
   - "Track Order" for paid orders
   - "Retry Payment" for failed payments

**Files to Modify**:

- `src/containers/orders/index.tsx` (ADD payment status column, filters)
- `src/containers/orders/types.ts` (ADD payment status types)
- `src/components/common/Table/index.tsx` (ENHANCE filtering)
- `src/services/apiServices.ts` (ENSURE payment status in order data)
- Create `src/components/PaymentStatusBadge/index.tsx` (NEW)

---

## 3. ADMIN DASHBOARD FEATURES

#### 3.1 Admin Payment Methods – QuickBooks Integration

**Status**: ❌ **NOT IMPLEMENTED**  
**Priority**: High  
**Frontend UI Status**: ❌ NOT READY  
**Backend Status**: ❌ NOT STARTED

---

##### 📋 Feature Overview

**Requirements**:

- Admin panel monitoring for QuickBooks
- API handling and mapping to orders
- Error and sync management

##### ✅ Frontend - What's Already Done:

- ✅ Basic payment method selection UI exists (`src/containers/admin/payment-method/index.tsx`)
- ✅ UI structure with payment option cards

##### ⚠️ Frontend - What's Partially Done:

- ⚠️ **Dummy API call only** (line 14: `fetch("https://jsonplaceholder.typicode.com/todos/1")`)
- ⚠️ No real QuickBooks functionality

##### ❌ Frontend - What's Pending:

- ❌ Admin QuickBooks dashboard component
- ❌ QuickBooks connection status display for all users
- ❌ Sync status indicators
- ❌ Manual sync trigger buttons
- ❌ Error log viewer
- ❌ Transaction mapping interface
- ❌ Unmapped invoices display
- ❌ API integration (no admin QuickBooks APIs in `apiServices.ts`)

---

##### 🔧 Backend Implementation

**Estimated Time**: 2-3 weeks

**Step 1: Admin QuickBooks Dashboard**

- `GET /api/admin/quickbooks/connections` - View all connections
- `GET /api/admin/quickbooks/sync-status` - View sync status
- `GET /api/admin/quickbooks/errors` - View errors
- `GET /api/admin/quickbooks/transactions` - View all QuickBooks transactions

**Step 2: Sync Management**

- Background job to sync QuickBooks payments
- `POST /api/admin/quickbooks/sync/:paymentId` - Manual sync
- Retry failed syncs with exponential backoff
- Sync status tracking

**Step 3: Order Mapping**

- Automatically map QuickBooks invoices to orders
- `POST /api/admin/quickbooks/map-transaction` - Manual mapping
- Handle unmapped invoices
- Mapping history

**Step 4: Error Management**

- Error log viewer
- Error resolution workflow
- Email alerts for critical errors

**Files to Create**:

- `src/services/quickbooksSync.service.ts` (NEW)
- `src/controllers/adminQuickbooks.controller.ts` (NEW)
- `src/routes/adminQuickbooks.routes.ts` (NEW)
- `src/jobs/quickbooksSync.job.ts` (NEW)

**API Endpoints**:

```
GET /api/admin/quickbooks/connections - View all connections
GET /api/admin/quickbooks/sync-status - View sync status
POST /api/admin/quickbooks/sync/:paymentId - Manual sync
GET /api/admin/quickbooks/errors - View errors
GET /api/admin/quickbooks/transactions - View all transactions
POST /api/admin/quickbooks/map-transaction - Manual mapping
```

---

##### 🎨 Frontend Implementation

**Estimated Time**: 1-2 weeks

**Step 1: Admin QuickBooks Dashboard**

- Create `src/containers/admin/quickbooks-dashboard/index.tsx`
- View all QuickBooks-connected users
- View sync status for all payments
- View failed syncs and errors

**Step 2: Sync Management UI**

- Manual sync trigger for specific payments
- Sync status indicators
- Error log viewer

**Step 3: Order Mapping Interface**

- Display unmapped invoices
- Manual mapping tool
- Mapping history

**Files to Create**:

- `src/containers/admin/quickbooks-dashboard/index.tsx` (NEW)
- `src/components/admin/QuickBooksConnection/index.tsx` (NEW)
- `src/components/admin/QuickBooksSync/index.tsx` (NEW)

**Files to Modify**:

- `src/services/apiServices.ts` (ADD admin QuickBooks APIs)
- `src/hooks/useQueries.ts` (ADD admin QuickBooks hooks)

**Frontend Tasks**:

- [ ] Create admin QuickBooks dashboard
- [ ] Display QuickBooks connection status for all users
- [ ] Show sync status indicators
- [ ] Add manual sync trigger buttons
- [ ] Create error log viewer
- [ ] Create transaction mapping interface
- [ ] Display unmapped invoices

---

#### 3.2 Admin Payment Methods – Stripe Integration

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Priority**: Medium  
**Frontend UI Status**: ⚠️ PARTIALLY READY  
**Backend Status**: ⚠️ PARTIALLY DONE

---

##### 📋 Feature Overview

**Requirements**:

- Stripe integration for admin oversight
- Reporting, filtering, reconciliation
- Multi-currency support and error handling

##### ✅ Frontend - What's Already Done:

- ✅ Admin can view all orders with Stripe payments (via admin payment history)
- ✅ Payment status monitoring (basic)
- ✅ Admin payment history connected to API (`src/containers/admin/payment-history/index.tsx`)

##### ❌ Frontend - What's Pending:

- ❌ Stripe reporting dashboard
- ❌ Revenue charts and graphs
- ❌ Payment method breakdown display
- ❌ Refund tracking UI
- ❌ Filtering and search UI
- ❌ Reconciliation interface
- ❌ Multi-currency display
- ❌ Export functionality (CSV/Excel download)

---

##### 🔧 Backend Implementation

**Estimated Time**: 2-3 weeks

**Step 1: Reporting**

- `GET /api/admin/stripe/reports` - Revenue reports
- Daily, weekly, monthly, yearly reports
- Payment method breakdown
- Refund reports
- Failed payment reports

**Step 2: Filtering & Search**

- Filter by date range, amount, status, customer
- Search by order ID, payment ID, customer email
- Advanced filters

**Step 3: Reconciliation**

- `GET /api/admin/stripe/reconcile` - Reconciliation data
- `POST /api/admin/stripe/reconcile/run` - Run reconciliation
- Compare Stripe dashboard with database

**Step 4: Multi-currency Support**

- Store currency in Payment model
- Display amounts in original currency
- Currency conversion for reports

**Step 5: Export**

- `GET /api/admin/stripe/export` - Export to CSV/Excel

**Files to Create/Modify**:

- `src/services/stripeReporting.service.ts` (NEW)
- `src/controllers/adminStripe.controller.ts` (NEW)
- `src/routes/adminStripe.routes.ts` (NEW)
- `src/services/stripe.service.ts` (ENHANCE)

**API Endpoints**:

```
GET /api/admin/stripe/reports - Get revenue reports
GET /api/admin/stripe/reconcile - Reconciliation data
POST /api/admin/stripe/reconcile/run - Run reconciliation
GET /api/admin/stripe/export - Export to CSV/Excel
GET /api/admin/stripe/currencies - Get supported currencies
```

**Database Schema Updates**:
Add to Payment model:

- `currency` String? @default("usd") @db.VarChar(10)

---

##### 🎨 Frontend Implementation

**Estimated Time**: 1-2 weeks

**Step 1: Stripe Reporting Dashboard**

- Create `src/containers/admin/stripe-dashboard/index.tsx`
- Revenue charts and graphs
- Payment method breakdown
- Refund tracking

**Step 2: Filtering & Search UI**

- Filter controls
- Search bar
- Advanced filter panel

**Step 3: Reconciliation Interface**

- Reconciliation tool
- Discrepancy display
- Manual reconciliation

**Step 4: Multi-currency Display**

- Show amounts in original currency
- Currency conversion display
- Currency filter

**Step 5: Export Functionality**

- Export button
- Format selection (CSV/Excel)
- Download handler

**Files to Create**:

- `src/containers/admin/stripe-dashboard/index.tsx` (NEW)
- `src/components/admin/StripeReports/index.tsx` (NEW)
- `src/components/admin/StripeReconciliation/index.tsx` (NEW)

**Files to Modify**:

- `src/services/apiServices.ts` (ADD admin Stripe APIs)
- `src/hooks/useQueries.ts` (ADD admin Stripe hooks)

**Frontend Tasks**:

- [ ] Create Stripe reporting dashboard
- [ ] Add revenue charts and graphs
- [ ] Display payment method breakdown
- [ ] Add refund tracking
- [ ] Create filtering and search UI
- [ ] Create reconciliation interface
- [ ] Add multi-currency display
- [ ] Add export functionality

---

#### 3.3 Admin Payment Methods – Manual Invoice

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Priority**: Medium  
**Frontend UI Status**: ⚠️ PARTIALLY READY  
**Backend Status**: ⚠️ PARTIALLY DONE

---

##### 📋 Feature Overview

**Requirements**:

- Admin can generate and track manual invoices
- Validate data and save to backend
- Status updates for users

##### ✅ Frontend - What's Already Done:

- ✅ Admin can view pending manual payments
- ✅ Admin can approve/reject manual payments
- ✅ Payment proof viewing working

##### ❌ Frontend - What's Pending:

- ❌ Invoice generator component (`src/components/admin/InvoiceGenerator/index.tsx`)
- ❌ Invoice creation form
- ❌ Invoice preview UI
- ❌ Invoice list page (`src/containers/admin/manual-invoice/index.tsx`)
- ❌ Invoice management UI
- ❌ Invoice tracking UI
- ❌ Send invoice functionality
- ❌ Invoice PDF preview/download
- ❌ Mark as paid manually button

---

#### 3.4 Admin Payment History – Payment History API

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Priority**: Low  
**Frontend UI Status**: ✅ READY (Needs Enhancement)  
**Backend Status**: ⚠️ PARTIALLY DONE

---

##### 📋 Feature Overview

**Requirements**:

- Retrieve all payment transactions
- Sorting/filtering and secure access
- Sync with user dashboard

##### ✅ Frontend - What's Already Done:

- ✅ Admin payment history connected to API (`src/containers/admin/payment-history/index.tsx`)
- ✅ Displays payment method, order total, date, customer info
- ✅ Sorting enabled (`sortable={true}` at line 123)
- ✅ Search functionality working (`searchable={true}` at line 121)
- ✅ Loading state UI (lines 91-98)
- ✅ Error state UI (lines 101-108)
- ✅ Table component working with real API data
- ✅ Uses `useAdminOrderHistory` hook (line 39)

##### ❌ Frontend - What's Pending (Enhancements):

- ❌ Enhanced filtering options (status, method, date range)
- ❌ Export functionality (CSV/Excel)
- ❌ Payment analytics dashboard
- ❌ Revenue charts
- ❌ Payment trends display

---

##### 🔧 Backend Implementation

**Estimated Time**: 1 week

**Step 1: Enhanced Query Parameters**

- Sorting, filtering, pagination
- Date range filtering
- Payment method filtering

**Step 2: Additional Admin Features**

- Export to CSV/Excel
- Bulk operations
- Payment analytics
- Customer payment history view

**Files to Modify**:

- `src/services/order.service.ts` (ENHANCE)
- `src/controllers/order.controller.ts` (ENHANCE)

**API Endpoints**:

```
GET /api/admin/payment-history/export?format=csv - Export to CSV
GET /api/admin/payment-history/analytics - Get analytics
```

---

##### 🎨 Frontend Implementation

**Estimated Time**: 3-5 days

**Step 1: Enhanced Filtering**

- More filter options
- Advanced filters

**Step 2: Export Functionality**

- Export button
- CSV/Excel export

**Step 3: Analytics**

- Payment analytics dashboard
- Revenue charts
- Payment trends

**Files to Create**:

- `src/components/admin/PaymentAnalytics/index.tsx` (NEW)

**Files to Modify**:

- `src/containers/admin/payment-history/index.tsx` (ENHANCE filters, ADD export)
- `src/services/apiServices.ts` (ADD export endpoints)

**Frontend Tasks**:

- [ ] Add enhanced filtering options
- [ ] Add export button and functionality
- [ ] Create payment analytics dashboard
- [ ] Add revenue charts
- [ ] Display payment trends

---

## 4. AI FUNCTIONALITY

#### 4.1 Implement API Filter for Coin Generation

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Priority**: High  
**Frontend UI Status**: ⚠️ PARTIALLY READY  
**Backend Status**: ⚠️ PARTIALLY DONE

---

##### 📋 Feature Overview

**Requirements**:

- Validate input for coin generation
- Reject invalid requests
- Concurrency handling
- Integrate with frontend/backend

##### ✅ Frontend - What's Already Done:

- ✅ Coin generation from text prompt working (`src/components/AIGenerator/CoinDesignInterface.tsx`)
- ✅ Coin generation from image upload working
- ✅ Basic AI generation form UI exists
- ✅ Generate button working
- ✅ Image upload functionality working

##### ❌ Frontend - What's Pending:

- ❌ Input validation UI (show errors before API call)
- ❌ Character count display for prompts (min 10, max 1000)
- ❌ File size validation display (max 10MB)
- ❌ File format validation display (jpg, png, webp)
- ❌ Validation error messages
- ❌ Queue position display component
- ❌ Generation status indicator (QUEUED, PROCESSING, COMPLETED, FAILED)
- ❌ Estimated wait time display
- ❌ Cancel generation button
- ❌ Generation progress indicator

---

#### 4.2 Rate Limiting

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Priority**: High  
**Frontend UI Status**: ❌ NOT READY  
**Backend Status**: ✅ FULLY IMPLEMENTED

---

##### 📋 Feature Overview

**Requirements**:

- IP-based limit (2–3 requests)
- Error messages and logging for monitoring
- Get rate limit store (Redis if available, otherwise in-memory)
- Note: Redis store will be initialized after packages are installed

##### ✅ Frontend - What's Already Done:

- ❌ **Nothing done in frontend yet**

##### ✅ Backend - What's Already Done:

- ✅ IP-based rate limiting (2-3 requests per time window)
- ✅ User-based rate limiting (100 req/min for authenticated users)
- ✅ Error messages and logging
- ✅ Redis store for rate limiting (Redis if available, otherwise in-memory)

##### ❌ Frontend - What's Pending:

- ❌ Rate limit error handling (catch 429 status code)
- ❌ Rate limit error message display
- ❌ Remaining requests counter
- ❌ Retry-after countdown timer
- ❌ Rate limit indicator component
- ❌ Disable submit button when limit reached
- ❌ Show "Rate limit exceeded" message with details

---

##### 🔧 Backend Implementation

**Status**: ✅ **FULLY IMPLEMENTED**

**What's Done**:

- ✅ IP-based rate limiting (2-3 requests per time window)
- ✅ User-based rate limiting (100 req/min for authenticated users)
- ✅ Error messages and logging
- ✅ Redis store for rate limiting (Redis if available, otherwise in-memory)
- ✅ Note: Redis store will be initialized after packages are installed

**Backend Returns**:

- 429 status code with error details
- Error response includes: `retryAfter`, `limit`, `remaining`, `code`

---

##### 🎨 Frontend Implementation

**Estimated Time**: 2-3 days

**Step 1: Rate Limit Error Handling**

- Catch 429 status code
- Parse rate limit error response
- Show user-friendly messages
- Display remaining requests count
- Show reset time countdown

**Step 2: Rate Limit UI**

- Show request counter
- Display limit status
- Disable submit button when limit reached
- Show "Rate limit exceeded" message
- Display retry-after information

**Files to Create**:

- `src/components/common/RateLimitIndicator/index.tsx` (NEW)
- `src/hooks/useRateLimit.ts` (CREATE hook for rate limit tracking)

**Files to Modify**:

- `src/services/apiServices.ts` (ADD rate limit error handling)
- `src/components/AIGenerator/CoinDesignInterface.tsx` (ADD rate limit UI)

**Frontend Tasks**:

- [ ] Add rate limit error handling (catch 429)
- [ ] Parse rate limit error response
- [ ] Show user-friendly error messages
- [ ] Display remaining requests counter
- [ ] Add retry-after countdown timer
- [ ] Create rate limit indicator component
- [ ] Disable submit button when limit reached
- [ ] Show "Rate limit exceeded" message

---

## 5. SAVE DRAFT

#### 5.1 Save As Draft Feature for Login USER

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Priority**: Medium  
**Frontend UI Status**: ⚠️ PARTIALLY READY  
**Backend Status**: ❌ NOT STARTED

---

##### 📋 Feature Overview

**Requirements**:

- Save As Draft Feature for login USER
- API Design

##### ✅ Frontend - What's Already Done:

- ✅ Save as Draft button exists in design-summary (`src/containers/design-summary/index.tsx`)
- ✅ Can save design with DRAFT status (line 226: `status: status`)
- ✅ Draft save functionality working (saves with `status: "DRAFT"`)
- ✅ Image upload to S3 working for drafts
- ✅ Different toast message for draft vs submitted

##### ⚠️ Frontend - What's Partially Done:

- ⚠️ Save draft exists in **design-summary only** (not in other design steps)
- ⚠️ Basic save working, but **no draft management UI**

##### ❌ Frontend - What's Pending:

- ❌ Draft list page (`src/containers/drafts/index.tsx`)
- ❌ Draft card component (`src/components/DraftCard/index.tsx`)
- ❌ Load draft functionality
- ❌ Update draft functionality
- ❌ Delete draft functionality
- ❌ Continue editing from draft button
- ❌ Submit draft as final design button
- ❌ Auto-save indicator
- ❌ Last saved time display
- ❌ Unsaved changes warning
- ❌ Save draft in other design steps:
  - ❌ Coin Design Interface (`src/components/AIGenerator/CoinDesignInterface.tsx` - has placeholder `handleSaveDraft` at line 201)
  - ❌ 3D Render page (`src/components/AIGenerator/ThreeDRender.tsx`)
  - ❌ Standard Builder steps
  - ❌ AI Generator flow

---

##### 🔧 Backend Implementation

**Estimated Time**: 2 weeks

**Step 1: Draft Management API**

- `POST /api/designs/draft` - Save as draft
- `GET /api/designs/drafts` - Get all user drafts
- `GET /api/designs/drafts/:draftId` - Get specific draft
- `PUT /api/designs/drafts/:draftId` - Update draft
- `DELETE /api/designs/drafts/:draftId` - Delete draft
- `POST /api/designs/drafts/:draftId/submit` - Submit draft (convert to quote)

**Step 2: Database Schema**

- Use existing CoinDesign model with `status=DRAFT`
- Add `isDraft` boolean flag
- Add `draftExpiresAt` timestamp
- Add `lastSavedAt` timestamp

**Step 3: Auto-save Feature**

- Auto-save draft every 30 seconds while editing
- Save on blur/change events
- Background job to delete expired drafts (30 days)

**Files to Create/Modify**:

- `src/services/design.service.ts` (ENHANCE)
- `src/controllers/design.controller.ts` (ENHANCE)
- `src/routes/design.route.ts` (ENHANCE)
- `src/validators/coinDesign.validator.ts` (ENHANCE)

**API Endpoints**:

```
POST /api/designs/draft - Save as draft
GET /api/designs/drafts - Get all user drafts
GET /api/designs/drafts/:draftId - Get specific draft
PUT /api/designs/drafts/:draftId - Update draft
DELETE /api/designs/drafts/:draftId - Delete draft
POST /api/designs/drafts/:draftId/submit - Submit draft (convert to quote)
```

---

##### 🎨 Frontend Implementation

**Estimated Time**: 1 week

**Step 1: Save Draft in All Design Steps**

- Design Summary (already done)
- Coin Design Interface
- 3D Render page
- Standard Builder steps
- AI Generator flow

**Step 2: Draft List Page**

- Create `src/containers/drafts/index.tsx`
- List all user drafts
- Draft preview
- Draft metadata (last saved, name)

**Step 3: Draft Management**

- Continue editing from draft
- Submit draft as final design
- Delete draft
- Load draft into design state

**Step 4: Auto-save Indicator**

- Show "Draft saved" notification
- Display last saved time
- Show unsaved changes warning

**Files to Create**:

- `src/containers/drafts/index.tsx` (NEW)
- `src/components/DraftCard/index.tsx` (NEW)

**Files to Modify**:

- `src/components/AIGenerator/CoinDesignInterface.tsx` (ADD save draft - replace placeholder at line 201)
- `src/components/AIGenerator/ThreeDRender.tsx` (ADD save draft)
- `src/services/apiServices.ts` (ADD draft APIs)
- `src/hooks/useQueries.ts` (ADD draft hooks)
- `src/store/useStandardBuilderStore.ts` (ADD draft save/load)
- `src/store/useCoinStore.ts` (ADD draft save/load)

**Frontend Tasks**:

- [ ] Create draft list page
- [ ] Create draft card component
- [ ] Add load draft functionality
- [ ] Add update draft functionality
- [ ] Add delete draft functionality
- [ ] Add continue editing from draft button
- [ ] Add submit draft as final design button
- [ ] Add auto-save indicator
- [ ] Add last saved time display
- [ ] Add unsaved changes warning
- [ ] Implement save draft in Coin Design Interface (replace placeholder)
- [ ] Implement save draft in 3D Render page
- [ ] Implement save draft in Standard Builder steps
- [ ] Implement save draft in AI Generator flow

---

## 🚀 Features to Implement

### 1. User Dashboard - Payment Methods

#### 1.1 QuickBooks Integration ⚠️ **HIGH PRIORITY**

**Status**: Not Implemented  
**Current State**: UI exists but commented out in `paymentOptions` arrays

**Requirements**:

- Connect dashboard to QuickBooks API
- Secure authentication and data handling
- Update user dashboard with transactions
- Error handling for failed connections

**Implementation Approach**:

**Step 1: Backend API Integration**

- Create `createQuickBooksPayment` API service function
- Add QuickBooks OAuth flow initiation endpoint
- Add QuickBooks payment processing endpoint
- Handle QuickBooks webhook callbacks

**Step 2: Frontend Integration**

- Uncomment QuickBooks option in payment method selection
- Create QuickBooks OAuth flow component
- Add QuickBooks payment form/modal
- Implement payment status polling

**Step 3: Error Handling**

- Handle OAuth failures
- Handle payment processing errors
- Display user-friendly error messages
- Retry mechanism for failed payments

**Step 4: Dashboard Updates**

- Real-time transaction updates via WebSocket or polling
- Update payment status indicators
- Show QuickBooks transaction history

**Files to Modify**:

- `src/containers/payment-method/data.ts` - Uncomment QuickBooks option
- `src/components/PaymentMethodModal.tsx/data.ts` - Uncomment QuickBooks option
- `src/services/apiServices.ts` - Add QuickBooks API functions
- `src/hooks/useQueries.ts` - Add QuickBooks mutation hooks
- Create `src/components/QuickBooksPayment/index.tsx` - New component

**API Endpoints (Backend to Implement)**:

```
POST /api/quickbooks/connect - Initiate OAuth flow
GET /api/quickbooks/callback - OAuth callback handler
POST /api/quickbooks/invoice/create - Create invoice for quote
GET /api/quickbooks/transactions - Get user's QuickBooks transactions
POST /api/quickbooks/sync - Manual sync trigger
```

**Frontend Implementation**:

- Uncomment QuickBooks option in payment method selection
- Create QuickBooks OAuth flow component
- Add QuickBooks payment form/modal
- Implement payment status polling
- Handle OAuth errors and token refresh

---

#### 1.2 Stripe Integration Enhancement ⚠️ **MEDIUM PRIORITY**

**Status**: Partially Implemented  
**Current State**: Basic Stripe checkout exists, needs enhancements

**Requirements**:

- Real-time status updates
- Handle errors and duplicate submissions
- Receipt generation

**Implementation Approach**:

**Step 1: Real-time Status Updates**

- Implement WebSocket connection or polling for payment status
- Update payment status in real-time after checkout
- Show loading states during payment processing
- Auto-refresh payment history after successful payment

**Step 2: Error Handling**

- Handle Stripe API errors gracefully
- Prevent duplicate payment submissions
- Show retry options for failed payments
- Log errors for debugging

**Step 3: Receipt Generation**

- Generate PDF receipt after successful payment
- Email receipt to user
- Store receipt in user's payment history
- Add download receipt button in payment history

**Step 4: Duplicate Prevention**

- Add payment ID tracking
- Disable payment button after submission
- Show "Processing" state during payment
- Prevent multiple checkout sessions for same quote

**Files to Modify**:

- `src/components/PayNowModal/index.tsx` - Add status polling
- `src/containers/payment-history/index.tsx` - Connect to API, add receipt download
- `src/services/apiServices.ts` - Add receipt generation endpoint
- `src/hooks/useQueries.ts` - Add receipt query hook

**API Endpoints (Backend to Implement)**:

```
GET /api/payments/:paymentId/receipt - Download receipt
POST /api/payments/:paymentId/receipt/generate - Generate receipt
WebSocket: payment-status-updates channel - Real-time status updates
```

**Frontend Implementation**:

- Connect to WebSocket for real-time payment status
- Add receipt download button in payment history
- Show receipt generation status
- Handle duplicate submission prevention (idempotency key)
- Display real-time payment status updates

---

#### 1.3 Manual Invoice Enhancement ⚠️ **LOW PRIORITY**

**Status**: Partially Implemented  
**Current State**: Basic form exists with image upload

**Requirements**:

- Validate and save payment details
- Dashboard updates and notifications

**Implementation Approach**:

**Step 1: Enhanced Validation**

- Validate payment amount matches quote
- Validate payment proof image quality
- Validate bank account details (if provided)
- Client-side and server-side validation

**Step 2: Dashboard Updates**

- Real-time notification when admin verifies payment
- Update payment status automatically
- Show pending verification state
- Display verification timeline

**Step 3: Notifications**

- Email notification when payment proof is uploaded
- Email notification when payment is verified/rejected
- In-app notification badge
- SMS notification (optional)

**Files to Modify**:

- `src/components/PayNowModal/index.tsx` - Enhance validation
- `src/containers/payment-history/index.tsx` - Add status updates
- `src/services/apiServices.ts` - Add notification endpoints
- Create notification system component

**API Endpoints Needed**:

```
POST /payment/manual/validate
GET /payment/manual/:paymentId/status
POST /payment/manual/:paymentId/notify
```

---

#### 1.4 Payment History - Payment History API ⚠️ **HIGH PRIORITY**

**Status**: Not Implemented (Using Mock Data)  
**Current State**: UI exists but uses static data

**Requirements**:

- Fetch all transactions with sorting/filtering
- Secure access per user
- Error handling and data accuracy

**Implementation Approach**:

**Step 1: API Integration**

- Connect to `getUserOrderHistory` API (already exists)
- Replace mock data with API data
- Handle loading and error states
- Implement pagination if needed

**Step 2: Sorting & Filtering**

- Sort by date (newest/oldest)
- Filter by payment method
- Filter by date range
- Filter by status
- Search by order ID

**Step 3: Security**

- Ensure user can only see their own payments
- Validate API responses
- Handle unauthorized access
- Secure data transmission

**Step 4: Data Accuracy**

- Validate payment data format
- Handle missing/null fields gracefully
- Format currency correctly
- Format dates consistently

**Files to Modify**:

- `src/containers/payment-history/index.tsx` - Replace mock data with API
- `src/containers/payment-history/data.ts` - Remove or keep as fallback
- `src/containers/payment-history/types.ts` - Update types to match API
- `src/components/common/Table/index.tsx` - Enhance sorting/filtering

**API Endpoints (Backend to Enhance)**:

```
GET /api/order/user/history (exists, needs enhancement)
GET /api/order/user/history?sortBy=date&sortOrder=desc&status=SUCCESS&method=STRIPE&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&page=1&limit=20
```

**Frontend Implementation**:

- Replace mock data with API call
- Add sorting controls (date, amount, status)
- Add filtering UI (status, method, date range)
- Add pagination controls
- Handle loading and error states
- Display payment details (invoice number, transaction ID)

---

### 2. Admin Dashboard - Payment Methods

#### 2.1 Admin Payment Methods - QuickBooks Integration ⚠️ **HIGH PRIORITY**

**Status**: Not Implemented  
**Current State**: Placeholder component with dummy API call

**Requirements**:

- Admin panel monitoring for QuickBooks
- API handling and mapping to orders
- Error and sync management

**Implementation Approach**:

**Step 1: QuickBooks Connection Management**

- Admin can connect/disconnect QuickBooks account
- Show connection status
- Display last sync time
- Manual sync trigger button

**Step 2: Transaction Monitoring**

- Display all QuickBooks transactions
- Map transactions to orders
- Show unmatched transactions
- Allow manual mapping

**Step 3: Sync Management**

- Automatic sync scheduling
- Manual sync trigger
- Sync status indicators
- Sync error logging and display

**Step 4: Error Handling**

- Handle QuickBooks API errors
- Handle sync failures
- Retry failed syncs
- Alert admin of critical errors

**Files to Create/Modify**:

- `src/containers/admin/payment-method/index.tsx` - Complete rewrite
- Create `src/components/admin/QuickBooksConnection/index.tsx`
- Create `src/components/admin/QuickBooksSync/index.tsx`
- `src/services/apiServices.ts` - Add admin QuickBooks APIs
- `src/hooks/useQueries.ts` - Add admin QuickBooks hooks

**API Endpoints (Backend to Implement)**:

```
GET /api/admin/quickbooks/connections - View all QuickBooks connections
GET /api/admin/quickbooks/sync-status - View sync status
POST /api/admin/quickbooks/sync/:paymentId - Manual sync for specific payment
GET /api/admin/quickbooks/errors - View sync errors
GET /api/admin/quickbooks/transactions - View all QuickBooks transactions
POST /api/admin/quickbooks/map-transaction - Map transaction to order
```

**Frontend Implementation**:

- Create admin QuickBooks dashboard
- Display connection status for all users
- Show sync status and errors
- Manual sync trigger UI
- Transaction mapping interface
- Error log viewer

---

#### 2.2 Admin Payment Methods - Stripe Integration ⚠️ **MEDIUM PRIORITY**

**Status**: Not Implemented  
**Current State**: No admin Stripe interface

**Requirements**:

- Stripe integration for admin oversight
- Reporting, filtering, reconciliation
- Multi-currency support and error handling

**Implementation Approach**:

**Step 1: Stripe Dashboard Overview**

- Display Stripe account status
- Show total revenue
- Display recent transactions
- Show failed payment attempts

**Step 2: Reporting & Filtering**

- Revenue reports (daily, weekly, monthly)
- Payment method breakdown
- Customer payment history
- Refund tracking
- Filter by date range, status, amount

**Step 3: Reconciliation**

- Match Stripe transactions with orders
- Identify unmatched payments
- Manual reconciliation tool
- Reconciliation reports

**Step 4: Multi-currency Support**

- Display amounts in original currency
- Currency conversion rates
- Multi-currency reports
- Currency filter

**Step 5: Error Handling**

- Display Stripe API errors
- Handle webhook failures
- Retry failed operations
- Alert system for critical issues

**Files to Create/Modify**:

- Create `src/containers/admin/stripe-dashboard/index.tsx`
- Create `src/components/admin/StripeReports/index.tsx`
- Create `src/components/admin/StripeReconciliation/index.tsx`
- `src/services/apiServices.ts` - Add admin Stripe APIs
- `src/hooks/useQueries.ts` - Add admin Stripe hooks

**API Endpoints (Backend to Implement)**:

```
GET /api/admin/stripe/reports - Get revenue reports (daily, weekly, monthly, yearly)
GET /api/admin/stripe/reconcile - Reconciliation data
GET /api/admin/stripe/export - Export to CSV/Excel
GET /api/admin/stripe/currencies - Get supported currencies
POST /api/admin/stripe/reconcile/run - Run reconciliation job
```

**Frontend Implementation**:

- Create Stripe reporting dashboard
- Revenue charts and graphs
- Payment method breakdown
- Refund tracking
- Filtering and search UI
- Export functionality
- Multi-currency display
- Reconciliation interface

---

#### 2.3 Admin Payment Methods - Manual Invoice ⚠️ **MEDIUM PRIORITY**

**Status**: Not Implemented  
**Current State**: No admin manual invoice interface

**Requirements**:

- Admin can generate and track manual invoices
- Validate data and save to backend
- Status updates for users

**Implementation Approach**:

**Step 1: Invoice Generation**

- Create manual invoice form
- Generate invoice PDF
- Assign invoice number
- Set due date and terms

**Step 2: Invoice Management**

- List all manual invoices
- Filter by status, customer, date
- View invoice details
- Edit invoice (before payment)

**Step 3: Payment Verification**

- Review uploaded payment proofs
- Approve or reject payments
- Add admin notes
- Update invoice status

**Step 4: User Notifications**

- Notify user when invoice is created
- Notify user when payment is verified
- Notify user when payment is rejected
- Email invoice to user

**Files to Create/Modify**:

- Create `src/containers/admin/manual-invoice/index.tsx`
- Create `src/components/admin/InvoiceGenerator/index.tsx`
- Create `src/components/admin/InvoiceList/index.tsx`
- Create `src/components/admin/PaymentVerification/index.tsx`
- `src/services/apiServices.ts` - Add manual invoice APIs
- `src/hooks/useQueries.ts` - Add manual invoice hooks

**API Endpoints (Backend to Implement)**:

```
POST /api/admin/invoice/create - Generate invoice
GET /api/admin/invoice/list - List all invoices
GET /api/admin/invoice/:id - Get invoice details
PUT /api/admin/invoice/:id - Update invoice
POST /api/admin/invoice/:id/send - Send invoice to user
GET /api/admin/invoice/:id/pdf - Download invoice PDF
POST /api/admin/invoice/:id/mark-paid - Mark as paid manually
```

**Frontend Implementation**:

- Create invoice generator form
- Invoice list with filtering
- Invoice preview and PDF download
- Send invoice functionality
- Invoice status tracking
- Payment proof viewing (already exists)

---

#### 2.4 Admin Payment History - Payment History API ⚠️ **LOW PRIORITY**

**Status**: Fully Implemented  
**Current State**: Working with `getAdminOrderHistory` API

**Requirements**:

- Retrieve all payment transactions
- Sorting/filtering and secure access
- Sync with user dashboard

**Implementation Approach**:

**Step 1: Enhance Existing Implementation**

- Add more filter options (payment method, status, date range)
- Add export functionality (CSV, PDF)
- Add bulk actions
- Improve search functionality

**Step 2: Sync with User Dashboard**

- Ensure data consistency
- Real-time updates when user makes payment
- Show user payment status changes

**Step 3: Additional Features**

- Payment analytics dashboard
- Revenue charts
- Payment trends
- Customer payment patterns

**Files to Modify**:

- `src/containers/admin/payment-history/index.tsx` - Enhance filters
- Create `src/components/admin/PaymentAnalytics/index.tsx`
- `src/services/apiServices.ts` - Add export endpoints

**API Endpoints Needed**:

```
GET /admin/payment-history/export?format=csv&filters=...
GET /admin/payment-history/analytics
```

---

### 3. AI Functionality

#### 3.1 Implement API Filter for Coin Generation ⚠️ **HIGH PRIORITY**

**Status**: Not Implemented  
**Current State**: Coin generation API exists but lacks input validation and filtering

**Requirements**:

- Validate input for coin generation
- Reject invalid requests
- Concurrency handling
- Integrate with frontend/backend

**Implementation Approach**:

**Step 1: Input Validation (Frontend)**

- Validate prompt length (min 10, max 1000 characters) - matches backend
- Validate image file size (max 10MB) - matches backend
- Validate image format (jpg, png, webp) - matches backend
- Validate image dimensions (max 4096x4096) - matches backend
- Sanitize prompt content (remove prohibited content)
- Show validation errors before API call
- Disable submit button if validation fails

**Step 2: Request Filtering (Frontend)**

- Check user authentication status
- Show rate limit status to user
- Display remaining requests
- Check for duplicate requests (prevent double-click)
- Show queue position if requests are queued
- Display generation status

**Step 3: Concurrency Handling**

- Implement request queuing system
- Limit concurrent requests per user
- Add request status tracking
- Handle request cancellation
- Show queue position to user

**Step 4: Frontend Integration**

- Add validation before API calls
- Show validation errors to user
- Display request status (queued, processing, completed)
- Handle API errors gracefully
- Disable submit button during processing

**Step 5: Backend Integration**

- Implement rate limiting middleware
- Add request validation middleware
- Queue management system
- Request status tracking
- Error response formatting

**Files to Create/Modify**:

- `src/services/apiServices.ts` - Add validation functions
- `src/components/AIGenerator/CoinDesignInterface.tsx` - Add input validation
- `src/components/AIGenerator/CoinPromptBox.tsx` - Add validation
- `src/utils/validation.ts` - Create validation utilities
- `src/hooks/useQueries.ts` - Add validation hooks
- Create `src/components/common/RequestQueue/index.tsx` - Queue status component

**API Endpoints (Backend to Implement/Enhance)**:

```
POST /api/ai-flow/generate (enhance with validation middleware)
GET /api/ai-flow/generation-status/:requestId - Check generation status
GET /api/ai-flow/queue-position/:userId - Get queue position
POST /api/ai-flow/cancel/:requestId - Cancel pending generation
```

**Frontend Implementation**:

- Add validation before API call
- Show validation errors immediately
- Display queue position if queued
- Show generation progress
- Allow cancellation of pending requests
- Poll for status updates
- Handle rate limit errors gracefully

---

#### 3.2 Rate Limiting ⚠️ **HIGH PRIORITY**

**Status**: Not Implemented  
**Current State**: No rate limiting on frontend or backend

**Requirements**:

- IP-based limit (2-3 requests)
- Error messages and logging for monitoring

**Implementation Approach**:

**Step 1: Frontend Rate Limit Handling**

- Backend already implements rate limiting (2-3 requests per time window)
- Frontend handles rate limit error responses
- Parse rate limit headers (X-RateLimit-Remaining, X-RateLimit-Reset)
- Show user-friendly messages based on rate limit status
- Display remaining requests count
- Show reset time countdown
- Disable submit button when limit reached

**Step 2: Backend Rate Limiting Integration (Already Implemented)**

- Backend returns 429 status code with rate limit info
- Frontend catches 429 errors
- Parse error response for rate limit details
- Show user-friendly messages
- Display retry-after information
- Log rate limit violations (optional, for monitoring)

**Step 3: Error Messages**

- Clear message: "Rate limit exceeded. Please try again in X minutes"
- Show remaining requests: "You have 1 request remaining"
- Display reset time: "Limit resets at [time]"
- Provide upgrade option (if applicable)
- Link to help/documentation

**Step 4: Logging & Monitoring**

- Log rate limit violations
- Track rate limit metrics
- Monitor API usage patterns
- Alert on unusual activity
- Generate usage reports

**Step 5: User Experience**

- Show request counter in UI
- Display progress indicator
- Provide clear feedback
- Suggest alternatives when limited
- Remember user's limit status

**Files to Create/Modify**:

- Create `src/utils/rateLimiter.ts` - Rate limiting utility
- `src/services/apiServices.ts` - Handle rate limit responses
- `src/components/AIGenerator/CoinDesignInterface.tsx` - Add rate limit UI
- `src/components/common/RateLimitIndicator/index.tsx` - New component
- `src/hooks/useRateLimit.ts` - New hook for rate limit tracking

**API Endpoints (Backend Already Implements)**:

- Rate limiting is handled automatically by backend middleware
- Frontend receives rate limit info in error responses
- No separate endpoint needed (rate limit info in headers/error response)

**Rate Limit Configuration (Backend)**:

- **IP-based**: 2-3 requests per time window
- **Authenticated Users**: 100 requests per minute
- **Reset Window**: Configured on backend
- Frontend displays whatever backend enforces

---

### 4. Save Draft Feature

#### 4.1 Save As Draft for Logged-in Users ⚠️ **HIGH PRIORITY**

**Status**: Partially Implemented  
**Current State**: Save as Draft exists in design-summary but needs API design and full implementation

**Requirements**:

- Save As Draft Feature for logged-in users
- API Design
- Persist draft data
- Load saved drafts
- Update existing drafts

**Implementation Approach**:

**Step 1: API Design**

**Draft Data Structure**:

```typescript
interface DraftDesign {
  id: string;
  userId: string;
  name: string;
  status: "DRAFT";
  designData: {
    dimensions?: CoinDimensions;
    material?: string;
    edgeType?: string;
    artwork?: ArtworkData;
    packaging?: PackagingData;
    textRings?: TextRingsData;
  };
  createdAt: string;
  updatedAt: string;
}
```

**API Endpoints (Backend to Implement)**:

```
POST /api/designs/draft - Save design as draft
GET /api/designs/drafts - Get all user drafts
GET /api/designs/drafts/:draftId - Get specific draft
PUT /api/designs/drafts/:draftId - Update draft
DELETE /api/designs/drafts/:draftId - Delete draft
POST /api/designs/drafts/:draftId/submit - Submit draft (convert to quote)
```

**Note**: Backend will use existing CoinDesign model with `status=DRAFT` and add `isDraft`, `draftExpiresAt`, `lastSavedAt` fields

**Step 2: Frontend Implementation**

- Add "Save Draft" button in all design steps
- Auto-save functionality (optional, every 30 seconds)
- Draft list view for user
- Load draft functionality
- Update draft on changes
- Delete draft option

**Step 3: Draft Management UI**

- Draft list page/section
- Draft preview
- Draft metadata (last saved, name)
- Continue editing from draft
- Submit draft as final design
- Delete draft confirmation

**Step 4: State Management**

- Save current design state to draft
- Load draft into design state
- Track unsaved changes
- Warn before leaving with unsaved changes
- Sync draft status across components

**Step 5: Integration Points**

- Design Summary page (already implemented)
- Coin Design Interface
- 3D Render page
- Standard Builder steps
- AI Generator flow

**Files to Create/Modify**:

- `src/services/apiServices.ts` - Add draft API functions
- `src/hooks/useQueries.ts` - Add draft hooks
- `src/containers/design-summary/index.tsx` - Already has save draft
- `src/components/AIGenerator/CoinDesignInterface.tsx` - Add save draft
- `src/components/AIGenerator/ThreeDRender.tsx` - Add save draft
- Create `src/containers/drafts/index.tsx` - Draft list page
- Create `src/components/DraftCard/index.tsx` - Draft card component
- `src/store/useStandardBuilderStore.ts` - Add draft save/load
- `src/store/useCoinStore.ts` - Add draft save/load

**API Endpoints Needed**:

```
POST /design/draft/create
GET /design/draft/list
GET /design/draft/:id
PUT /design/draft/:id
DELETE /design/draft/:id
POST /design/draft/:id/submit
```

**Draft Features**:

- Auto-save (optional, configurable)
- Manual save on button click
- Draft naming (user can name drafts)
- Draft preview thumbnail
- Draft versioning (optional)
- Draft expiration (optional, auto-delete after 30 days)

---

### 5. User Orders API

#### 5.1 Move to Next Step Only If Paid ⚠️ **HIGH PRIORITY**

**Status**: Not Implemented  
**Current State**: Order flow doesn't check payment status before allowing progression

**Requirements**:

- API Integration at frontend
- Check payment status before allowing next step
- Block progression if unpaid
- Show payment required message

**Implementation Approach**:

**Step 1: Payment Status Check**

- Add payment status field to order/quote data
- Check payment status before rendering next step button
- Validate payment status on component mount
- Poll payment status if pending
- Handle payment status changes

**Step 2: Frontend Integration**

- Add payment status check in order flow components
- Disable "Next Step" button if unpaid
- Show payment required message
- Link to payment page
- Show payment status indicator

**Step 3: Order Flow Components**

- Update order tracking component
- Update order details component
- Update order status component
- Add payment gate component
- Update navigation/routing logic

**Step 4: User Experience**

- Clear message: "Payment required to proceed"
- Show payment amount
- Direct link to payment page
- Show payment status badge
- Display payment deadline (if applicable)

**Step 5: Error Handling**

- Handle payment status API errors
- Handle payment verification delays
- Show retry option
- Log payment status check failures
- Fallback to manual verification

**Files to Modify**:

- `src/containers/orders/index.tsx` - Add payment status check
- `src/containers/tracking/index.tsx` - Add payment gate
- `src/components/OrderStatus/index.tsx` - Add payment status
- `src/services/apiServices.ts` - Add payment status check function
- `src/hooks/useQueries.ts` - Add payment status query
- Create `src/components/PaymentGate/index.tsx` - Payment gate component

**API Endpoints (Backend to Implement)**:

```
GET /api/orders/:orderId/payment-status - Check if order is paid
POST /api/orders/:orderId/proceed - Proceed to next step (validates payment)
GET /api/quotes/:quoteId/can-proceed - Check if quote can proceed
```

**Frontend Implementation**:

- Call payment status API before showing "Next Step" button
- Disable button if payment not completed
- Show payment required message
- Link to payment page
- Auto-enable button when payment completes (poll or WebSocket)
- Display payment status badge

**Payment Status Values**:

- `PAID` - Payment completed, can proceed
- `PENDING` - Payment in progress, wait
- `UNPAID` - Payment required, block progression
- `FAILED` - Payment failed, retry required
- `REFUNDED` - Payment refunded, may need new payment

---

#### 5.2 Show Paid/Unpaid Orders ⚠️ **HIGH PRIORITY**

**Status**: Not Implemented  
**Current State**: Orders list doesn't show payment status clearly

**Requirements**:

- Fetch all orders with payment status
- Filtering, sorting, real-time updates

**Implementation Approach**:

**Step 1: Payment Status Display**

- Add payment status column to orders table
- Show payment status badge/indicator
- Color-code status (green=paid, red=unpaid, yellow=pending)
- Show payment method if paid
- Display payment date if paid

**Step 2: Filtering**

- Filter by payment status (All, Paid, Unpaid, Pending)
- Filter by payment method
- Filter by date range
- Combine multiple filters
- Save filter preferences

**Step 3: Sorting**

- Sort by payment status
- Sort by payment date
- Sort by order date
- Sort by amount
- Multi-column sorting

**Step 4: Real-time Updates**

- Poll payment status for pending orders
- Update status automatically when payment completes
- Show notification when payment status changes
- Refresh order list on payment completion
- WebSocket updates (optional, future)

**Step 5: Order Actions Based on Status**

- "Pay Now" button for unpaid orders
- "View Receipt" for paid orders
- "Track Order" for paid orders
- "Cancel Order" for unpaid orders (if allowed)
- "Retry Payment" for failed payments

**Files to Modify**:

- `src/containers/orders/index.tsx` - Add payment status column and filters
- `src/containers/orders/types.ts` - Add payment status types
- `src/components/common/Table/index.tsx` - Enhance filtering
- `src/services/apiServices.ts` - Ensure payment status in order data
- `src/hooks/useQueries.ts` - Add payment status polling
- Create `src/components/PaymentStatusBadge/index.tsx` - Status badge component

**API Endpoints (Backend to Enhance)**:

```
GET /api/order/user - Enhanced to include payment status
GET /api/order/user?paymentStatus=PAID|UNPAID|PENDING - Filter by payment status
GET /api/order/user?sortBy=paymentStatus&sortOrder=asc - Sort by payment status
GET /api/orders/:orderId/payment-details - Get payment details for order
```

**Frontend Implementation**:

- Add payment status column to orders table
- Add payment status badge (PAID/UNPAID/PENDING)
- Add filter dropdown for payment status
- Add sorting by payment status
- Show "Pay Now" button for unpaid orders
- Show "View Receipt" for paid orders
- Real-time updates when payment status changes (WebSocket or polling)

**Payment Status Indicators**:

- **Paid**: Green badge, checkmark icon, payment method shown
- **Unpaid**: Red badge, alert icon, "Pay Now" button
- **Pending**: Yellow badge, clock icon, "Processing" text
- **Failed**: Red badge, X icon, "Retry Payment" button
- **Refunded**: Gray badge, refund icon, refund amount shown

---

## ❌ Out of Scope Features

The following features are **explicitly out of scope** for this implementation:

1. **Payment Gateway Integration Beyond Stripe/QuickBooks**
   - PayPal, Square, or other payment gateways
   - Cryptocurrency payments
   - Bank wire transfers (beyond manual invoice)

2. **Advanced Accounting Features**
   - Full accounting system integration
   - Tax calculation and reporting
   - Financial statements generation
   - Budget management

3. **Subscription Management**
   - Recurring payments
   - Subscription plans
   - Auto-renewal management

4. **Advanced Fraud Detection**
   - AI-powered fraud detection
   - Risk scoring
   - Automated fraud prevention

5. **Multi-tenant Payment Processing**
   - White-label payment solutions
   - Custom payment branding
   - Reseller payment management

6. **Mobile App Payment Features**
   - Native mobile payment apps
   - Mobile-specific payment flows
   - Push notifications for mobile

7. **International Payment Regulations**
   - Tax compliance for all countries
   - Regional payment method support
   - Currency conversion for all currencies

---

## 📊 Implementation Priority Matrix

### High Priority (Phase 1)

1. ✅ User Payment History API Integration
2. ✅ QuickBooks Integration (User & Admin)
3. ✅ Admin Manual Invoice Management
4. ✅ **AI API Filter & Rate Limiting**
5. ✅ **Save Draft Feature (Full Implementation)**
6. ✅ **User Orders API - Payment Status Checks**

### Medium Priority (Phase 2)

7. ✅ Stripe Integration Enhancements
8. ✅ Admin Stripe Dashboard
9. ✅ Manual Invoice Enhancements
10. ✅ **Show Paid/Unpaid Orders with Filtering**

### Low Priority (Phase 3)

11. ✅ Admin Payment History Enhancements
12. ✅ Advanced Reporting Features
13. ✅ Analytics Dashboard
14. ✅ Draft Auto-save & Advanced Features

---

## 🏗️ Architecture & Technical Approach

### Frontend Architecture

**Component Structure**:

```
src/
├── containers/
│   ├── payment-method/          # User payment method selection
│   ├── payment-history/         # User payment history
│   └── admin/
│       ├── payment-method/       # Admin payment management
│       └── payment-history/     # Admin payment history
├── components/
│   ├── PaymentMethodModal/      # Payment selection modal
│   ├── PayNowModal/             # Payment processing modal
│   ├── QuickBooksPayment/       # QuickBooks payment flow
│   └── admin/
│       ├── QuickBooksConnection/ # QuickBooks admin tools
│       ├── StripeDashboard/     # Stripe admin dashboard
│       └── InvoiceGenerator/     # Manual invoice generator
├── services/
│   └── apiServices.ts           # All API service functions
├── hooks/
│   └── useQueries.ts            # React Query hooks
└── types/
    └── paymentPreferences.ts    # Payment type definitions
```

### State Management

- **React Query**: For server state (payments, history, preferences)
- **Zustand/Context**: For client state (selected payment method, modals)
- **Local Storage**: For payment preferences (optional)

### Error Handling Strategy

1. **API Errors**: Centralized error handling in `apiServices.ts`
2. **User Feedback**: Toast notifications for all errors
3. **Retry Logic**: Automatic retry for transient failures
4. **Error Logging**: Console logging + error tracking service (optional)

### Real-time Updates

**Option 1: Polling** (Recommended for MVP)

- Poll payment status every 5-10 seconds during processing
- Poll payment history every 30 seconds when on payment pages

**Option 2: WebSockets** (Future Enhancement)

- Real-time payment status updates
- Live transaction notifications
- Requires WebSocket server setup

### Security Considerations

1. **Authentication**: All payment APIs require valid JWT token
2. **Authorization**: User can only access their own payments
3. **Data Validation**: Client and server-side validation
4. **Sensitive Data**: Never store payment credentials in frontend
5. **HTTPS**: All API calls over HTTPS
6. **CORS**: Proper CORS configuration on backend

---

## 📝 Implementation Steps

### Phase 1: Critical Features (Weeks 1-5) - Aligned with Backend

**Week 1: User Orders API - Payment Verification**

- ✅ Backend: Payment verification middleware
- Frontend: Payment gate component
- Frontend: Payment status checks before order progression
- Frontend: Show paid/unpaid orders with filtering
- Frontend: Real-time payment status updates (WebSocket or polling)

**Week 2: AI Generation Filter - Validation & Concurrency**

- ✅ Backend: Input validation middleware
- ✅ Backend: Concurrency handling (queue system)
- Frontend: Input validation UI
- Frontend: Queue position display
- Frontend: Generation status polling
- Frontend: Cancel generation functionality
- Frontend: Rate limit error handling

**Weeks 3-4: QuickBooks Integration (User & Admin)**

- Backend: QuickBooks OAuth flow
- Backend: QuickBooks service layer
- Backend: Admin QuickBooks monitoring
- Frontend: QuickBooks OAuth flow UI
- Frontend: QuickBooks payment form
- Frontend: Admin QuickBooks dashboard
- Frontend: Sync management UI

**Week 5: Save Draft Feature**

- Backend: Draft management API
- Backend: Auto-save functionality
- Frontend: Save draft in all design steps
- Frontend: Draft list page
- Frontend: Load/update/delete drafts
- Frontend: Auto-save indicator

### Phase 2: Payment Enhancements (Weeks 6-9) - Aligned with Backend

**Week 6: Stripe Enhancements**

- ✅ Backend: Real-time updates (WebSocket)
- ✅ Backend: Receipt generation
- ✅ Backend: Duplicate submission handling (idempotency)
- Frontend: WebSocket connection for payment status
- Frontend: Receipt download functionality
- Frontend: Duplicate prevention UI
- Frontend: Enhanced error handling

**Week 7: Payment History Enhancements**

- Backend: Enhanced query parameters (sorting, filtering, pagination)
- Frontend: Replace mock data with API
- Frontend: Sorting controls
- Frontend: Filtering UI (status, method, date range)
- Frontend: Pagination
- Frontend: Export functionality (if backend provides)

**Week 8: Admin Stripe Reporting & Multi-currency**

- Backend: Stripe reporting service
- Backend: Reconciliation service
- Backend: Multi-currency support
- Frontend: Stripe reporting dashboard
- Frontend: Revenue charts
- Frontend: Reconciliation interface
- Frontend: Multi-currency display

**Week 9: Admin QuickBooks Monitoring & Sync**

- Backend: QuickBooks sync service
- Backend: Sync management
- Frontend: Admin QuickBooks dashboard
- Frontend: Sync status display
- Frontend: Manual sync triggers
- Frontend: Error log viewer

### Phase 3: Polish & Admin Features (Weeks 10-11) - Aligned with Backend

**Week 10: Manual Invoice Enhancements & Admin Invoice Generation**

- Backend: Invoice generation service
- Backend: Invoice management
- Frontend: Manual invoice enhancements (notifications, dashboard updates)
- Frontend: Admin invoice generator
- Frontend: Invoice list and management
- Frontend: Invoice PDF preview/download
- Frontend: Send invoice functionality

**Week 11: Testing, Documentation, Bug Fixes**

- End-to-end testing
- Integration testing
- Bug fixes
- Documentation updates
- Performance optimization
- Security review

## 🔄 Backend-Frontend Integration Points

### Real-time Updates

- **WebSocket Channels** (Backend to implement):
  - `payment-status-updates` - Payment status changes
  - `order-status-updates` - Order status changes
  - `generation-status-updates` - AI generation status
- **Frontend Implementation**:
  - Connect to WebSocket on mount
  - Subscribe to relevant channels
  - Update UI when messages received
  - Handle connection errors and reconnection

### API Response Formats

- **Payment Status Response**:

```typescript
{
  success: boolean;
  data: {
    orderId: string;
    paymentStatus: "PAID" | "UNPAID" | "PENDING" | "FAILED";
    paymentMethod?: "STRIPE" | "QUICKBOOKS" | "MANUAL";
    paymentId?: string;
    paidAt?: string;
  }
}
```

- **Rate Limit Error Response**:

```typescript
{
  success: false;
  error: {
    code: "RATE_LIMIT_EXCEEDED";
    message: string;
    retryAfter: number; // seconds
    limit: number;
    remaining: number;
  }
}
```

- **Generation Queue Response**:

```typescript
{
  success: boolean;
  data: {
    requestId: string;
    status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
    queuePosition?: number;
    estimatedWaitTime?: number; // seconds
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests

- Payment method selection logic
- Payment form validation
- API service functions
- Error handling functions

### Integration Tests

- Payment flow end-to-end
- QuickBooks OAuth flow
- Stripe checkout flow
- Manual payment upload

### E2E Tests

- Complete payment process
- Payment history viewing
- Admin payment management
- Error scenarios

---

## 📈 Success Metrics

1. **Functionality**
   - All payment methods working
   - 100% API integration
   - Zero critical bugs

2. **Performance**
   - Payment processing < 5 seconds
   - Page load < 2 seconds
   - API response < 1 second

3. **User Experience**
   - Clear error messages
   - Intuitive payment flows
   - Mobile-responsive design

4. **Security**
   - No security vulnerabilities
   - Proper authentication
   - Data encryption

---

## 🔄 Maintenance & Updates

### Regular Maintenance

- Monitor payment API health
- Update payment method logos
- Review and update error messages
- Performance optimization

### Future Enhancements

- WebSocket real-time updates
- Advanced analytics
- Mobile app integration
- Additional payment methods

---

## 📞 Dependencies

### Backend APIs Required

- Payment processing endpoints
- QuickBooks OAuth endpoints
- Payment history endpoints
- Receipt generation endpoints
- Notification endpoints

### Third-party Services

- Stripe SDK
- QuickBooks SDK
- PDF generation library
- Email service (for receipts)

### Frontend Libraries

- React Query (already in use)
- React Hook Form (for forms)
- Date-fns (for date formatting)
- React-PDF (for receipt generation)

---

## ✅ Checklist Summary

### User Dashboard

- [ ] QuickBooks Integration
- [ ] Stripe Integration Enhancements
- [ ] Manual Invoice Enhancements
- [ ] Payment History API Integration
- [ ] **Show Paid/Unpaid Orders**
- [ ] **Payment Status Checks in Order Flow**

### Admin Dashboard

- [ ] QuickBooks Integration
- [ ] Stripe Integration
- [ ] Manual Invoice Management
- [ ] Payment History Enhancements

### AI Functionality

- [ ] **API Filter for Coin Generation**
- [ ] **Rate Limiting (2-3 requests)**
- [ ] **Input Validation**
- [ ] **Concurrency Handling**

### Save Draft Feature

- [ ] **Draft API Design & Implementation**
- [ ] **Save Draft in All Design Steps**
- [ ] **Draft List & Management**
- [ ] **Load/Update/Delete Drafts**
- [ ] **Auto-save (Optional)**

### Common

- [ ] Error Handling
- [ ] Real-time Updates
- [ ] Receipt Generation
- [ ] Testing
- [ ] Documentation

---

---

## 📝 Backend Dependencies & Status

### Backend Services Required

- ✅ **Stripe SDK** - Already integrated
- ⚠️ **QuickBooks SDK** (`node-quickbooks` or `intuit-oauth`) - To be installed
- ✅ **Redis** - Already configured for rate limiting
- ⚠️ **PDF Generation** (`pdfkit` or `puppeteer`) - For receipts/invoices
- ⚠️ **Job Queue** (`bull` with `ioredis`) - For AI generation queue
- ✅ **WebSocket** - Already implemented (WebSocket service exists)

### Backend Database Schema Changes

- User model: Add QuickBooks OAuth fields
- Payment model: Add QuickBooks, receipt, idempotency, currency fields
- CoinDesign model: Add draft fields, generation queue fields
- New GenerationQueue model: For AI generation queue management

### Backend API Status Summary

- ✅ **Implemented**: Stripe checkout, Manual payments, Payment history (basic), Rate limiting
- ⚠️ **To Implement**: QuickBooks integration, Payment verification, Draft management, AI queue, Enhanced history
- ⚠️ **To Enhance**: Stripe (receipts, real-time), Payment history (filtering), Manual invoice (notifications)

---

## 🎯 Frontend Implementation Checklist (Aligned with Backend)

### High Priority (Phase 1)

- [ ] **Payment Status Checks** - Wait for backend API
- [ ] **Show Paid/Unpaid Orders** - Wait for backend enhancement
- [ ] **AI Generation Filter UI** - Wait for backend validation
- [ ] **Rate Limit Error Handling** - Backend ready, implement frontend
- [ ] **QuickBooks Integration** - Wait for backend implementation
- [ ] **Save Draft Feature** - Wait for backend API

### Medium Priority (Phase 2)

- [ ] **Stripe Real-time Updates** - Wait for backend WebSocket
- [ ] **Receipt Generation** - Wait for backend API
- [ ] **Payment History Filtering** - Wait for backend enhancement
- [ ] **Admin Stripe Dashboard** - Wait for backend reporting
- [ ] **Admin QuickBooks** - Wait for backend implementation

### Low Priority (Phase 3)

- [ ] **Manual Invoice Enhancements** - Wait for backend notifications
- [ ] **Admin Invoice Generation** - Wait for backend service

---

---

## 📋 Quick Status Summary

### ✅ COMPLETED (Ready to Use)

- ✅ Stripe basic checkout (User & Admin)
- ✅ Manual payment entry form (User)
- ✅ Admin payment approval workflow
- ✅ Admin payment history (basic)
- ✅ Rate limiting (Backend)
- ✅ AI coin generation (basic)
- ✅ Save as Draft (basic - design-summary only)

### ⚠️ IN PROGRESS / PARTIALLY DONE

- ⚠️ Stripe enhancements (real-time, receipts, duplicate prevention)
- ⚠️ Manual invoice enhancements (notifications, dashboard updates)
- ⚠️ Payment history filtering/sorting (User)
- ⚠️ AI generation validation & queue
- ⚠️ Rate limit frontend error handling

### 🔨 PENDING (Not Started)

- 🔨 QuickBooks integration (User & Admin)
- 🔨 Payment status checks (block progression if unpaid)
- 🔨 Show paid/unpaid orders with filtering
- 🔨 Save Draft full management (list, load, update, delete)
- 🔨 Admin Stripe reporting & reconciliation
- 🔨 Admin invoice generation

---

## 🎯 Implementation Priority (By Role)

### USER DASHBOARD Priority Order:

1. **High**: Payment status checks, Show paid/unpaid orders
2. **High**: QuickBooks integration
3. **Medium**: Stripe enhancements (real-time, receipts)
4. **Medium**: Payment history filtering/sorting
5. **Medium**: Save Draft full management
6. **Low**: Manual invoice enhancements

### ADMIN DASHBOARD Priority Order:

1. **High**: QuickBooks monitoring & sync
2. **Medium**: Stripe reporting & reconciliation
3. **Medium**: Invoice generation
4. **Low**: Payment history enhancements

### AI FUNCTIONALITY Priority Order:

1. **High**: API filter & validation
2. **High**: Rate limit frontend handling
3. **Medium**: Queue management UI

---

## 📅 Estimated Timeline

### Phase 1: Critical User Features (Weeks 1-3)

- Week 1: Payment status checks, Paid/unpaid orders
- Week 2: AI generation filter & validation
- Week 3: Rate limit frontend handling

### Phase 2: Payment Integrations (Weeks 4-7)

- Week 4-5: QuickBooks integration (User)
- Week 6: Stripe enhancements
- Week 7: Payment history enhancements

### Phase 3: Admin & Draft Features (Weeks 8-10)

- Week 8: QuickBooks admin monitoring
- Week 9: Admin Stripe reporting
- Week 10: Save Draft full management, Admin invoice generation

### Phase 4: Polish (Week 11)

- Testing, bug fixes, documentation

**Total Estimated Time**: 11 weeks

---

**Document Version**: 3.1  
**Last Updated**: 2024-12-15  
**Status**: Fully aligned with Backend Implementation Plan  
**Backend Plan Version**: 3.0 (2026-01-08)  
**Alignment**: ✅ Complete - All endpoints, timelines, and features match backend plan
