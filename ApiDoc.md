# HR System API Documentation

This document provides comprehensive documentation for all API endpoints in the HR System.

---

## Table of Contents

- [Authentication](#authentication)
  - [Login](#login)
  - [Register](#register)
  - [Check Token](#check-token)
- [Users](#users)
- [Departments](#departments)
- [Jobs](#jobs)
- [Applications (Leave Requests)](#applications-leave-requests)
- [Payments](#payments)
- [Expenses](#expenses)
- [Department Announcements](#department-announcements)
- [Personal Information](#personal-information)
- [Financial Information](#financial-information)
- [Personal Events](#personal-events)

---

## Authentication

### Login

User authentication endpoint.

**Endpoint:** `POST /login`

**Authentication:** None (Public)

**Request Body:**

```json
{
  "username": "string", // Required
  "password": "string" // Required
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

```json
// 403 - Incorrect credentials
{
  "message": "Incorrect Credentials!"
}

// 403 - Account not active
{
  "message": "Account is not active!"
}
```

**Notes:**

- Token expires in 30 minutes
- Token must be included in subsequent requests as Bearer token

---

### Register

User registration endpoint. Creates a new user account (inactive by default).

**Endpoint:** `POST /register`

**Authentication:** None (Public)

**Request Body:**

```json
{
  "username": "string", // Required, must be unique
  "password": "string", // Required
  "fullname": "string" // Required
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "userId": 1
}
```

**Error Responses:**

```json
// 403 - Username already exists
{
  "message": "Username already exists"
}

// 400 - Missing content
{
  "message": "Content can not be empty!"
}
```

**Notes:**

- User is created with `ROLE_EMPLOYEE` and `active: false`
- Admin must activate the account before user can login
- Automatically creates associated `UserPersonalInfo` and `UserFinancialInfo` records

---

### Check Token

Validates a JWT token.

**Endpoint:** `GET /checkToken`

**Authentication:** None (Token in header)

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (201):**

```json
{
  "message": "Access granted!",
  "authData": {
    "user": {
      "id": 1,
      "username": "admin",
      "fullname": "Admin User",
      "role": "ROLE_ADMIN",
      "departmentId": null
    },
    "iat": 1234567890,
    "exp": 1234569690
  }
}
```

**Error Responses:**

```json
// 403 - Invalid token
{
  "message": "Access denied: Wrong access token"
}

// 401 - No token provided
{
  "message": "Access denied: No token provided"
}
```

---

## Users

### Create User

Creates a new user (Admin function).

**Endpoint:** `POST /api/users`

**Authentication:** None (Public - but should be Admin only in production)

**Request Body:**

```json
{
  "username": "string",        // Required, must be unique
  "password": "string",        // Required
  "fullname": "string",        // Required
  "role": "string",            // Required: "ROLE_ADMIN" | "ROLE_MANAGER" | "ROLE_EMPLOYEE"
  "departmentId": number       // Optional
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "username": "john_doe",
  "fullName": "John Doe",
  "role": "ROLE_EMPLOYEE",
  "active": true,
  "departmentId": 1
}
```

**Error Responses:**

```json
// 403 - Username exists
{
  "message": "Username already exists"
}
```

---

### Get All Users

Retrieves all users with their related information.

**Endpoint:** `GET /api/users`

**Authentication:** Admin or Manager

**Success Response (200):**

```json
[
  {
    "id": 1,
    "username": "john_doe",
    "fullName": "John Doe",
    "role": "ROLE_EMPLOYEE",
    "active": true,
    "departmentId": 1,
    "user_personal_info": {
      "id": 1,
      "dateOfBirth": "1990-01-15",
      "gender": "Male",
      "mobile": "+1234567890",
      ...
    },
    "user_financial_info": {
      "id": 1,
      "salaryBasic": 50000,
      "bankName": "Bank of America",
      ...
    },
    "department": {
      "id": 1,
      "departmentName": "Engineering"
    },
    "jobs": [...]
  }
]
```

---

### Get User Count

Retrieves total number of users.

**Endpoint:** `GET /api/users/total`

**Authentication:** Admin or Manager

**Success Response (200):**

```
"42"
```

---

### Get User Count by Department

Retrieves user count for a specific department.

**Endpoint:** `GET /api/users/total/department/:id`

**Authentication:** Manager

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```
"15"
```

---

### Get Users by Department

Retrieves all users in a specific department.

**Endpoint:** `GET /api/users/department/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "username": "john_doe",
    "fullName": "John Doe",
    "role": "ROLE_EMPLOYEE",
    "departmentId": 1,
    ...
  }
]
```

---

### Get Single User

Retrieves a single user with full details.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
{
  "id": 1,
  "username": "john_doe",
  "fullName": "John Doe",
  "role": "ROLE_EMPLOYEE",
  "active": true,
  "departmentId": 1,
  "user_personal_info": {...},
  "user_financial_info": {...},
  "department": {...},
  "jobs": [
    {
      "id": 1,
      "jobTitle": "Software Engineer",
      "startDate": "2023-01-01",
      "endDate": "2024-01-01",
      "payments": [...]
    }
  ]
}
```

---

### Update User

Updates user information.

**Endpoint:** `PUT /api/users/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Request Body:**

```json
{
  "username": "string",        // Optional
  "fullname": "string",        // Optional
  "role": "string",            // Optional
  "active": boolean,           // Optional
  "departmentId": number       // Optional
}
```

**Success Response (200):**

```json
{
  "message": "User was updated successfully."
}
```

---

### Change Password

Changes user password.

**Endpoint:** `PUT /api/users/changePassword/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Request Body:**

```json
{
  "oldPassword": "string", // Required
  "newPassword": "string" // Required
}
```

**Success Response (200):**

```json
{
  "message": "User was updated successfully."
}
```

**Error Responses:**

```json
// 400 - Wrong password
{
  "message": "Wrong Password"
}

// 400 - User not found
{
  "message": "No such user!"
}
```

---

### Delete User

Deletes a user.

**Endpoint:** `DELETE /api/users/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
{
  "message": "User was deleted successfully!"
}
```

---

### Delete All Users

Deletes all users.

**Endpoint:** `DELETE /api/users`

**Authentication:** Admin

**Success Response (200):**

```json
{
  "message": "5 Users were deleted successfully!"
}
```

---

### Delete Users by Department

Deletes all users in a specific department.

**Endpoint:** `DELETE /api/users/department/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
{
  "message": "3 Users of Organizations with id: 1 were deleted successfully!"
}
```

---

## Departments

### Create Department

Creates a new department.

**Endpoint:** `POST /api/departments`

**Authentication:** Admin

**Request Body:**

```json
{
  "departmentName": "string" // Required
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "departmentName": "Engineering"
}
```

---

### Get All Departments

Retrieves all departments with their users.

**Endpoint:** `GET /api/departments`

**Authentication:** Admin or Manager

**Success Response (200):**

```json
[
  {
    "id": 1,
    "departmentName": "Engineering",
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "fullName": "John Doe",
        "jobs": [...]
      }
    ]
  }
]
```

---

### Get Single Department

Retrieves a single department with details.

**Endpoint:** `GET /api/departments/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
{
  "id": 1,
  "departmentName": "Engineering",
  "users": [...]
}
```

---

### Update Department

Updates department information.

**Endpoint:** `PUT /api/departments/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Department ID

**Request Body:**

```json
{
  "departmentName": "string" // Required
}
```

**Success Response (200):**

```json
{
  "message": "Department was updated successfully."
}
```

---

### Delete Department

Deletes a department (sets users' departmentId to null).

**Endpoint:** `DELETE /api/departments/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
{
  "message": "Department was deleted successfully!"
}
```

---

### Delete All Departments

Deletes all departments.

**Endpoint:** `DELETE /api/departments`

**Authentication:** Admin

**Success Response (200):**

```json
{
  "message": "5 Departments were deleted successfully!"
}
```

---

## Jobs

### Create Job

Creates a new job position for a user with optional file uploads.

**Endpoint:** `POST /api/jobs`

**Authentication:** Admin

**Content-Type:** `multipart/form-data` (for file uploads)

**Request Body (Form Data):**

```
jobTitle: "string"              // Required
startDate: "date"               // Required (YYYY-MM-DD)
endDate: "date"                 // Optional (YYYY-MM-DD)
empType: "string"               // Optional (e.g., "Full-Time", "Part-Time", "Contract")
empStatus: "string"             // Optional (e.g., "Active", "On Leave", "Terminated")
directSupervisor: "string"      // Optional (Supervisor name or ID)
contract: File                  // Optional (PDF or Image, max 5MB)
certificate: File               // Optional (PDF or Image, max 5MB)
userId: number                  // Required
```

**Example using Postman/Form Data:**

```
Key              | Type  | Value
-----------------|-------|---------------------------
jobTitle         | text  | Software Engineer
startDate        | text  | 2024-01-01
endDate          | text  | 2024-12-31
empType          | text  | Full-Time
empStatus        | text  | Active
directSupervisor | text  | John Smith
contract         | file  | employment_contract.pdf
certificate      | file  | certificate.pdf
userId           | text  | 1
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
- All new fields (empType, empStatus, directSupervisor, contract, certificate) are optional
- The `endDate` field is now optional (can be null for ongoing positions)

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

## Applications (Leave Requests)

### Create Application

Creates a new leave application.

**Endpoint:** `POST /api/applications`

**Authentication:** Any authenticated user

**Request Body:**

```json
{
  "reason": "string",          // Optional
  "startDate": "date",         // Required (YYYY-MM-DD)
  "endDate": "date",           // Required (YYYY-MM-DD)
  "type": "string",            // Required: "Normal" | "Student" | "Illness" | "Marriage"
  "userId": number             // Required
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "reason": "Family vacation",
  "startDate": "2024-03-15T00:00:00.000Z",
  "endDate": "2024-03-20T00:00:00.000Z",
  "status": "Pending",
  "type": "Normal",
  "userId": 1
}
```

**Notes:**

- Status is automatically set to "Pending" on creation

---

### Get All Applications

Retrieves all applications (Admin/Manager/HR only).

**Endpoint:** `GET /api/applications`

**Authentication:** Admin, Manager, or HR

**Query Parameters:**

- `page` (number, optional) - Page number (default: 1)
- `size` (number, optional) - Items per page (default: 10)
- `status` (string, optional) - Filter by status: "Approved" | "Rejected" | "Pending"
- `type` (string, optional) - Filter by leave type
- `startDate` (date, optional) - Filter by start date (YYYY-MM-DD)
- `endDate` (date, optional) - Filter by end date (YYYY-MM-DD)

**Example Requests:**

```
GET /api/applications?page=1&size=20
GET /api/applications?status=Pending
GET /api/applications?type=Annual Leave&page=1&size=10
GET /api/applications?startDate=2024-01-01&endDate=2024-12-31
```

**Success Response (200):**

```json
{
  "totalItems": 100,
  "items": [
    {
      "id": 1,
      "name": "John Doe",
      "positionTitle": "Software Engineer",
      "reason": "Family vacation",
      "startDate": "2024-03-15T00:00:00.000Z",
      "endDate": "2024-03-20T00:00:00.000Z",
      "numberOfDays": 6,
      "status": "Pending",
      "type": "Annual Leave",
      "approvedBy": null,
      "businessLeavePurpose": null,
      "businessLeaveDestination": null,
      "deductedFromBalance": true,
      "userId": 1,
      "createdAt": "2024-03-01T10:00:00.000Z",
      "updatedAt": "2024-03-01T10:00:00.000Z",
      "user": {
        "id": 1,
        "username": "john_doe",
        "fullName": "John Doe",
        "departmentId": 1
      }
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

**Notes:**

- This endpoint shows ALL applications from all users
- Only accessible by Admin, Manager, or HR roles
- For employees to see their own applications, use `GET /api/applications/user/:id`

---

### Get Recent Applications

Retrieves applications from the last 14 days and next 7 days.

**Endpoint:** `GET /api/applications/recent`

**Authentication:** Any authenticated user

**Success Response (200):**

```json
[
  {
    "id": 1,
    "reason": "Medical appointment",
    "startDate": "2024-03-15T00:00:00.000Z",
    "endDate": "2024-03-15T00:00:00.000Z",
    "status": "Pending",
    "type": "Illness",
    "userId": 1,
    "user": {...}
  }
]
```

---

### Get Recent Applications by Department

Retrieves recent applications for a specific department.

**Endpoint:** `GET /api/applications/recent/department/:id`

**Authentication:** Manager

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "startDate": "2024-03-15T00:00:00.000Z",
    "endDate": "2024-03-15T00:00:00.000Z",
    "status": "Pending",
    "type": "Normal",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "departmentId": 1
    }
  }
]
```

---

### Get Recent Applications by User

Retrieves recent applications for a specific user.

**Endpoint:** `GET /api/applications/recent/user/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "reason": "Personal",
    "startDate": "2024-03-15T00:00:00.000Z",
    "endDate": "2024-03-15T00:00:00.000Z",
    "status": "Approved",
    "type": "Normal",
    "userId": 1,
    "user": {...}
  }
]
```

---

### Get Applications by User

Retrieves all applications for a specific user. **This is the endpoint employees should use to see their own applications.**

**Endpoint:** `GET /api/applications/user/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Query Parameters:**

- `page` (number, optional) - Page number (default: 1)
- `size` (number, optional) - Items per page (default: 10)
- `status` (string, optional) - Filter by status: "Approved" | "Rejected" | "Pending"
- `type` (string, optional) - Filter by leave type
- `startDate` (date, optional) - Filter by start date (YYYY-MM-DD)
- `endDate` (date, optional) - Filter by end date (YYYY-MM-DD)

**Example Requests:**

```
GET /api/applications/user/1
GET /api/applications/user/1?page=1&size=10
GET /api/applications/user/1?status=Pending
GET /api/applications/user/1?type=Annual Leave&page=1&size=20
```

**Success Response (200):**

```json
{
  "totalItems": 15,
  "items": [
    {
      "id": 1,
      "name": "John Doe",
      "positionTitle": "Software Engineer",
      "reason": "Vacation",
      "startDate": "2024-03-15T00:00:00.000Z",
      "endDate": "2024-03-20T00:00:00.000Z",
      "numberOfDays": 6,
      "status": "Approved",
      "type": "Annual Leave",
      "approvedBy": "Jane Manager",
      "businessLeavePurpose": null,
      "businessLeaveDestination": null,
      "deductedFromBalance": true,
      "userId": 1,
      "createdAt": "2024-03-01T10:00:00.000Z",
      "updatedAt": "2024-03-02T14:00:00.000Z",
      "user": {
        "id": 1,
        "username": "john_doe",
        "fullName": "John Doe",
        "departmentId": 1
      }
    }
  ],
  "totalPages": 2,
  "currentPage": 1
}
```

**Notes:**

- **Recommended endpoint for employees** to view their own leave applications
- Supports pagination and filtering
- Any authenticated user can access this endpoint
- Shows only applications for the specified user ID

---

### Get Applications by Department

Retrieves all applications for a specific department.

**Endpoint:** `GET /api/applications/department/:id`

**Authentication:** Manager

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "startDate": "2024-03-15T00:00:00.000Z",
    "endDate": "2024-03-20T00:00:00.000Z",
    "status": "Pending",
    "type": "Normal",
    "user": {
      "departmentId": 1,
      ...
    }
  }
]
```

---

### Get Single Application

Retrieves a single application.

**Endpoint:** `GET /api/applications/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Application ID

**Success Response (200):**

```json
{
  "id": 1,
  "reason": "Vacation",
  "startDate": "2024-03-15T00:00:00.000Z",
  "endDate": "2024-03-20T00:00:00.000Z",
  "status": "Pending",
  "type": "Normal",
  "userId": 1
}
```

---

### Update Application

Updates an application (typically used for approval/rejection).

**Endpoint:** `PUT /api/applications/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Application ID

**Request Body:**

```json
{
  "status": "string", // Optional: "Approved" | "Rejected" | "Pending"
  "reason": "string", // Optional
  "startDate": "date", // Optional
  "endDate": "date", // Optional
  "type": "string" // Optional
}
```

**Success Response (200):**

```json
{
  "message": "Application was updated successfully."
}
```

---

### Delete Application

Deletes an application.

**Endpoint:** `DELETE /api/applications/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Application ID

**Success Response (200):**

```json
{
  "message": "Application was deleted successfully!"
}
```

---

### Delete All Applications

Deletes all applications.

**Endpoint:** `DELETE /api/applications`

**Authentication:** Admin

**Success Response (200):**

```json
{
  "message": "25 Applications were deleted successfully!"
}
```

---

### Delete Applications by User

Deletes all applications for a specific user.

**Endpoint:** `DELETE /api/applications/user/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
{
  "message": "5 Applications were deleted successfully!"
}
```

---

## Payments

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

## Expenses

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

## Department Announcements

### Create Announcement

Creates a new department announcement.

**Endpoint:** `POST /api/departmentAnnouncements`

**Authentication:** Admin or Manager

**Request Body:**

```json
{
  "announcementTitle": "string",       // Required
  "announcementDescription": "string", // Optional
  "createdByUserId": number,           // Required
  "departmentId": number               // Optional (null for company-wide)
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "announcementTitle": "Team Meeting",
  "announcementDescription": "Weekly sync on Friday at 2 PM",
  "createdByUserId": 1,
  "departmentId": 1,
  "createdAt": "2024-03-15T10:30:00.000Z"
}
```

---

### Get All Announcements

Retrieves all announcements with user and department information.

**Endpoint:** `GET /api/departmentAnnouncements`

**Authentication:** Any authenticated user

**Success Response (200):**

```json
[
  {
    "id": 1,
    "announcementTitle": "Team Meeting",
    "announcementDescription": "Weekly sync on Friday at 2 PM",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "createdByUserId": 1,
    "departmentId": 1,
    "user": {
      "id": 1,
      "fullName": "Admin User"
    },
    "department": {
      "id": 1,
      "departmentName": "Engineering"
    }
  }
]
```

---

### Get Recent Announcements

Retrieves the 2 most recent announcements (Admin view).

**Endpoint:** `GET /api/departmentAnnouncements/recent`

**Authentication:** Admin

**Success Response (200):**

```json
[
  {
    "id": 2,
    "announcementTitle": "Holiday Notice",
    "announcementDescription": "Office closed next Monday",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "user": {...},
    "department": {...}
  },
  {
    "id": 1,
    "announcementTitle": "Team Meeting",
    "createdAt": "2024-03-14T10:30:00.000Z",
    "user": {...},
    "department": {...}
  }
]
```

---

### Get Recent Announcements by Department

Retrieves the 2 most recent announcements for a specific department.

**Endpoint:** `GET /api/departmentAnnouncements/recent/department/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "announcementTitle": "Team Meeting",
    "announcementDescription": "Weekly sync on Friday",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "user": {...},
    "department": {
      "id": 1,
      "departmentName": "Engineering"
    }
  }
]
```

---

### Get Announcements by Department

Retrieves all announcements for a specific department.

**Endpoint:** `GET /api/departmentAnnouncements/department/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "announcementTitle": "Team Meeting",
    "announcementDescription": "Weekly sync on Friday at 2 PM",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "departmentId": 1,
    "user": {...},
    "department": {...}
  }
]
```

---

### Get Single Announcement

Retrieves a single announcement.

**Endpoint:** `GET /api/departmentAnnouncements/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Announcement ID

**Success Response (200):**

```json
{
  "id": 1,
  "announcementTitle": "Team Meeting",
  "announcementDescription": "Weekly sync on Friday at 2 PM",
  "createdAt": "2024-03-15T10:30:00.000Z",
  "createdByUserId": 1,
  "departmentId": 1
}
```

---

### Delete Announcement

Deletes an announcement.

**Endpoint:** `DELETE /api/departmentAnnouncements/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Announcement ID

**Success Response (200):**

```json
{
  "message": "Department Announcement was deleted successfully!"
}
```

---

### Delete Announcements by Department

Deletes all announcements for a specific department.

**Endpoint:** `DELETE /api/departmentAnnouncements/department/:id`

**Authentication:** Admin or Manager

**URL Parameters:**

- `id` (number) - Department ID

**Success Response (200):**

```json
{
  "message": "5 Department Announcements were deleted successfully!"
}
```

---

## Personal Information

### Create Personal Information

Creates personal information for a user with optional ID copy upload.

**Endpoint:** `POST /api/personalInformations`

**Authentication:** Admin

**Content-Type:** `multipart/form-data` (for file upload)

**Request Body (Form Data):**

```
dateOfBirth: "date"              // Optional (YYYY-MM-DD)
gender: "string"                 // Optional: "Male" | "Female"
maritalStatus: "string"          // Optional: "Married" | "Single" | "Widowed"
fatherName: "string"             // Optional
idNumber: "string"               // Optional
address: "string"                // Optional
city: "string"                   // Optional
country: "string"                // Optional
mobile: "string"                 // Optional
phone: "string"                  // Optional
emailAddress: "string"           // Optional
emergencyContact: "string"       // Optional (emergency contact details)
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

// 400 - Invalid file type
{
  "message": "Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed."
}

// 413 - File too large
{
  "message": "File too large. Maximum file size is 5MB."
}
```

**File Upload Specifications:**

- **Allowed file types:** JPEG, JPG, PNG, GIF, PDF
- **Maximum file size:** 5MB per file
- **Storage location:** `uploads/personal-info-files/`
- **Filename format:** `idCopy-timestamp-randomnumber.extension`
- **Optional field:** idCopy is optional

**Notes:**

- All fields are optional except `userId`
- The `emergencyContact` field can store emergency contact details (name, phone, relationship, etc.)
- The `idCopy` field stores the path to the uploaded ID document
- Files are accessible via: `http://localhost:3002/uploads/personal-info-files/filename`

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
  "dateOfBirth": "date", // Optional
  "gender": "string", // Optional
  "maritalStatus": "string", // Optional
  "fatherName": "string", // Optional
  "idNumber": "string", // Optional
  "address": "string", // Optional
  "city": "string", // Optional
  "country": "string", // Optional
  "mobile": "string", // Optional
  "phone": "string", // Optional
  "emailAddress": "string" // Optional
}
```

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

## Financial Information

### Create Financial Information

Creates new financial information for a user.

**Endpoint:** `POST /api/financialInformations`

**Authentication:** Admin

**Request Body:**

```json
{
  "employmentType": "string",          // Optional: "Full Time" | "Part Time"
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

## Personal Events

### Create Personal Event

Creates a new personal calendar event for a user.

**Endpoint:** `POST /api/personalEvents`

**Authentication:** Any authenticated user

**Request Body:**

```json
{
  "eventTitle": "string",          // Required
  "eventDescription": "string",    // Optional
  "eventStartDate": "date",        // Required (YYYY-MM-DD)
  "eventEndDate": "date",          // Optional (YYYY-MM-DD)
  "userId": number                 // Required
}
```

**Success Response (200):**

```json
{
  "id": 1,
  "eventTitle": "Doctor Appointment",
  "eventDescription": "Annual checkup",
  "eventStartDate": "2024-03-20T09:00:00.000Z",
  "eventEndDate": "2024-03-20T10:00:00.000Z",
  "userId": 1
}
```

---

### Get Personal Events by User

Retrieves all personal events for a specific user.

**Endpoint:** `GET /api/personalEvents/user/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
[
  {
    "id": 1,
    "eventTitle": "Doctor Appointment",
    "eventDescription": "Annual checkup",
    "eventStartDate": "2024-03-20T09:00:00.000Z",
    "eventEndDate": "2024-03-20T10:00:00.000Z",
    "userId": 1
  }
]
```

---

### Get Single Personal Event

Retrieves a single personal event.

**Endpoint:** `GET /api/personalEvents/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Personal Event ID

**Success Response (200):**

```json
{
  "id": 1,
  "eventTitle": "Doctor Appointment",
  "eventDescription": "Annual checkup",
  "eventStartDate": "2024-03-20T09:00:00.000Z",
  "eventEndDate": "2024-03-20T10:00:00.000Z",
  "userId": 1
}
```

---

### Update Personal Event

Updates a personal event.

**Endpoint:** `PUT /api/personalEvents/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Personal Event ID

**Request Body:**

```json
{
  "eventTitle": "string", // Optional
  "eventDescription": "string", // Optional
  "eventStartDate": "date", // Optional
  "eventEndDate": "date" // Optional
}
```

**Success Response (200):**

```json
{
  "message": "PersonalEvent was updated successfully."
}
```

---

### Delete Personal Event

Deletes a personal event.

**Endpoint:** `DELETE /api/personalEvents/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Personal Event ID

**Success Response (200):**

```json
{
  "message": "PersonalEvent was deleted successfully!"
}
```

---

### Delete Personal Events by User

Deletes all personal events for a specific user.

**Endpoint:** `DELETE /api/personalEvents/user/:id`

**Authentication:** Admin

**URL Parameters:**

- `id` (number) - User ID

**Success Response (200):**

```json
{
  "message": "10 Personal Events were deleted successfully!"
}
```

---

### Delete All Personal Events

Deletes all personal events.

**Endpoint:** `DELETE /api/personalEvents`

**Authentication:** Admin

**Success Response (200):**

```json
{
  "message": "50 Personal Events were deleted successfully!"
}
```

---

## General Notes

### Authentication

All endpoints (except `/login` and `/register`) require authentication via JWT token.

**Headers Required:**

```
Authorization: Bearer <your_jwt_token>
```

**Role-based Access:**

- **Admin (ROLE_ADMIN)**: Full access to all endpoints
- **Manager (ROLE_MANAGER)**: Limited administrative access (department-level management)
- **Employee (ROLE_EMPLOYEE)**: Access to own data only

### Pagination

All listing endpoints (GET requests that return multiple items) now support pagination via query parameters:

**Query Parameters:**

- `page` (number, optional) - Page number to retrieve (default: 1, minimum: 1)
- `size` (number, optional) - Number of items per page (default: 10, maximum: 100)

**Example Request:**

```
GET /api/users?page=2&size=20
```

**Paginated Response Format:**

```json
{
  "totalItems": 150,
  "items": [...],           // Array of actual data
  "totalPages": 8,
  "currentPage": 2,
  "pageSize": 20,
  "hasNextPage": true,
  "hasPrevPage": true
}
```

**Pagination Metadata:**

- `totalItems`: Total number of records in the database
- `items`: Array containing the actual data for the current page
- `totalPages`: Total number of pages available
- `currentPage`: Current page number
- `pageSize`: Actual number of items in the current page
- `hasNextPage`: Boolean indicating if there's a next page
- `hasPrevPage`: Boolean indicating if there's a previous page

**Notes:**

- If no pagination parameters are provided, defaults to page 1 with 10 items
- Maximum page size is capped at 100 items to prevent performance issues
- Invalid page numbers (< 1) default to page 1

### Caching

The API implements intelligent caching to improve performance and reduce database load:

**Cache Strategy:**

- **GET endpoints** are cached automatically
- **POST/PUT/DELETE operations** automatically clear relevant caches
- Cache duration varies by endpoint type:
  - List endpoints (findAll): 5 minutes (300 seconds)
  - Single item endpoints (findOne): 10 minutes (600 seconds)
  - Count/statistics endpoints: 5 minutes (300 seconds)

**Cache Behavior:**

- Cache keys are based on the full request URL including query parameters
- Different pagination pages are cached separately
- When data is created/updated/deleted, relevant cache entries are automatically invalidated
- The first request after cache expiration will hit the database and refresh the cache

**Cache Performance:**

- Cache HIT: Response served from memory (< 1ms)
- Cache MISS: Response fetched from database and cached (normal database query time)

**Example:**

```
First request:  GET /api/users?page=1&size=10  -> Cache MISS (queries DB)
Second request: GET /api/users?page=1&size=10  -> Cache HIT (from memory)
After 5 minutes: GET /api/users?page=1&size=10  -> Cache MISS (cache expired)
```

### Data Types

- **string**: Text values
- **number**: Integer values (for monetary values, salaries, etc.)
- **date**: Date values in format `YYYY-MM-DD` or ISO 8601 format
- **boolean**: `true` or `false`

### Date Formats

- Dates should be sent in `YYYY-MM-DD` format
- The system stores dates in ISO 8601 format with timezone

### Error Handling

Common error responses across all endpoints:

```json
// 400 - Bad Request
{
  "message": "Content can not be empty!"
}

// 401 - Unauthorized
{
  "message": "Access denied: No token provided"
}

// 403 - Forbidden
{
  "message": "Access denied: Wrong access token"
}

// 403 - Insufficient permissions
{
  "message": "Access denied: Role can't access this api"
}

// 500 - Server Error
{
  "message": "Some error occurred while..."
}
```

### Token Expiration

- JWT tokens expire after **1 year**
- Users can stay logged in for extended periods without re-authentication
- There is currently no refresh token mechanism

### Monetary Values

- All monetary values (salaries, payments, expenses, allowances, deductions) are stored as **integers**
- No decimal points are used in the database

### Status Enums

**Application Status:**

- `Approved`
- `Rejected`
- `Pending`

**Application Types:**

- `Normal`
- `Student`
- `Illness`
- `Marriage`

**Employment Types:**

- `Full Time`
- `Part Time`

**Payment Types:**

- `Check`
- `Bank Transfer`
- `Cash`

**User Roles:**

- `ROLE_ADMIN`
- `ROLE_MANAGER`
- `ROLE_EMPLOYEE`

**Gender:**

- `Male`
- `Female`

**Marital Status:**

- `Married`
- `Single`
- `Widowed`

---

## Server Configuration

- **Backend Port:** 3002 (default, configurable via `process.env.PORT`)
- **Database:** MySQL
- **ORM:** Sequelize v5.21.8
- **Authentication:** JWT (jsonwebtoken) with bcrypt password hashing

---

## Additional Resources

- **Quick Start Guide:** See `QUICK_START.md`
- **Original README:** See `README.md`
- **Setup Scripts:** `activate-user.sql`, `setup-admin.sql`

---

**Last Updated:** March 2024

**API Version:** 1.0.0
