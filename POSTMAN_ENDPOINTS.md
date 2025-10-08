# 📮 HRMS API - Postman Endpoints Guide

**Base URL:** `http://localhost:3001`

## ✅ Server Running Successfully!

---

## 🔓 **Public Endpoints (No Authentication Required)**

### 1. Test API Connection

```
GET http://localhost:3001/api
```

**Response:** `"this is the index for api"`

---

### 2. Register New User

```
POST http://localhost:3001/register
```

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "username": "testuser",
  "password": "password123",
  "fullname": "Test User"
}
```

**Note:** Users are created as `ROLE_EMPLOYEE` with `active: false` by default. You need to manually activate them in the database.

**Available Roles:**

- `ROLE_ADMIN` - Full access
- `ROLE_MANAGER` - Department management
- `ROLE_EMPLOYEE` - Self-service only

---

### 3. Login

```
POST http://localhost:3001/login
```

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "username": "bill",
  "password": "pass123!"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "bill",
    "role": "ROLE_ADMIN"
  }
}
```

> 💡 **Note:** Copy the `token` value from the response. You'll need it for protected endpoints.

---

## 🔒 **Protected Endpoints (Require Authentication)**

For all protected endpoints, add this header:

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

### 4. Check Token Validity

```
GET http://localhost:3001/checkToken
```

**Response:** `200 OK` if token is valid

---

### 5. Get All Users (Admin/Manager only)

```
GET http://localhost:3001/api/users
```

---

### 6. Get User Count (Admin/Manager only)

```
GET http://localhost:3001/api/users/total
```

---

### 7. Get Single User by ID

```
GET http://localhost:3001/api/users/1
```

(Replace `1` with actual user ID)

---

### 8. Update User (Admin only)

```
PUT http://localhost:3001/api/users/1
```

**Body (JSON):**

```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated@example.com"
}
```

---

### 9. Change Password

```
PUT http://localhost:3001/api/users/changePassword/1
```

**Body (JSON):**

```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

### 10. Delete User (Admin only)

```
DELETE http://localhost:3001/api/users/1
```

---

## 📁 **Department Endpoints**

### Get All Departments

```
GET http://localhost:3001/api/departments
```

### Create Department (Admin only)

```
POST http://localhost:3001/api/departments
```

**Body (JSON):**

```json
{
  "department_name": "IT Department"
}
```

### Get Users by Department ID

```
GET http://localhost:3001/api/users/department/1
```

---

## 💼 **Job Endpoints**

### Get All Jobs

```
GET http://localhost:3001/api/jobs
```

### Create Job

```
POST http://localhost:3001/api/jobs
```

**Body (JSON):**

```json
{
  "job_title": "Software Developer",
  "job_description": "Develop and maintain software",
  "salary": 50000,
  "userId": 1
}
```

---

## 📝 **Application (Leave) Endpoints**

### Get All Applications

```
GET http://localhost:3001/api/applications
```

### Create Application

```
POST http://localhost:3001/api/applications
```

**Body (JSON):**

```json
{
  "application_type": "Annual Leave",
  "start_date": "2025-10-15",
  "end_date": "2025-10-20",
  "reason": "Family vacation",
  "status": "Pending",
  "userId": 1
}
```

---

## 💰 **Payment Endpoints**

### Get All Payments

```
GET http://localhost:3001/api/payments
```

### Create Payment

```
POST http://localhost:3001/api/payments
```

**Body (JSON):**

```json
{
  "payment_date": "2025-10-01",
  "amount": 5000,
  "jobId": 1
}
```

---

## 💸 **Expense Endpoints**

### Get All Expenses

```
GET http://localhost:3001/api/expenses
```

### Create Expense

```
POST http://localhost:3001/api/expenses
```

**Body (JSON):**

```json
{
  "expense_type": "Office Supplies",
  "amount": 250.5,
  "expense_date": "2025-10-07",
  "description": "Printer paper and ink",
  "departmentId": 1
}
```

---

## 📢 **Department Announcement Endpoints**

### Get All Announcements

```
GET http://localhost:3001/api/departmentAnnouncements
```

### Create Announcement

```
POST http://localhost:3001/api/departmentAnnouncements
```

**Body (JSON):**

```json
{
  "title": "Team Meeting",
  "content": "Monthly team meeting scheduled for Friday",
  "departmentId": 1,
  "createdByUserId": 1
}
```

---

## 🗓️ **Personal Event Endpoints**

### Get All Personal Events

```
GET http://localhost:3001/api/personalEvents
```

### Create Personal Event

```
POST http://localhost:3001/api/personalEvents
```

**Body (JSON):**

```json
{
  "event_title": "Birthday",
  "event_date": "2025-12-25",
  "event_type": "Personal",
  "userId": 1
}
```

---

## 👤 **User Personal Information Endpoints**

### Get Personal Information

```
GET http://localhost:3001/api/personalInformations
```

### Create/Update Personal Information

```
POST http://localhost:3001/api/personalInformations
```

**Body (JSON):**

```json
{
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001",
  "date_of_birth": "1990-01-01",
  "userId": 1
}
```

---

## 💳 **User Financial Information Endpoints**

### Get Financial Information

```
GET http://localhost:3001/api/financialInformations
```

### Create/Update Financial Information

```
POST http://localhost:3001/api/financialInformations
```

**Body (JSON):**

```json
{
  "bank_name": "Chase Bank",
  "account_number": "1234567890",
  "routing_number": "987654321",
  "salary": 75000,
  "userId": 1
}
```

---

## 🎯 **Quick Start Guide for Postman:**

1. **Import this collection** or manually create requests
2. **Test API connection:** `GET http://localhost:3001/api`
3. **Login:** `POST http://localhost:3001/login` with credentials
4. **Copy the token** from login response
5. **Set up Authentication:**
   - Go to request → Authorization tab
   - Type: Bearer Token
   - Token: Paste your JWT token
6. **Test protected endpoints**

---

## ⚠️ **Important Notes:**

- **Token expires** after a certain time (check backend config)
- **Default admin credentials** (from README):
  - Username: `bill`
  - Password: `pass123!`
- Database tables are created automatically when server starts
- All dates should be in format: `YYYY-MM-DD`
- All monetary values are numbers (no currency symbols)

---

## 🛠️ **Troubleshooting:**

| Issue                              | Solution                                          |
| ---------------------------------- | ------------------------------------------------- |
| "Access denied: No token provided" | Add Authorization header with Bearer token        |
| "Invalid token"                    | Login again to get a new token                    |
| "Unauthorized"                     | Your role doesn't have permission for this action |
| Connection refused                 | Make sure backend server is running on port 3001  |

---

**Backend Server:** ✅ Running on `http://localhost:3001`
**Frontend (when started):** `http://localhost:3000`

Happy testing! 🚀
