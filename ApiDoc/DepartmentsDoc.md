# Departments & Organizations

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
