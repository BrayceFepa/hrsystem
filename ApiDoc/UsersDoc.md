# Users & Employees Management

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
  - Personal Information (Personal & Contact details) - See [PersonalInfoDoc.md](./PersonalInfoDoc.md) for details
  - Financial Information (Salary & Banking details) - See [FinancialInfoDoc.md](./FinancialInfoDoc.md) for details
  - Job (Employment details) - See [JobsDoc.md](./JobsDoc.md) for details
- Use the following endpoints to complete employee setup:
  1. `POST /api/personalInformations` - Add personal information (see [PersonalInfoDoc.md](./PersonalInfoDoc.md))
  2. `POST /api/financialInformations` - Add financial information (see [FinancialInfoDoc.md](./FinancialInfoDoc.md))
  3. `POST /api/jobs` - Add employment/job information (see [JobsDoc.md](./JobsDoc.md))

---

### Create Complete Employee

Creates a complete employee with all associated information. This is typically done in a single workflow with multiple API calls.

**Workflow:**

1. **Create User Account** (`POST /api/users`)
2. **Add Personal Information** (`POST /api/personalInformations`) - See [PersonalInfoDoc.md](./PersonalInfoDoc.md) for full endpoint documentation
3. **Add Financial Information** (`POST /api/financialInformations`) - See [FinancialInfoDoc.md](./FinancialInfoDoc.md) for full endpoint documentation
4. **Add Employment/Job** (`POST /api/jobs`) - See [JobsDoc.md](./JobsDoc.md) for full endpoint documentation
5. **(Optional)** Add Certificates (`POST /api/userCertificates`) - See [UserCertificatesDoc.md](./UserCertificatesDoc.md) for full endpoint documentation
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
    "empType": "Full Time", // Required: "Full Time" | "Part Time" | "Internship" | "Contractual"
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

> **Note:** This is a reference for the complete employee workflow. For full endpoint documentation, request/response examples, and field specifications, see [PersonalInfoDoc.md](./PersonalInfoDoc.md)

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

**See [PersonalInfoDoc.md](./PersonalInfoDoc.md) for:**

- Complete endpoint documentation (`POST /api/personalInformations`)
- Request/response examples
- File upload specifications
- All available fields and their requirements

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
| `empType`                       | string  | ✅       | "Full Time", "Part Time", "Internship", or "Contractual"  |
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
