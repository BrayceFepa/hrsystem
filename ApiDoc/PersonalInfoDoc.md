# Personal Information & Profiles

## Personal Information & Profiles

### Create Personal Information

Creates personal information for a user with optional ID copy upload.

**Endpoint:** `POST /api/personalInformations`

**Authentication:** Admin

**Content-Type:** `multipart/form-data` (for file upload)

**Request Body (Form Data):**

```
dateOfBirth: "date"            // Optional (YYYY-MM-DD)
gender: "string"               // Optional: "Male" | "Female"
maritalStatus: "string"        // Optional: "Married" | "Single" | "Widowed"
fatherName: "string"           // Optional
idNumber: "string"             // Optional
address: "string"              // Optional
city: "string"                 // Optional
country: "string"              // Optional
mobile: "string"               // Optional
phone: "string"                // Optional
emailAddress: "string"         // Optional
emergencyContact: "string"     // Optional (emergency contact details)
nationalIdNumber: "string"     // Optional (National ID/Passport number)
idCopy: File                     // Optional (PDF or Image, max 5MB)
userId: number                   // Required
```

**Example using Postman/Form Data:**

```
Key              | Type  | Value
-----------------|-------|---------------------------
dateOfBirth      | text  | 1990-01-15
gender           | text  | Male
maritalStatus    | text  | Single
fatherName       | text  | Robert Doe
idNumber         | text  | 123456789
address          | text  | 123 Main St
city             | text  | New York
country          | text  | USA
mobile           | text  | +1234567890
phone            | text  | +0987654321
emailAddress     | text  | john@example.com
emergencyContact | text  | Jane Doe - +1987654321
idCopy           | file  | id_document.pdf
userId           | text  | 1
```

**Success Response (200):**

```json
{
  "id": 1,
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "maritalStatus": "Single",
  "fatherName": "Robert Doe",
  "idNumber": "123456789",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "mobile": "+1234567890",
  "phone": "+0987654321",
  "emailAddress": "john@example.com",
  "emergencyContact": "Jane Doe - +1987654321",
  "idCopy": "uploads/personal-info-files/idCopy-1234567890-123456789.pdf",
  "userId": 1
}
```

**Error Responses:**

```json
// 403 - Already exists
{
  "message": "Personal Information already exists for this User"
}

// Upload validation failures
{
  "message": "Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed."
}
{
  "message": "File too large. Maximum file size is 5MB."
}
```

**File Upload Specifications:**

- **Allowed file types:** JPEG, JPG, PNG, GIF, PDF
- **Maximum file size:** 5MB per file
- **Storage location:** `uploads/personal-info-files/`
- **Filename format:** `idCopy-<timestamp>-<random>.extension`
- **Optional field:** `idCopy` is optional
- **Note:** Only the `idCopy` file is accepted on create; updating files via PUT is not supported.

**Notes:**

- All fields are optional except `userId`.
- `gender` must be one of: `Male`, `Female`.
- `maritalStatus` must be one of: `Married`, `Single`, `Widowed`.
- The `emergencyContact` field can store contact details (name, phone, relationship, etc.).
- The `idCopy` field stores the server path to the uploaded file.
- Files are served at: `http://localhost:3002/uploads/personal-info-files/<filename>`.
- Duplicate creation is prevented per `userId`.
- Caching: some GET routes use in-memory caching (see below).

---

### Get Personal Information by User

Retrieves personal information for a specific user.

**Endpoint:** `GET /api/personalInformations/user/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "dateOfBirth": "1990-01-15",
    "gender": "Male",
    "mobile": "+1234567890",
    "emailAddress": "john@example.com",
    "userId": 1
  }
]
```

**Caching:** Response is cached for 5 minutes.

---

### Get Single Personal Information

Retrieves a single personal information record.

**Endpoint:** `GET /api/personalInformations/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Personal Information ID

**Success Response (200):**

```json
{
  "id": 1,
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "maritalStatus": "Single",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "mobile": "+1234567890",
  "emailAddress": "john@example.com",
  "userId": 1,
  "user": {
    "id": 1,
    "fullName": "John Doe"
  }
}
```

**Caching:** Response is cached for 10 minutes.

---

### Update Personal Information

Updates personal information.

**Endpoint:** `PUT /api/personalInformations/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Personal Information ID

**Request Body:**

```json
{
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "maritalStatus": "Single",
  "fatherName": "Robert Doe",
  "idNumber": "123456789",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "mobile": "+1234567890",
  "phone": "+0987654321",
  "emailAddress": "john@example.com",
  "emergencyContact": "Jane Doe - +1987654321",
  "nationalIdNumber": "AB1234567"
}
```

Note: File updates are not supported on this endpoint.

**Success Response (200):**

```json
{
  "message": "UserPersonalInformation was updated successfully."
}
```

---

### Delete Personal Information

Deletes personal information.

**Endpoint:** `DELETE /api/personalInformations/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Personal Information ID

**Success Response (200):**

```json
{
  "message": "UserPersonalInformation was deleted successfully!"
}
```

---

### Delete All Personal Information

Deletes all personal information records.

**Endpoint:** `DELETE /api/personalInformations`

**Authentication:** Admin

**Success Response (200):**

```json
{
  "message": "25 User Personal Informations were deleted successfully!"
}
```

---

### Summary of Endpoints

- `POST /api/personalInformations` — Create (Admin, multipart/form-data; accepts `idCopy`).
- `GET /api/personalInformations/user/:id` — List by userId (Admin; cached 5m).
- `GET /api/personalInformations/:id` — Get one (Any authenticated; cached 10m; includes `user`).
- `PUT /api/personalInformations/:id` — Update (Admin; JSON body; no file upload).
- `DELETE /api/personalInformations/:id` — Delete one (Admin).
- `DELETE /api/personalInformations` — Delete all (Admin).

---
