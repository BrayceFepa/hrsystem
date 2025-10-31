# Financial Information & Banking

## Financial Information & Banking

### Create Financial Information

Creates new financial information for a user.

**Endpoint:** `POST /api/financialInformations`

**Authentication:** Admin

**Request Body:**

```json
{
  "employmentType": "string",          // Optional: "Full Time" | "Part Time" | "Internship" | "Contractual"
  "salaryBasic": number,               // Optional
  "salaryGross": number,               // Optional
  "salaryNet": number,                 // Optional
  "allowanceHouseRent": number,        // Optional
  "allowanceMedical": number,          // Optional
  "allowanceSpecial": number,          // Optional
  "allowanceFuel": number,             // Optional
  "allowancePhoneBill": number,        // Optional
  "allowanceOther": number,            // Optional
  "allowanceTotal": number,            // Optional
  "deductionProvidentFund": number,    // Optional
  "deductionTax": number,              // Optional
  "deductionOther": number,            // Optional
  "deductionTotal": number,            // Optional
  "bankName": "string",                // Optional
  "accountName": "string",             // Optional
  "accountNumber": "string",           // Optional
  "iban": "string",                    // Optional
  "branch": "string",                  // Optional
  "nationalIdNumber": "string",        // Optional
  "userId": number                     // Required
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "employmentType": "Full Time",
  "salaryBasic": 50000,
  "salaryGross": 60000,
  "salaryNet": 45000,
  "allowanceHouseRent": 5000,
  "allowanceMedical": 2000,
  "allowanceSpecial": 1000,
  "allowanceFuel": 1500,
  "allowancePhoneBill": 500,
  "allowanceOther": 1000,
  "allowanceTotal": 11000,
  "deductionProvidentFund": 5000,
  "deductionTax": 8000,
  "deductionOther": 2000,
  "deductionTotal": 15000,
  "bankName": "Bank of America",
  "accountName": "John Doe",
  "accountNumber": "1234567890",
  "iban": "US64SVBKUS6S3300958879",
  "branch": "Downtown Branch",
  "nationalIdNumber": "123-45-6789",
  "userId": 1
}
```

**Error Response:**

```json
// 403 - Already exists
{
  "message": "Financial Information Already Exists for this User"
}
```

---

### Get All Financial Information

Retrieves all financial information records.

**Endpoint:** `GET /api/financialInformations`

**Authentication:** Admin or Manager

**Success Response (200):**

```json
[
  {
    "id": 1,
    "employmentType": "Full Time",
    "salaryBasic": 50000,
    "salaryGross": 60000,
    "salaryNet": 45000,
    "bankName": "Bank of America",
    "accountName": "John Doe",
    "accountNumber": "1234567890",
    "iban": "US64SVBKUS6S3300958879",
    "branch": "Downtown Branch",
    "userId": 1,
    "user": {
      "id": 1,
      "fullName": "John Doe"
    }
  }
]
```

---

### Get Financial Information by User ID

Retrieves financial information for a specific user.

**Endpoint:** `GET /api/financialInformations/user/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "employmentType": "Full Time",
    "salaryBasic": 50000,
    "salaryGross": 60000,
    "salaryNet": 45000,
    "bankName": "Bank of America",
    "accountName": "John Doe",
    "accountNumber": "1234567890",
    "iban": "US64SVBKUS6S3300958879",
    "branch": "Downtown Branch",
    "nationalIdNumber": "123-45-6789",
    "userId": 1
  }
]
```

---

### Get Financial Information by ID

Retrieves a single financial information record by its ID.

**Endpoint:** `GET /api/financialInformations/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Financial Information ID

**Success Response (200):**

```json
{
  "id": 1,
  "employmentType": "Full Time",
  "salaryBasic": 50000,
  "salaryGross": 60000,
  "salaryNet": 45000,
  "bankName": "Bank of America",
  "accountName": "John Doe",
  "accountNumber": "1234567890",
  "iban": "US64SVBKUS6S3300958879",
  "branch": "Downtown Branch",
  "nationalIdNumber": "123-45-6789",
  "userId": 1,
  "user": {
    "id": 1,
    "fullName": "John Doe"
  }
}
```

---

### Update Financial Information

Updates an existing financial information record.

**Endpoint:** `PUT /api/financialInformations/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Financial Information ID

**Request Body:**

```json
{
  "employmentType": "string",          // Optional
  "salaryBasic": number,               // Optional
  "salaryGross": number,               // Optional
  "salaryNet": number,                 // Optional
  "allowanceHouseRent": number,        // Optional
  "allowanceMedical": number,          // Optional
  "allowanceSpecial": number,          // Optional
  "allowanceFuel": number,             // Optional
  "allowancePhoneBill": number,        // Optional
  "allowanceOther": number,            // Optional
  "allowanceTotal": number,            // Optional
  "deductionProvidentFund": number,    // Optional
  "deductionTax": number,              // Optional
  "deductionOther": number,            // Optional
  "deductionTotal": number,            // Optional
  "bankName": "string",                // Optional
  "accountName": "string",             // Optional
  "accountNumber": "string",           // Optional
  "iban": "string",                    // Optional
  "branch": "string",                  // Optional
  "nationalIdNumber": "string"         // Optional
}
```

**Success Response (200):**

```json
{
  "message": "UserFinancialInformation was updated successfully."
}
```

**Error Response:**

```json
{
  "message": "Cannot update UserFinancialInformation with id=1. Maybe UserFinancialInformation was not found or req.body is empty!"
}
```

---
