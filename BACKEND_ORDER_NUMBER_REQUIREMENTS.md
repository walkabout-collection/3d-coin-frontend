# Backend Order Number Generation Requirements

## Problem Statement

Currently, quotes don't have order numbers generated automatically. When a quote is approved and converted to an order, the order number should be generated and linked to both the quote and the order.

---

## Required Backend Changes

### 1. **Order Number Generation Strategy**

#### Option 1: Generate on Quote Creation (Recommended)

- **When**: Immediately when a quote is created
- **Where**: In the quote creation endpoint
- **Format**: `ORD-YYYYMMDD-XXXXX`
  - `ORD` - Prefix
  - `YYYYMMDD` - Date in format YYYYMMDD
  - `XXXXX` - 5-digit sequential number (resets daily or continues globally)

**Example**: `ORD-20241215-00001`

#### Option 2: Generate on Quote Approval

- **When**: When admin approves a quote
- **Where**: In the quote approval endpoint
- **Format**: Same as Option 1

**Recommendation**: Use **Option 1** so quotes have order numbers from the start, making tracking easier.

---

### 2. **Database Schema Requirements**

#### Quote Table

```sql
ALTER TABLE quotes
ADD COLUMN orderId VARCHAR(50) UNIQUE;

-- Add index for faster lookups
CREATE INDEX idx_quotes_orderId ON quotes(orderId);
```

#### Order Table

```sql
-- Ensure orderId exists and is unique
ALTER TABLE orders
ADD CONSTRAINT unique_orderId UNIQUE (orderId);

-- Add index
CREATE INDEX idx_orders_orderId ON orders(orderId);
```

---

### 3. **API Endpoint Changes**

### A. Quote Creation Endpoint

**Endpoint**: `POST /api/quote/create` or similar

**Current Behavior**: Creates quote without orderId

**Required Behavior**:

1. Generate unique order number
2. Store in `quote.orderId`
3. Return in response

**Response Format**:

```json
{
  "success": true,
  "message": "Quote created successfully",
  "data": {
    "id": "quote-uuid",
    "orderId": "ORD-20241215-00001", // ← NEW: Generated order number
    "status": "PENDING",
    "amount": null,
    "userId": "user-uuid",
    "createdAt": "2024-12-15T10:30:00Z"
    // ... other fields
  }
}
```

### B. Quote Approval Endpoint

**Endpoint**: `POST /api/quote/admin/{id}/approve`

**Current Behavior**: Approves quote and creates order

**Required Behavior**:

1. Check if quote already has `orderId`
   - If yes: Use existing `orderId`
   - If no: Generate new `orderId` and update quote
2. Create order with the same `orderId`
3. Link quote to order
4. Return both quote and order in response

**Request Body**:

```json
{
  "amount": 199.99
}
```

**Response Format**:

```json
{
  "success": true,
  "message": "Quote approved successfully",
  "data": {
    "quote": {
      "id": "quote-uuid",
      "orderId": "ORD-20241215-00001", // ← Generated or existing
      "status": "APPROVED",
      "amount": 199.99
      // ... other fields
    },
    "order": {
      "id": "order-uuid",
      "orderId": "ORD-20241215-00001", // ← Same as quote.orderId
      "status": "PENDING",
      "totalPrice": 199.99,
      "quoteId": "quote-uuid"
      // ... other fields
    }
  }
}
```

### C. Quote List Endpoints

**Endpoints**:

- `GET /api/quote/admin/list`
- `GET /api/quote/user/list`

**Required Behavior**: Include `orderId` in response for all quotes

**Response Format**:

```json
{
  "success": true,
  "data": [
    {
      "id": "quote-uuid",
      "orderId": "ORD-20241215-00001", // ← Must be included
      "status": "PENDING"
      // ... other fields
    }
  ]
}
```

---

### 4. **Order Number Generation Function**

#### Implementation Example (Node.js/TypeScript)

```typescript
/**
 * Generates a unique order number
 * Format: ORD-YYYYMMDD-XXXXX
 */
async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
  // Format: YYYYMMDD
  const prefix = `ORD-${dateStr}-`;

  // Get the last order number for today
  const lastOrder = await Order.findOne({
    where: {
      orderId: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["orderId", "DESC"]],
    limit: 1,
  });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderId.split("-")[2]);
    sequence = lastSequence + 1;
  }

  // Format sequence as 5-digit number
  const sequenceStr = sequence.toString().padStart(5, "0");

  return `${prefix}${sequenceStr}`;
}
```

#### Alternative: Global Sequence (Not date-based)

```typescript
/**
 * Generates a unique order number with global sequence
 * Format: ORD-YYYYMMDD-XXXXX
 */
async function generateOrderNumberGlobal(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
  const prefix = `ORD-${dateStr}-`;

  // Get global sequence counter
  const counter = await OrderCounter.findOne({ where: { date: dateStr } });

  let sequence = 1;
  if (counter) {
    sequence = counter.sequence + 1;
    await counter.update({ sequence });
  } else {
    await OrderCounter.create({ date: dateStr, sequence: 1 });
  }

  const sequenceStr = sequence.toString().padStart(5, "0");
  return `${prefix}${sequenceStr}`;
}
```

---

### 5. **Database Migration Script**

```sql
-- Create order counter table (if using global sequence)
CREATE TABLE IF NOT EXISTS order_counters (
  id SERIAL PRIMARY KEY,
  date VARCHAR(8) UNIQUE NOT NULL,  -- Format: YYYYMMDD
  sequence INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add orderId column to quotes table
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS orderId VARCHAR(50);

-- Add unique constraint
ALTER TABLE quotes
ADD CONSTRAINT unique_quote_orderId UNIQUE (orderId);

-- Add index
CREATE INDEX IF NOT EXISTS idx_quotes_orderId ON quotes(orderId);

-- Ensure orders table has orderId
ALTER TABLE orders
ADD CONSTRAINT IF NOT EXISTS unique_order_orderId UNIQUE (orderId);

-- Add index
CREATE INDEX IF NOT EXISTS idx_orders_orderId ON orders(orderId);
```

---

### 6. **Error Handling**

The backend should handle these scenarios:

1. **Order Number Collision**
   - If generated orderId already exists, retry with next sequence
   - Maximum retries: 10
   - If still fails, return error

2. **Quote Already Has OrderId**
   - If quote already has orderId when approving, use existing
   - Don't generate new one

3. **Order Creation Fails**
   - If order creation fails after generating orderId, rollback
   - Don't leave quote with orphaned orderId

---

### 7. **Testing Requirements**

Backend should test:

- [ ] Order number generation on quote creation
- [ ] Order number generation on quote approval
- [ ] Order number uniqueness
- [ ] Order number format validation
- [ ] Order number linking between quote and order
- [ ] Handling of existing orderId
- [ ] Error handling for collisions
- [ ] Concurrent order number generation

---

### 8. **Frontend-Backend Integration Points**

#### Quote Creation Flow

```
Frontend: POST /api/quote/create
Backend:
  1. Create quote
  2. Generate orderId
  3. Save quote with orderId
  4. Return quote with orderId
Frontend: Display quote with order number
```

#### Quote Approval Flow

```
Frontend: POST /api/quote/admin/{id}/approve
Backend:
  1. Get quote
  2. Check if orderId exists
     - If no: Generate orderId, update quote
  3. Create order with same orderId
  4. Return quote and order
Frontend:
  1. Invalidate queries
  2. Refetch quotes and orders
  3. Quote disappears from quotes list
  4. Order appears in orders list
```

---

## Summary

**Key Requirements:**

1. ✅ Generate unique order numbers (format: `ORD-YYYYMMDD-XXXXX`)
2. ✅ Generate on quote creation OR quote approval
3. ✅ Store orderId in both quote and order tables
4. ✅ Return orderId in all relevant API responses
5. ✅ Ensure orderId uniqueness
6. ✅ Link quote and order with same orderId

**Frontend is ready** - it will automatically display order numbers once backend implements the above changes.
