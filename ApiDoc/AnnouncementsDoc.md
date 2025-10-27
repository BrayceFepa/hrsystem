# Announcements & Communications

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
