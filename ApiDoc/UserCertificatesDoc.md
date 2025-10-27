# User Certificates & Documents

## User Certificates & Documents

### Create User Certificate

Creates a new certificate/document for a user. Employees can have multiple certificates (diplomas, degrees, ID cards, etc.).

**Endpoint:** `POST /api/userCertificates`

**Authentication:** Admin

**Content-Type:** `multipart/form-data` (for file upload)

**Request Body (Form Data):**

```
userId: number                    // Required
certificateType: "string"         // Required: "Diploma" | "Degree" | "Certificate" | "ID Card" | "Passport" | "Other"
certificateName: "string"         // Required (e.g., "Bachelor of Computer Science")
issuingAuthority: "string"        // Optional (Organization that issued it)
issueDate: "date"                 // Optional (YYYY-MM-DD)
expiryDate: "date"                // Optional (YYYY-MM-DD)
certificateNumber: "string"      // Optional (Certificate reference number)
filePath: File                    // Optional (Scanned document, max 5MB)
isActive: boolean                 // Optional (default: true)
remarks: "string"                 // Optional
```

**Example using Postman/Form Data:**

```
Key                  | Type  | Value
---------------------|-------|---------------------------
userId              | text  | 1
certificateType     | text  | Degree
certificateName     | text  | Bachelor of Computer Science
issuingAuthority    | text  | University of Technology
issueDate           | text  | 2020-05-15
expiryDate          | text  |
certificateNumber   | text  | BSC2020001
filePath            | file  | degree_certificate.pdf
isActive            | text  | true
remarks             | text  | Original degree document
```

**Success Response (200):**

```json
{
  "id": 1,
  "userId": 1,
  "certificateType": "Degree",
  "certificateName": "Bachelor of Computer Science",
  "issuingAuthority": "University of Technology",
  "issueDate": "2020-05-15T00:00:00.000Z",
  "expiryDate": null,
  "certificateNumber": "BSC2020001",
  "filePath": "uploads/certificates/certificate-1234567890.pdf",
  "isActive": true,
  "remarks": "Original degree document",
  "createdAt": "2024-03-15T10:00:00.000Z",
  "updatedAt": "2024-03-15T10:00:00.000Z"
}
```

**Notes:**

- Users can have multiple certificates of different types
- Certificate types include: Diploma, Degree, Certificate, ID Card, Passport, Other
- All fields except `userId`, `certificateType`, and `certificateName` are optional
- Files are stored in `uploads/certificates/` directory

---

### Get All User Certificates

Retrieves all certificates from all users.

**Endpoint:** `GET /api/userCertificates`

**Authentication:** Admin or Manager

**Success Response (200):**

```json
[
  {
    "id": 1,
    "userId": 1,
    "certificateType": "Degree",
    "certificateName": "Bachelor of Computer Science",
    "issuingAuthority": "University of Technology",
    "filePath": "uploads/certificates/certificate-1234567890.pdf",
    "isActive": true
  }
]
```

---

### Get Certificates by User

Retrieves all certificates for a specific user.

**Endpoint:** `GET /api/userCertificates/user/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "userId": 1,
    "certificateType": "Degree",
    "certificateName": "Bachelor of Computer Science",
    "certificateName": "Bachelor of Computer Science",
    "isActive": true
  },
  {
    "id": 2,
    "userId": 1,
    "certificateType": "ID Card",
    "certificateName": "National ID Card",
    "isActive": true
  }
]
```

**Notes:**

- Returns all certificates for the specified user
- Useful for viewing employee's complete education/document portfolio

---

### Get Single User Certificate

Retrieves a single certificate by its ID.

**Endpoint:** `GET /api/userCertificates/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Certificate ID

**Success Response (200):**

```json
{
  "id": 1,
  "userId": 1,
  "certificateType": "Degree",
  "certificateName": "Bachelor of Computer Science",
  "issuingAuthority": "University of Technology",
  "issueDate": "2020-05-15T00:00:00.000Z",
  "certificateNumber": "BSC2020001",
  "filePath": "uploads/certificates/certificate-1234567890.pdf",
  "isActive": true
}
```

---

### Update User Certificate

Updates certificate information.

**Endpoint:** `PUT /api/userCertificates/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Certificate ID

**Request Body:**

```json
{
  "certificateType": "string",       // Optional
  "certificateName": "string",        // Optional
  "issuingAuthority": "string",      // Optional
  "issueDate": "date",               // Optional
  "expiryDate": "date",              // Optional
  "certificateNumber": "string",     // Optional
  "isActive": boolean,               // Optional
  "remarks": "string"                // Optional
}
```

**Success Response (200):**

```json
{
  "message": "User Certificate was updated successfully."
}
```

---

### Delete User Certificate

Deletes a certificate.

**Endpoint:** `DELETE /api/userCertificates/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Certificate ID

**Success Response (200):**

```json
{
  "message": "User Certificate was deleted successfully!"
}
```

---

### Delete All Certificates by User

Deletes all certificates for a specific user.

**Endpoint:** `DELETE /api/userCertificates/user/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
{
  "message": "5 User Certificates were deleted successfully!"
}
```

---
