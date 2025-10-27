# Expenses & Budget Management

## Expenses & Budget Management

### Create Expense

Creates a new expense record.

**Endpoint:** `POST /api/expenses`

**Authentication:** Admin or Manager

**Request Body:**

```json
{
  "expenseItemName": "string",    // Required
  "expenseItemStore": "string",   // Required
  "date": "date",                 // Required (YYYY-MM-DD)
  "amount": number,               // Required
  "departmentId": number          // Required
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "expenseItemName": "Office Supplies",
  "expenseItemStore": "Staples",
  "date": "2024-03-15T00:00:00.000Z",
  "amount": 250,
  "departmentId": 1
}
```

---

### Get All Expenses

Retrieves all expenses with department information.

**Endpoint:** `GET /api/expenses`

**Authentication:** Admin or Manager

**Success Response (200):**

```json
[
  {
    "id": 1,
    "expenseItemName": "Office Supplies",
    "expenseItemStore": "Staples",
    "date": "2024-03-15T00:00:00.000Z",
    "amount": 250,
    "departmentId": 1,
    "department": {
      "id": 1,
      "departmentName": "Engineering"
    }
  }
]
```

---

### Get Expenses by Year

Retrieves expense statistics grouped by month for a specific year.

**Endpoint:** `GET /api/expenses/year/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Year (e.g., 2024)

**Success Response (200):**

```json
[
  {
    "month": "January",
    "expenses": 5000
  },
  {
    "month": "February",
    "expenses": 4800
  }
]
```

---

### Get Expenses by Year and Department

Retrieves expense statistics for a specific year and department.

**Endpoint:** `GET /api/expenses/year/:id/department/:id2`

**Authentication:** Manager

**URL Parameters:**

- `id` (number) - Year (e.g., 2024)
- `id2` (number) - Department ID

**Success Response (200):**

```json
[
  {
    "month": "January",
    "expenses": 1500
  },
  {
    "month": "February",
    "expenses": 1200
  }
]
```

---

### Get Expenses by Department

Retrieves all expenses for a specific department.

**Endpoint:** `GET /api/expenses/department/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "expenseItemName": "Office Supplies",
    "expenseItemStore": "Staples",
    "date": "2024-03-15T00:00:00.000Z",
    "amount": 250,
    "departmentId": 1
  }
]
```

---

### Get Single Expense

Retrieves a single expense.

**Endpoint:** `GET /api/expenses/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Expense ID

**Success Response (200):**

```json
{
  "id": 1,
  "expenseItemName": "Office Supplies",
  "expenseItemStore": "Staples",
  "date": "2024-03-15T00:00:00.000Z",
  "amount": 250,
  "departmentId": 1
}
```

---

### Update Expense

Updates expense information.

**Endpoint:** `PUT /api/expenses/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Expense ID

**Request Body:**

```json
{
  "expenseItemName": "string",    // Optional
  "expenseItemStore": "string",   // Optional
  "date": "date",                 // Optional
  "amount": number,               // Optional
  "departmentId": number          // Optional
}
```

**Success Response (200):**

```json
{
  "message": "Expense was updated successfully."
}
```

---

### Delete Expense

Deletes an expense.

**Endpoint:** `DELETE /api/expenses/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Expense ID

**Success Response (200):**

```json
{
  "message": "Expense was deleted successfully!"
}
```

---

### Delete All Expenses

Deletes all expenses.

**Endpoint:** `DELETE /api/expenses`

**Authentication:** Admin

**Success Response (200):**

```json
{
  "message": "50 Expenses were deleted successfully!"
}
```

---

### Delete Expenses by Department

Deletes all expenses for a specific department.

**Endpoint:** `DELETE /api/expenses/department/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
{
  "message": "15 Expenses were deleted successfully!"
}
```

---
