# 🚀 HRMS Quick Start Guide

## ✅ What We Fixed

1. ✅ **Database Connection** - Successfully connected to `hrms`
2. ✅ **Database Tables** - Created all required tables automatically
3. ✅ **Backend Server** - Running on `http://localhost:3001`
4. ✅ **Node.js Compatibility** - Fixed for Node v22.18.0

---

## 🎯 Quick Test Endpoints (Postman)

### 1. **Test Connection** (No auth needed)

```
GET http://localhost:3001/api
```

Expected: `"this is the index for api"`

---

### 2. **Login** (No auth needed)

```
POST http://localhost:3001/login
Content-Type: application/json

{
  "username": "bill",
  "password": "pass123!"
}
```

**OR create your own user first:**

```
POST http://localhost:3001/register
Content-Type: application/json

{
  "username": "yourname",
  "password": "yourpassword",
  "fullname": "Your Full Name"
}
```

**Note:** After registering, run `activate-user.sql` in phpMyAdmin to activate and set role to ADMIN.

---

### 3. **Test Protected Endpoint** (Auth required)

After login, copy the `token` from response, then:

```
GET http://localhost:3001/api/users
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📁 Available API Routes

All routes are prefixed with `http://localhost:3001`

| Endpoint                       | Method | Auth | Description            |
| ------------------------------ | ------ | ---- | ---------------------- |
| `/api`                         | GET    | No   | Test connection        |
| `/register`                    | POST   | No   | Create new user        |
| `/login`                       | POST   | No   | Login user             |
| `/checkToken`                  | GET    | Yes  | Validate token         |
| `/api/users`                   | GET    | Yes  | Get all users          |
| `/api/users/:id`               | GET    | Yes  | Get one user           |
| `/api/departments`             | GET    | Yes  | Get departments        |
| `/api/jobs`                    | GET    | Yes  | Get jobs               |
| `/api/applications`            | GET    | Yes  | Get leave applications |
| `/api/payments`                | GET    | Yes  | Get payments           |
| `/api/expenses`                | GET    | Yes  | Get expenses           |
| `/api/departmentAnnouncements` | GET    | Yes  | Get announcements      |
| `/api/personalEvents`          | GET    | Yes  | Get personal events    |

**See `POSTMAN_ENDPOINTS.md` for complete documentation with request bodies!**

---

## 🏃 How to Run

### Backend Only:

```bash
npm run server
```

### Frontend Only (when you're ready):

```bash
npm run client
```

### Both Together:

```bash
npm run dev
```

---

## 📝 Current Status

- ✅ Backend: **RUNNING** on port 3001
- ⏸️ Frontend: **NOT STARTED** (we can start it when needed)
- ✅ Database: **CONNECTED** to `hrms`
- ✅ Tables: **CREATED** automatically

---

## 🗂️ Database Tables Created

The following tables exist in your `hrms`:

1. `user` - User accounts
2. `userPersonalInfo` - Personal details
3. `userFinancialInfo` - Financial/salary info
4. `department` - Departments
5. `deptAnnouncement` - Announcements
6. `job` - Job positions
7. `application` - Leave applications
8. `payment` - Payment records
9. `expense` - Expense tracking
10. `userPersonalEvent` - Personal calendar events

You can view these in phpMyAdmin!

---

## 🎯 Next Steps

1. **Test in Postman** using the endpoints above
2. **Create admin user** if you don't want to use "bill"
3. **Start frontend** when ready: `npm run client`
4. **Access UI** at `http://localhost:3000`

---

## ⚠️ Important Files

- `.env` - Database credentials (DO NOT commit to git)
  ```
  HOST=localhost
  DATABASE_USER=root
  DATABASE_PASSWORD=
  DATABASE=hrms_db
  NODE_ENV=development
  SECRET_KEY=your-secret-key-here-make-it-long-and-random
  ```
- `POSTMAN_ENDPOINTS.md` - Full API documentation
- `package.json` - Backend dependencies
- `client/package.json` - Frontend dependencies

---

**Need help? Check `POSTMAN_ENDPOINTS.md` for detailed examples!**
