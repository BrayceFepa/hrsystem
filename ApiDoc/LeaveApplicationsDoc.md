# Leave Applications & Requests

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
