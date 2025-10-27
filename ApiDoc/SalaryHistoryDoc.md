# Salary History & Management

## Salary History & Management

### Create Salary History

Creates a new salary history record. Tracks salary changes over time (e.g., salary in 2022 vs 2024).

**Endpoint:** `POST /api/salaryHistory`

**Authentication:** Admin

**Request Body:**

```json
{
  "userId": number,                      // Required
  "effectiveDate": "date",               // Required (YYYY-MM-DD)
  "endDate": "date",                     // Optional (YYYY-MM-DD, null for current salary)
  "salaryBasic": number,                 // Optional
  "salaryGross": number,                 // Optional
  "salaryNet": number,                   // Optional
  "allowanceHouseRent": number,          // Optional (default: 0)
  "allowanceMedical": number,            // Optional (default: 0)
  "allowanceSpecial": number,            // Optional (default: 0)
  "allowanceFuel": number,               // Optional (default: 0)
  "allowancePhoneBill": number,          // Optional (default: 0)
  "allowanceOther": number,              // Optional (default: 0)
  "allowanceTotal": number,              // Optional (default: 0)
  "deductionProvidentFund": number,      // Optional (default: 0)
  "deductionTax": number,                // Optional (default: 0)
  "deductionOther": number,              // Optional (default: 0)
  "deductionTotal": number,              // Optional (default: 0)
  "reason": "string",                    // Optional (e.g., "Promotion", "Annual Increase")
  "approvedBy": "string",                // Optional (Approver name)
  "remarks": "string"                    // Optional
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "userId": 1,
  "effectiveDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "salaryBasic": 50000,
  "salaryGross": 60000,
  "salaryNet": 45000,
  "allowanceHouseRent": 5000,
  "allowanceMedical": 2000,
  "allowanceTotal": 7000,
  "deductionTax": 8000,
  "reason": "Promotion to Senior Engineer",
  "approvedBy": "HR Manager",
  "createdAt": "2024-03-15T10:00:00.000Z"
}
```

**Notes:**

- Allows tracking complete salary history for an employee
- `endDate` is null for current/active salary
- When creating a new salary, set `endDate` on the previous salary record
- All financial amounts are stored as integers (no decimals)

---

### Get All Salary History

Retrieves all salary history records.

**Endpoint:** `GET /api/salaryHistory`

**Authentication:** Admin or Manager

**Success Response (200):**

```json
[
  {
    "id": 1,
    "userId": 1,
    "effectiveDate": "2024-01-01T00:00:00.000Z",
    "endDate": null,
    "salaryBasic": 50000,
    "salaryGross": 60000,
    "salaryNet": 45000
  }
]
```

---

### Get Salary History by User

Retrieves complete salary history for a specific user (ordered by date, most recent first).

**Endpoint:** `GET /api/salaryHistory/user/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
[
  {
    "id": 3,
    "userId": 1,
    "effectiveDate": "2024-01-01T00:00:00.000Z",
    "endDate": null,
    "salaryBasic": 50000,
    "salaryGross": 60000,
    "salaryNet": 45000,
    "reason": "Promotion to Senior Engineer",
    "approvedBy": "HR Manager"
  },
  {
    "id": 2,
    "userId": 1,
    "effectiveDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-12-31T00:00:00.000Z",
    "salaryBasic": 40000,
    "salaryGross": 48000,
    "salaryNet": 36000,
    "reason": "Annual salary increase",
    "approvedBy": "HR Manager"
  },
  {
    "id": 1,
    "userId": 1,
    "effectiveDate": "2022-01-01T00:00:00.000Z",
    "endDate": "2022-12-31T00:00:00.000Z",
    "salaryBasic": 35000,
    "salaryGross": 42000,
    "salaryNet": 31500
  }
]
```

**Notes:**

- Returns salary history ordered by `effectiveDate` (descending - most recent first)
- Useful for viewing employee's salary progression over time
- Null `endDate` indicates current/active salary

---

### Get Current Salary

Retrieves the current (active) salary for a user.

**Endpoint:** `GET /api/salaryHistory/user/:id/current`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
{
  "id": 3,
  "userId": 1,
  "effectiveDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "salaryBasic": 50000,
  "salaryGross": 60000,
  "salaryNet": 45000,
  "allowanceHouseRent": 5000,
  "allowanceMedical": 2000,
  "reason": "Promotion to Senior Engineer",
  "approvedBy": "HR Manager"
}
```

**Notes:**

- Returns the current salary (where `endDate` is null)
- If no active salary found, returns null or empty response

---

### Get Single Salary History

Retrieves a single salary history record by its ID.

**Endpoint:** `GET /api/salaryHistory/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Salary History ID

**Success Response (200):**

```json
{
  "id": 1,
  "userId": 1,
  "effectiveDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "salaryBasic": 50000,
  "salaryGross": 60000,
  "salaryNet": 45000,
  "reason": "Promotion to Senior Engineer"
}
```

---

### Update Salary History

Updates salary history information.

**Endpoint:** `PUT /api/salaryHistory/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Salary History ID

**Request Body:**

```json
{
  "effectiveDate": "date",               // Optional
  "endDate": "date",                     // Optional
  "salaryBasic": number,                 // Optional
  "salaryGross": number,                 // Optional
  "salaryNet": number,                   // Optional
  "reason": "string",                    // Optional
  "approvedBy": "string",                // Optional
  "remarks": "string"                    // Optional
}
```

**Success Response (200):**

```json
{
  "message": "Salary History was updated successfully."
}
```

---

### Delete Salary History

Deletes a salary history record.

**Endpoint:** `DELETE /api/salaryHistory/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Salary History ID

**Success Response (200):**

```json
{
  "message": "Salary History was deleted successfully!"
}
```

---

### Delete All Salary History by User

Deletes all salary history records for a specific user.

**Endpoint:** `DELETE /api/salaryHistory/user/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
{
  "message": "5 Salary History records were deleted successfully!"
}
```

---
