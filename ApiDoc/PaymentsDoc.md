# Payments & Financial Records

## Payments & Financial Records

### Create Payment

Creates a new payment record.

**Endpoint:** `POST /api/payments`

**Authentication:** Admin

**Request Body:**

```json
{
  "paymentType": "string",     // Required: "Check" | "Bank Transfer" | "Cash"
  "paymentMonth": "date",      // Required (YYYY-MM-DD)
  "paymentDate": "date",       // Required (YYYY-MM-DD)
  "paymentFine": number,       // Optional
  "paymentAmount": number,     // Required
  "comments": "string",        // Optional
  "jobId": number              // Required
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "paymentType": "Bank Transfer",
  "paymentMonth": "2024-03-01T00:00:00.000Z",
  "paymentDate": "2024-03-05T00:00:00.000Z",
  "paymentFine": 0,
  "paymentAmount": 5000,
  "comments": "March salary",
  "jobId": 1
}
```

---

### Get All Payments

Retrieves all payments.

**Endpoint:** `GET /api/payments`

**Authentication:** Admin or Manager

**Success Response (200):**

```json
[
  {
    "id": 1,
    "paymentType": "Bank Transfer",
    "paymentMonth": "2024-03-01T00:00:00.000Z",
    "paymentDate": "2024-03-05T00:00:00.000Z",
    "paymentAmount": 5000,
    "jobId": 1
  }
]
```

---

### Get Payments by Year

Retrieves payment statistics grouped by month for a specific year.

**Endpoint:** `GET /api/payments/year/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Year (e.g., 2024)

**Success Response (200):**

```json
[
  {
    "month": "January",
    "expenses": 45000
  },
  {
    "month": "February",
    "expenses": 48000
  }
]
```

---

### Get Payments by Job

Retrieves all payments for a specific job.

**Endpoint:** `GET /api/payments/job/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Job ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "paymentType": "Bank Transfer",
    "paymentAmount": 5000,
    "paymentDate": "2024-03-05T00:00:00.000Z",
    "jobId": 1
  }
]
```

---

### Get Payments by User

Retrieves all payments for a specific user with full details.

**Endpoint:** `GET /api/payments/user/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "paymentType": "Bank Transfer",
    "paymentAmount": 5000,
    "job": {
      "id": 1,
      "jobTitle": "Software Engineer",
      "userId": 1,
      "user": {
        "id": 1,
        "fullName": "John Doe",
        "user_financial_info": {...}
      }
    }
  }
]
```

---

### Get Single Payment

Retrieves a single payment.

**Endpoint:** `GET /api/payments/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Payment ID

**Success Response (200):**

```json
{
  "id": 1,
  "paymentType": "Bank Transfer",
  "paymentMonth": "2024-03-01T00:00:00.000Z",
  "paymentDate": "2024-03-05T00:00:00.000Z",
  "paymentFine": 0,
  "paymentAmount": 5000,
  "comments": "March salary",
  "jobId": 1
}
```

---

### Update Payment

Updates payment information.

**Endpoint:** `PUT /api/payments/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Payment ID

**Request Body:**

```json
{
  "paymentType": "string",     // Optional
  "paymentMonth": "date",      // Optional
  "paymentDate": "date",       // Optional
  "paymentFine": number,       // Optional
  "paymentAmount": number,     // Optional
  "comments": "string"         // Optional
}
```

**Success Response (200):**

```json
{
  "message": "Payment was updated successfully."
}
```

---

### Delete Payment

Deletes a payment.

**Endpoint:** `DELETE /api/payments/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Payment ID

**Success Response (200):**

```json
{
  "message": "Payment was deleted successfully!"
}
```

---

### Delete All Payments

Deletes all payments.

**Endpoint:** `DELETE /api/payments`

**Authentication:** Admin

**Success Response (200):**

```json
{
  "message": "100 Payments were deleted successfully!"
}
```

---

### Delete Payments by Job

Deletes all payments for a specific job.

**Endpoint:** `DELETE /api/payments/job/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Job ID

**Success Response (200):**

```json
{
  "message": "12 Payments were deleted successfully!"
}
```

---
