# Common Reference & General Notes

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
