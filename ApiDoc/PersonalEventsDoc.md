# Personal Events & Calendar

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
