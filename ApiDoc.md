# HR System API Documentation

This document provides comprehensive documentation for all API endpoints in the HR System.

---

## Table of Contents

- [Authentication & User Management](#authentication--user-management)
  - [Login](#login)
  - [Register](#register)
  - [Check Token](#check-token)
- [Users & Employees Management](#users--employees-management)
- [Departments & Organizations](#departments--organizations)
- [Jobs & Employment](#jobs--employment)
- [Leave Applications & Requests](#leave-applications--requests)
- [Payments & Financial Records](#payments--financial-records)
- [Expenses & Budget Management](#expenses--budget-management)
- [Announcements & Communications](#announcements--communications)
- [Personal Information & Profiles](#personal-information--profiles)
- [Financial Information & Banking](#financial-information--banking)
- [Personal Events & Calendar](#personal-events--calendar)
- [User Certificates & Documents](#user-certificates--documents)
- [Salary History & Management](#salary-history--management)

---

## Authentication & User Management

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

## Users & Employees Management

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

**Notes:**

- User is created with `active: true` by default
- After creating a user, you need to create associated records:
  - Personal Information (Personal & Contact details)
  - Financial Information (Salary & Banking details)
  - Job (Employment details)
- Use the following endpoints to complete employee setup:
  1. `POST /api/personalInformations` - Add personal information
  2. `POST /api/financialInformations` - Add financial information
  3. `POST /api/jobs` - Add employment/job information

---

### Create Complete Employee

Creates a complete employee with all associated information. This is typically done in a single workflow with multiple API calls.

**Workflow:**

1. **Create User Account** (`POST /api/users`)
2. **Add Personal Information** (`POST /api/personalInformations`)
3. **Add Financial Information** (`POST /api/financialInformations`)
4. **Add Employment/Job** (`POST /api/jobs`)
5. **(Optional)** Add Certificates (`POST /api/userCertificates`)
6. **(Optional)** Set up Employee Allowances (`POST /api/employeeAllowances`)

**Complete Employee Data Structure:**

```json
{
  "user": {
    "username": "john_doe", // Required
    "password": "secure_password", // Required
    "fullname": "John Doe", // Required
    "role": "ROLE_EMPLOYEE", // Required
    "departmentId": 1 // Required (department assignment)
  },

  "personalInfo": {
    "dateOfBirth": "1990-01-15", // Required: Date of Birth
    "gender": "Male", // Required: "Male" | "Female"
    "maritalStatus": "Married", // Required: "Married" | "Single" | "Widowed"
    "nationalIdNumber": "1234567890", // Required: National ID/Passport
    "phone": "+251911234567", // Required: Phone number
    "emailAddress": "john@company.com", // Required: Email address
    "address": "123 Main Street", // Required: Address
    "city": "Addis Ababa", // Required: City
    "country": "Ethiopia", // Required: Country
    "emergencyContact": "Jane Doe - +251922345678", // Required: Emergency contact
    "emergencyContactId": "ECO123", // Optional: Emergency contact ID
    "guarantorId": "GUAR123", // Optional: Guarantor ID
    "guarantorSignature": "File", // Optional: Signature document
    "remark": "No special notes" // Optional: Additional notes
  },

  "financialInfo": {
    "salaryBasic": 10000, // Required: Basic salary
    "salaryGross": 12000, // Calculated: Gross salary
    "salaryNet": 9000, // Calculated: Net salary
    "bankName": "Commercial Bank of Ethiopia", // Required: Bank name
    "accountNumber": "1234567890", // Required: Account number
    "branch": "Bole Branch" // Required: Branch name
  },

  "job": {
    "jobTitle": "Software Engineer", // Required: Job title
    "startDate": "2024-01-01", // Required: Employment start date
    "endDate": "2025-12-31", // Optional: Employment end date
    "empType": "Full-Time", // Required: "Full-Time" | "Part-Time" | "Contract"
    "empStatus": "Active", // Required: "Active" | "On Leave" | "Terminated" | "Resigned"
    "directSupervisor": "Jane Manager", // Required: Supervisor name
    "agreementType": "Permanent", // Optional: "Permanent" | "Contract" | "Probation" | "Intern"
    "contract": "File", // Optional: Employment contract
    "certificate": "File", // Optional: Professional certificate
    "takenAssets": "Laptop (Dell XPS 15), Phone (iPhone 13)", // Optional: Assets assigned to employee (text)
    "documentScanned": true, // Optional: Whether documents are scanned (true/false)
    "guaranteeForm": "File", // Optional: Guarantee form
    "companyGuaranteeSupportLetter": "File" // Optional: Support letter
  },

  "allowances": [
    // Optional: Employee allowances
    {
      "allowanceTypeId": 1, // Transport Allowance
      "amount": 800,
      "effectiveDate": "2024-01-01"
    },
    {
      "allowanceTypeId": 2, // Shift Allowance
      "amount": 500,
      "effectiveDate": "2024-01-01"
    }
  ],

  "certificates": [
    // Optional: Employee certificates
    {
      "certificateType": "Degree",
      "certificateName": "Bachelor of Computer Science",
      "issuingAuthority": "Addis Ababa University",
      "issueDate": "2020-07-15",
      "certificateNumber": "BSC2020001",
      "filePath": "File"
    }
  ]
}
```

**Field Reference - Personal Information:**

| Field                | Type   | Required | Description                         |
| -------------------- | ------ | -------- | ----------------------------------- |
| `dateOfBirth`        | date   | ✅       | Employee date of birth (YYYY-MM-DD) |
| `gender`             | string | ✅       | "Male" or "Female"                  |
| `maritalStatus`      | string | ✅       | "Married", "Single", or "Widowed"   |
| `nationalIdNumber`   | string | ✅       | National ID or Passport number      |
| `phone`              | string | ✅       | Primary phone number                |
| `emailAddress`       | string | ✅       | Email address                       |
| `address`            | string | ✅       | Street address                      |
| `city`               | string | ✅       | City name                           |
| `country`            | string | ✅       | Country name                        |
| `emergencyContact`   | string | ✅       | Emergency contact details           |
| `emergencyContactId` | string | ❌       | Emergency contact ID                |
| `guarantorId`        | string | ❌       | Guarantor ID                        |
| `guarantorSignature` | file   | ❌       | Guarantor signature document        |
| `remark`             | string | ❌       | Additional notes                    |

**Field Reference - Financial Information:**

| Field           | Type   | Required | Description                             |
| --------------- | ------ | -------- | --------------------------------------- |
| `salaryBasic`   | number | ✅       | Basic salary amount                     |
| `salaryGross`   | number | ❌       | Gross salary (calculated automatically) |
| `salaryNet`     | number | ❌       | Net salary (calculated automatically)   |
| `bankName`      | string | ✅       | Bank name                               |
| `accountNumber` | string | ✅       | Bank account number                     |
| `branch`        | string | ✅       | Bank branch name                        |
| `iban`          | string | ❌       | IBAN number                             |

**Field Reference - Job/Employment:**

| Field                           | Type    | Required | Description                                               |
| ------------------------------- | ------- | -------- | --------------------------------------------------------- |
| `jobTitle`                      | string  | ✅       | Job title/position                                        |
| `startDate`                     | date    | ✅       | Employment start date                                     |
| `endDate`                       | date    | ❌       | Employment end date (for fixed-term)                      |
| `empType`                       | string  | ✅       | "Full-Time", "Part-Time", "Contract", or "Probation"      |
| `empStatus`                     | string  | ✅       | "Active", "On Leave", "Terminated", or "Resigned"         |
| `directSupervisor`              | string  | ✅       | Supervisor name or ID                                     |
| `agreementType`                 | string  | ❌       | "Permanent", "Contract", "Probation", or "Intern"         |
| `contract`                      | file    | ❌       | Employment contract document                              |
| `certificate`                   | file    | ❌       | Professional certificate                                  |
| `takenAssets`                   | string  | ❌       | Assets assigned to employee (text field)                  |
| `documentScanned`               | boolean | ❌       | Whether employee documents have been scanned (true/false) |
| `guaranteeForm`                 | file    | ❌       | Guarantee form document                                   |
| `companyGuaranteeSupportLetter` | file    | ❌       | Company support letter                                    |

**Notes:**

- All required fields must be provided for a complete employee record
- Employee creation is a multi-step process (User → Personal Info → Financial Info → Job)
- Financial information can include allowances which affect tax and pension calculations
- Job documents (contracts, certificates) are uploaded as files
- `takenAssets` is a text field (not a file) - describes assets assigned to employee
- `documentScanned` is a boolean field (true/false) indicating if documents are scanned
- Allowances are managed separately and can be added/updated independently

---

### Get All Users

Retrieves all users with their related information. Supports filtering by role, active status, and employment status.

**Endpoint:** `GET /api/users`

**Authentication:** Admin, Manager, HR, or Finance

**Query Parameters:**

**Basic Parameters:**

- `page` (number, optional) - Page number (default: 1)
- `size` (number, optional) - Items per page (default: 10)

**Simple Query Filters:**

- `role` (string, optional) - Filter by role (single or comma-separated): "ROLE_EMPLOYEE" | "ROLE_MANAGER" | "ROLE_ADMIN" | "ROLE_HR" | "ROLE_FINANCE"
- `active` (boolean, optional) - Filter by account status: true | false
- `empStatus` (string, optional) - Filter by employment status (from Job): "Active" | "On Leave" | "Terminated" | "Resigned"
- `fullName` (string, optional) - Filter by full name (contains)
- `email` (string, optional) - Filter by email address (contains)
- `departmentId` (number, optional) - Filter by department ID
- `jobTitle` (string, optional) - Filter by job title (contains)
- `salaryMin` (number, optional) - Filter by minimum salary
- `salaryMax` (number, optional) - Filter by maximum salary

**Advanced Structured Filters:**

- `filter` (JSON array, optional) - Advanced filtering with field, operator, and value

**Filter Structure:**

```json
[
  {
    "field": "fullName",
    "operator": "contains",
    "value": "John"
  },
  {
    "field": "salaryBasic",
    "operator": "between",
    "value": [50000, 100000]
  }
]
```

**Available Fields:**

- `fullName`, `username`, `email`, `phone`, `mobile`
- `departmentId`, `departmentName`, `jobTitle`, `empStatus`, `empType`
- `salaryBasic`, `salaryGross`, `role`, `active`

**Available Operators:**

- `equal`, `not_equal`, `contains`, `starts_with`, `ends_with`
- `greater_than`, `greater_equal`, `less_than`, `less_equal`
- `in`, `not_in`, `between`, `is_null`, `is_not_null`

**Example Requests:**

**Simple Filters:**

```
GET /api/users
GET /api/users?page=1&size=20
GET /api/users?role=ROLE_EMPLOYEE
GET /api/users?role=ROLE_EMPLOYEE,ROLE_MANAGER
GET /api/users?role=ROLE_EMPLOYEE&active=true
GET /api/users?fullName=John
GET /api/users?email=@company.com
GET /api/users?salaryMin=50000&salaryMax=100000
```

**Advanced Structured Filters:**

```
GET /api/users?filter=[{"field":"fullName","operator":"contains","value":"John"}]
GET /api/users?filter=[{"field":"email","operator":"ends_with","value":"@company.com"}]
GET /api/users?filter=[{"field":"salaryBasic","operator":"between","value":[50000,100000]}]
GET /api/users?filter=[{"field":"role","operator":"in","value":["ROLE_EMPLOYEE","ROLE_MANAGER"]},{"field":"active","operator":"equal","value":true}]
```

**Success Response (200):**

```json
{
  "totalItems": 150,
  "items": [
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
      "jobs": [
        {
          "id": 1,
          "jobTitle": "Software Engineer",
          "empStatus": "Active",
          ...
        }
      ]
    }
  ],
  "totalPages": 8,
  "currentPage": 1
}
```

**Notes:**

- Multiple roles can be specified using comma-separated values
- When filtering by `empStatus`, only users with at least one job matching that status are returned
- All filters can be combined for more specific queries
- Pagination works with all filters

---

### Get Filter Options

Retrieves available filter fields and operators for the user list.

**Endpoint:** `GET /api/users/filter-options`

**Authentication:** Admin, Manager, HR, or Finance

**Success Response (200):**

```json
{
  "fields": [
    "fullName",
    "username",
    "email",
    "phone",
    "mobile",
    "departmentId",
    "departmentName",
    "jobTitle",
    "empStatus",
    "empType",
    "salaryBasic",
    "salaryGross",
    "role",
    "active"
  ],
  "operators": [
    "equal",
    "not_equal",
    "contains",
    "starts_with",
    "ends_with",
    "greater_than",
    "greater_equal",
    "less_than",
    "less_equal",
    "in",
    "not_in",
    "between",
    "is_null",
    "is_not_null"
  ],
  "examples": [
    {
      "description": "Find users with full name containing 'John'",
      "filter": "[{\"field\":\"fullName\",\"operator\":\"contains\",\"value\":\"John\"}]"
    },
    {
      "description": "Find users with email ending with '@company.com'",
      "filter": "[{\"field\":\"email\",\"operator\":\"ends_with\",\"value\":\"@company.com\"}]"
    },
    {
      "description": "Find users with salary between 50000 and 100000",
      "filter": "[{\"field\":\"salaryBasic\",\"operator\":\"between\",\"value\":[50000,100000]}]"
    },
    {
      "description": "Find active employees in specific roles",
      "filter": "[{\"field\":\"role\",\"operator\":\"in\",\"value\":[\"ROLE_EMPLOYEE\",\"ROLE_MANAGER\"]},{\"field\":\"active\",\"operator\":\"equal\",\"value\":true}]"
    }
  ]
}
```

---

### Get User Count

Retrieves total number of users.

**Endpoint:** `GET /api/users/total`

**Authentication:** Admin, Manager, HR, or Finance

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

Retrieves all users in a specific department. Supports filtering by role, active status, and employment status.

**Endpoint:** `GET /api/users/department/:id`

**Authentication:** Any authenticated user

**URL Parameters:**

- `id` (number) - Department ID

**Query Parameters:**

- `page` (number, optional) - Page number (default: 1)
- `size` (number, optional) - Items per page (default: 10)
- `role` (string, optional) - Filter by role (single or comma-separated): "ROLE_EMPLOYEE" | "ROLE_MANAGER" | "ROLE_ADMIN" | "ROLE_HR" | "ROLE_FINANCE"
- `active` (boolean, optional) - Filter by account status: true | false
- `empStatus` (string, optional) - Filter by employment status (from Job): "Active" | "On Leave" | "Terminated" | "Resigned"

**Example Requests:**

```
GET /api/users/department/1
GET /api/users/department/1?page=1&size=20
GET /api/users/department/1?role=ROLE_EMPLOYEE
GET /api/users/department/1?role=ROLE_EMPLOYEE,ROLE_MANAGER
GET /api/users/department/1?role=ROLE_EMPLOYEE&active=true
GET /api/users/department/1?role=ROLE_EMPLOYEE&active=true&empStatus=Active
```

**Success Response (200):**

```json
{
  "totalItems": 25,
  "items": [
    {
      "id": 1,
      "username": "john_doe",
      "fullName": "John Doe",
      "role": "ROLE_EMPLOYEE",
      "active": true,
      "departmentId": 1,
      "user_personal_info": {...},
      "user_financial_info": {...},
      "department": {
        "id": 1,
        "departmentName": "Engineering"
      },
      "jobs": [
        {
          "id": 1,
          "jobTitle": "Software Engineer",
          "empStatus": "Active",
          ...
        }
      ]
    }
  ],
  "totalPages": 2,
  "currentPage": 1
}
```

**Notes:**

- Multiple roles can be specified using comma-separated values
- When filtering by `empStatus`, only users with at least one job matching that status are returned
- All filters can be combined for more specific queries
- Pagination works with all filters

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

## Departments & Organizations

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

**Authentication:** Admin, Manager, HR, or Finance

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

## Leave Applications & Requests

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

### Get Applications for Manager (Own + Department)

Retrieves applications for the current manager, including their own applications and all applications from employees in their department. This is the recommended endpoint for managers to view applications in their scope.

**Endpoint:** `GET /api/applications/manager/me`

**Authentication:** Manager only (ROLE_MANAGER)

**Query Parameters:**

- `page` (number, optional) - Page number (default: 1)
- `size` (number, optional) - Items per page (default: 10)
- `status` (string, optional) - Filter by status: "Approved" | "Rejected" | "Pending"
- `type` (string, optional) - Filter by leave type
- `startDate` (date, optional) - Filter by start date (YYYY-MM-DD)
- `endDate` (date, optional) - Filter by end date (YYYY-MM-DD)

**Example Requests:**

```
GET /api/applications/manager/me
GET /api/applications/manager/me?page=1&size=20
GET /api/applications/manager/me?status=Pending
GET /api/applications/manager/me?type=Annual Leave&page=1&size=10
GET /api/applications/manager/me?startDate=2024-01-01&endDate=2024-12-31
```

**Success Response (200):**

```json
{
  "totalItems": 45,
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
      "userId": 5,
      "createdAt": "2024-03-01T10:00:00.000Z",
      "updatedAt": "2024-03-01T10:00:00.000Z",
      "user": {
        "id": 5,
        "username": "john_doe",
        "fullName": "John Doe",
        "departmentId": 1
      }
    },
    {
      "id": 2,
      "name": "Jane Manager",
      "positionTitle": "Engineering Manager",
      "reason": "Conference",
      "startDate": "2024-03-10T00:00:00.000Z",
      "endDate": "2024-03-12T00:00:00.000Z",
      "numberOfDays": 3,
      "status": "Approved",
      "type": "Business Leave",
      "approvedBy": "HR Department",
      "businessLeavePurpose": "Tech Conference",
      "businessLeaveDestination": "San Francisco",
      "deductedFromBalance": false,
      "userId": 3,
      "createdAt": "2024-02-25T10:00:00.000Z",
      "updatedAt": "2024-02-26T14:00:00.000Z",
      "user": {
        "id": 3,
        "username": "jane_manager",
        "fullName": "Jane Manager",
        "departmentId": 1
      }
    }
  ],
  "totalPages": 3,
  "currentPage": 1
}
```

**Error Responses:**

```json
// 404 - Manager not found
{
  "message": "Manager not found"
}

// 400 - Manager not assigned to department
{
  "message": "Manager is not assigned to any department"
}

// 401 - Not authorized (non-manager role)
{
  "message": "Access denied: Role can't access this api"
}
```

**Notes:**

- **Recommended endpoint for managers** to view leave applications within their scope
- Automatically includes the manager's own applications (same department)
- Automatically includes all applications from employees in the manager's department
- Manager's department is determined from their user profile (`departmentId`)
- Only accessible by users with `ROLE_MANAGER` role
- Supports all the same filters and pagination as the general applications endpoint
- More convenient than calling multiple endpoints (`/user/:id` + `/department/:id`)
- Manager must be assigned to a department for this endpoint to work

**Use Cases:**

- Manager reviewing pending leave requests from their team
- Manager checking their own leave history alongside team members
- Manager generating department leave reports
- Manager viewing all approved/rejected applications in their department

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

## Announcements & Communications

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

**Authentication:** Admin, Finance

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

## Personal Information & Profiles

### Create Personal Information

Creates personal information for a user with optional ID copy upload.

**Endpoint:** `POST /api/personalInformations`

**Authentication:** Admin

**Content-Type:** `multipart/form-data` (for file upload)

**Request Body (Form Data):**

```
dateOfBirth: "date"                   // Optional (YYYY-MM-DD)
gender: "string"                      // Optional: "Male" | "Female"
maritalStatus: "string"               // Optional: "Married" | "Single" | "Widowed"
fatherName: "string"                  // Optional
idNumber: "string"                    // Optional
address: "string"                     // Optional
city: "string"                        // Optional
country: "string"                     // Optional
mobile: "string"                      // Optional
phone: "string"                       // Optional
emailAddress: "string"               // Optional
emergencyContact: "string"            // Optional (emergency contact details)
nationalIdNumber: "string"            // Optional (National ID/Passport number) ✨ ENHANCED
emergencyContactId: "string"          // Optional (Emergency contact ID) ✨ NEW
guarantorId: "string"                 // Optional (Guarantor ID) ✨ NEW
guarantorSignature: File             // Optional (Guarantor signature document, max 5MB) ✨ NEW
remark: "string"                      // Optional (Additional notes) ✨ NEW
idCopy: File                          // Optional (PDF or Image, max 5MB)
userId: number                        // Required
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

## Financial Information & Banking

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

## Personal Events & Calendar

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

**Employment Status:**

- `Active`
- `On Leave`
- `Terminated`
- `Resigned`

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
