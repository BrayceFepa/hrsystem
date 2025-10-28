# Jobs & Employment

## Jobs & Employment

### Create Job

Creates a new job position for a user with optional file uploads.

**Endpoint:** `POST /api/jobs`

**Authentication:** Admin

**Content-Type:** `multipart/form-data` (for file uploads)

**Request Body (Form Data):**

```
jobTitle: "string"                      // Required
startDate: "date"                       // Required (YYYY-MM-DD)
endDate: "date"                         // Optional (YYYY-MM-DD)
empType: "string"                       // Optional (e.g., "Full-Time", "Part-Time", "Contract")
empStatus: "string"                     // Optional: "Active" | "On Leave" | "Terminated" | "Resigned"
directSupervisor: "string"              // Optional (Supervisor name or ID)
contract: File                          // Optional (PDF or Image, max 5MB)
certificate: File                       // Optional (PDF or Image, max 5MB)
takenAssets: "string"                   // Optional (Text field describing assets taken by employee) ✨ NEW
documentScanned: boolean                // Optional (true/false - whether documents are scanned) ✨ NEW
guaranteeForm: File                     // Optional (PDF or Image, max 5MB) ✨ NEW
companyGuaranteeSupportLetter: File    // Optional (PDF or Image, max 5MB) ✨ NEW
agreementType: "string"                // Optional: "Permanent" | "Contract" | "Probation" | "Intern" ✨ NEW
userId: number                          // Required
```

**Example using Postman/Form Data:**

```
Key                             | Type  | Value
--------------------------------|-------|---------------------------
jobTitle                        | text  | Software Engineer
startDate                       | text  | 2024-01-01
endDate                         | text  | 2024-12-31
empType                         | text  | Full-Time
empStatus                       | text  | Active
directSupervisor                | text  | John Smith
contract                        | file  | employment_contract.pdf
certificate                     | file  | certificate.pdf
takenAssets                     | text  | Laptop (Dell XPS 15), Phone (iPhone 13) ✨ NEW
documentScanned                 | text  | true ✨ NEW
guaranteeForm                   | file  | guarantee_form.pdf ✨ NEW
companyGuaranteeSupportLetter   | file  | support_letter.pdf ✨ NEW
agreementType                   | text  | Permanent ✨ NEW
userId                          | text  | 1
```

**Success Response (200):**

```json
{
  "id": 1,
  "jobTitle": "Software Engineer",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "empType": "Full-Time",
  "empStatus": "Active",
  "directSupervisor": "John Smith",
  "contract": "uploads/job-files/contract-1234567890-123456789.pdf",
  "certificate": "uploads/job-files/certificate-1234567890-987654321.pdf",
  "takenAssets": "Laptop (Dell XPS 15), Phone (iPhone 13)",
  "documentScanned": true,
  "guaranteeForm": "uploads/job-files/guaranteeForm-1234567890-222222222.pdf",
  "companyGuaranteeSupportLetter": "uploads/job-files/companyGuaranteeSupportLetter-1234567890-333333333.pdf",
  "agreementType": "Permanent",
  "userId": 1
}
```

**Error Responses:**

```json
// 400 - Invalid file type
{
  "message": "Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed."
}

// 413 - File too large
{
  "message": "File too large. Maximum file size is 5MB."
}

// 500 - Server error
{
  "message": "Some error occurred while creating the Job."
}
```

**File Upload Specifications:**

- **Allowed file types:** JPEG, JPG, PNG, GIF, PDF
- **Maximum file size:** 5MB per file
- **Storage location:** `uploads/job-files/`
- **Filename format:** `fieldname-timestamp-randomnumber.extension`
- **Optional fields:** Both `contract` and `certificate` are optional

**Notes:**

- If user has an active job, its end date will be adjusted to one day before the new job's start date
- Files are stored locally in `uploads/job-files/` directory
- File paths are stored in the database as strings
- All document fields (contract, certificate, guaranteeForm, companyGuaranteeSupportLetter) are optional
- `takenAssets` is a text field (not a file) - used to describe assets assigned to the employee
- `documentScanned` is a boolean field (true/false) - indicates if employee documents have been scanned
- All employment fields (empType, empStatus, directSupervisor, agreementType) are optional
- The `endDate` field is optional (can be null for ongoing positions)
- `empStatus` accepts: "Active", "On Leave", "Terminated", or "Resigned"
- `agreementType` accepts: "Permanent", "Contract", "Probation", or "Intern"
- For `documentScanned`, you can send: `true`, `"true"`, `1`, `"1"` (all treated as true) or `false`, `"false"`, `0`, `"0"` (all treated as false)

---

### Get All Jobs

Retrieves all jobs.

**Endpoint:** `GET /api/jobs`

**Authentication:** Admin or Manager

**Success Response (200):**

```json
[
  {
    "id": 1,
    "jobTitle": "Software Engineer",
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2024-01-01T00:00:00.000Z",
    "userId": 1
  }
]
```

---

### Get Jobs by User

Retrieves all jobs for a specific user.

**Endpoint:** `GET /api/jobs/user/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "jobTitle": "Software Engineer",
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2024-01-01T00:00:00.000Z",
    "userId": 1
  }
]
```

---

### Get Single Job

Retrieves a single job.

**Endpoint:** `GET /api/jobs/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Job ID

**Success Response (200):**

```json
{
  "id": 1,
  "jobTitle": "Software Engineer",
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": "2024-01-01T00:00:00.000Z",
  "userId": 1
}
```

---

### Update Job

Updates job information.

**Endpoint:** `PUT /api/jobs/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Job ID

**Request Body:**

```json
{
  "jobTitle": "string", // Optional
  "startDate": "date", // Optional
  "endDate": "date" // Optional
}
```

**Success Response (200):**

```json
{
  "message": "Job was updated successfully."
}
```

---

### Delete Job

Deletes a job.

**Endpoint:** `DELETE /api/jobs/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Job ID

**Success Response (200):**

```json
{
  "message": "Job was deleted successfully!"
}
```

---

### Delete All Jobs

Deletes all jobs.

**Endpoint:** `DELETE /api/jobs`

**Authentication:** Admin

**Success Response (200):**

```json
{
  "message": "10 Jobs were deleted successfully!"
}
```

---

### Delete Jobs by User

Deletes all jobs for a specific user.

**Endpoint:** `DELETE /api/jobs/user/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
{
  "message": "3 Jobs were deleted successfully!"
}
```

---
