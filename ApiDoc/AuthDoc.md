# Authentication & User Management

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
