# 🚀 HRMS - Complete Setup & Quick Start Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [First Time Setup](#first-time-setup)
7. [Testing the API](#testing-the-api)
8. [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

Before you begin, make sure you have the following installed:

### Required Software:

1. **Node.js** (v14 or higher recommended, tested on v22.18.0)

   - Download: https://nodejs.org/
   - Check version: `node -v`

2. **npm** (comes with Node.js)

   - Check version: `npm -v`

3. **MySQL Server** (via XAMPP, WAMP, or standalone)

   - XAMPP: https://www.apachefriends.org/
   - WAMP: https://www.wampserver.com/

4. **Git** (optional, for cloning)

   - Download: https://git-scm.com/

5. **Postman** (optional, for API testing)
   - Download: https://www.postman.com/downloads/

---

## 🔧 Installation

### Step 1: Get the Project

```bash
# If cloning from git
git clone <repository-url>
cd hrsytem

# OR if you already have the files, navigate to the project folder
cd path/to/hrsytem
```

### Step 2: Install Backend Dependencies

```bash
# From the project root directory
npm install
```

This will install all backend dependencies including:

- Express.js
- Sequelize (ORM)
- MySQL2
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- And more...

### Step 3: Install Frontend Dependencies

```bash
# Navigate to client folder
cd client

# Install frontend dependencies
npm install

# Go back to root
cd ..
```

This will install all React dependencies including:

- React & React-DOM
- React Router
- Axios
- Bootstrap
- Material-UI
- FullCalendar
- Chart.js
- And more...

**Note:** If you encounter errors during installation, try:

```bash
npm install --legacy-peer-deps
```

---

## 🗄️ Database Setup

### Step 1: Start MySQL Server

**If using XAMPP:**

1. Open XAMPP Control Panel
2. Start **Apache** (for phpMyAdmin)
3. Start **MySQL**

**If using WAMP:**

1. Start WAMP
2. Make sure both services are green/running

### Step 2: Create Database

**Option A: Using phpMyAdmin (Recommended)**

1. Open phpMyAdmin in browser: `http://localhost/phpmyadmin`
2. Click **"New"** in the left sidebar
3. Database name: `hrms_db` (or `hrms`)
4. Collation: `utf8mb4_unicode_ci`
5. Click **"Create"**

**Option B: Using SQL**

1. Open phpMyAdmin → SQL tab
2. Run this query:

```sql
CREATE DATABASE hrms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Note:** The application will automatically create all tables when you first run the backend server!

---

## ⚙️ Environment Configuration

### Create `.env` File

In the **project root directory**, create a file named `.env` with the following content:

```env
HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE=hrms_db
NODE_ENV=development
SECRET_KEY=my_super_secret_jwt_key_change_in_production_12345
```

**Important Notes:**

- `DATABASE_PASSWORD` - Leave empty if your MySQL root user has no password (default for XAMPP/WAMP)
- `DATABASE` - Use `hrms_db` or `hrms` (match what you created in phpMyAdmin)
- `SECRET_KEY` - **REQUIRED!** This is used for JWT token encryption. Use a long random string.

**Example `.env` with password:**

```env
HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=mypassword123
DATABASE=hrms_db
NODE_ENV=development
SECRET_KEY=hrms_jwt_secret_key_2024_change_this_later
```

---

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**

```bash
# From project root
npm run server
```

Backend will start on: `http://localhost:3001`

**Terminal 2 - Frontend:**

```bash
# From project root
npm run client
```

Frontend will start on: `http://localhost:3000`

### Option 2: Run Both Together (Recommended)

```bash
# From project root
npm run dev
```

This starts both backend and frontend concurrently.

**Expected Output:**

```
[0] [nodemon] starting `node app.js`
[0] Executing (default): CREATE TABLE IF NOT EXISTS...
[1] Starting the development server...
[1] Compiled successfully!
```

### Accessing the Application

- **Frontend (Web UI):** http://localhost:3000
- **Backend API:** http://localhost:3001
- **phpMyAdmin:** http://localhost/phpmyadmin

---

## 🎬 First Time Setup

After running the application for the first time, you need to create an admin user.

### Step 1: Register a User

**Option A: Using the Web Interface**

1. Go to: `http://localhost:3000`
2. Click **"Don't have an account? Register"**
3. Fill in the form:
   - Username: `admin`
   - Password: `admin123`
   - Full Name: `Admin User`
4. Click **Register**

**Option B: Using Postman**

```
POST http://localhost:3001/register
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "fullname": "Admin User"
}
```

### Step 2: Activate the User

Users are created as **inactive** by default. You need to activate them in the database.

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select your database (`hrms_db`)
3. Click on **SQL** tab
4. Run this query:

```sql
UPDATE users
SET active = 1, role = 'ROLE_ADMIN'
WHERE username = 'admin';
```

5. Click **"Go"**

**Verify:** Click on the `users` table and check:

- `active` should be `1`
- `role` should be `ROLE_ADMIN`

### Step 3: Login

Now you can login!

**Web Interface:**

1. Go to: `http://localhost:3000`
2. Enter:
   - Username: `admin`
   - Password: `admin123`
3. Click **Login**
4. You should see the Admin Dashboard! 🎉

---

## 🧪 Testing the API

### Quick API Tests (Postman)

#### 1. Test Connection

```
GET http://localhost:3001/api
```

Expected: `"this is the index for api"`

#### 2. Login

```
POST http://localhost:3001/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Expected: JSON with `token` field

#### 3. Get All Users (Protected)

```
GET http://localhost:3001/api/users
Authorization: Bearer YOUR_TOKEN_HERE
```

**Setting up Authorization in Postman:**

1. Copy the `token` from login response
2. In Postman → Authorization tab
3. Type: **Bearer Token**
4. Token: Paste your token
5. Send request

### Available API Endpoints

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

**See `POSTMAN_ENDPOINTS.md` for complete API documentation with request/response examples!**

---

## 🗂️ Database Tables

The application automatically creates these tables:

1. `users` - User accounts with authentication
2. `userPersonalInfos` - Personal details (address, phone, etc.)
3. `userFinancialInfos` - Financial/salary information
4. `departments` - Company departments
5. `deptAnnouncements` - Department announcements
6. `jobs` - Job positions and descriptions
7. `applications` - Leave/absence applications
8. `payments` - Payment records
9. `expenses` - Expense tracking
10. `userPersonalEvents` - Personal calendar events

View them in phpMyAdmin → Select database → See tables list

---

## 🎯 User Roles

The system has 3 user roles with different permissions:

### ROLE_ADMIN (Full Access)

- Manage all users
- Create/edit/delete departments
- Manage jobs and positions
- Approve/reject applications
- View all financial data
- Access all reports

### ROLE_MANAGER (Department Management)

- View department employees
- Approve department leave requests
- View department expenses
- Create department announcements
- Limited financial access

### ROLE_EMPLOYEE (Self-Service)

- View own profile
- Apply for leave
- View own salary details
- View department announcements
- Update personal information

---

## ❌ Troubleshooting

### Backend won't start

**Problem:** Server crashes immediately or won't start

**Solutions:**

1. Check if `.env` file exists in root directory
2. Verify `SECRET_KEY` is set in `.env`
3. Check MySQL is running (XAMPP/WAMP)
4. Verify database name matches in `.env` and phpMyAdmin
5. Check port 3001 is not in use: `netstat -ano | findstr :3001`

### Frontend "Proxy error: ECONNREFUSED"

**Problem:** Frontend can't connect to backend

**Solutions:**

1. **Make sure backend is running first!** Check `http://localhost:3001/api`
2. Backend must be running on port 3001
3. Check backend terminal for errors
4. Restart both servers

### Database connection failed

**Problem:** `SequelizeDatabaseError` or connection refused

**Solutions:**

1. Verify MySQL service is running
2. Check database name in `.env` matches actual database
3. Verify MySQL username/password in `.env`
4. Test MySQL connection in phpMyAdmin
5. Try port 3306: `telnet localhost 3306`

### "Account is not active" when logging in

**Problem:** Login fails with this message

**Solution:**
Run this in phpMyAdmin SQL tab:

```sql
UPDATE users
SET active = 1
WHERE username = 'your-username';
```

### "Access denied: Wrong access token"

**Problem:** Token validation fails

**Solutions:**

1. Check `SECRET_KEY` is set in `.env`
2. Restart backend after adding `SECRET_KEY`
3. Login again to get a new token
4. Check token hasn't expired (30 minutes by default)

### Node.js version error

**Problem:** "Error: error:0308010C:digital envelope routines::unsupported"

**Solution:**
This is already fixed in `client/package.json` with:

```json
"start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start"
```

If still having issues, use Node.js v16 LTS

### Port already in use

**Problem:** EADDRINUSE error

**Solutions:**

**Windows:**

```bash
# Find process using port 3001
netstat -ano | findstr :3001
# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**

```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```

---

## 📁 Project Structure

```
hrsytem/
├── app.js                 # Main Express application
├── bin/www               # Server startup script
├── package.json          # Backend dependencies
├── .env                  # Environment variables (CREATE THIS!)
├── config/
│   └── db.config.js      # Database configuration
├── controllers/          # Business logic
├── models/               # Sequelize models
├── routes/               # API routes
├── withAuth.js           # JWT authentication middleware
└── client/               # React frontend
    ├── package.json      # Frontend dependencies
    ├── public/           # Static files & AdminLTE theme
    └── src/
        ├── App.js        # Main React component
        ├── components/   # React components
        ├── Layout/       # Layout components
        └── withAuth.js   # Frontend auth HOC
```

---

## 🔐 Important Security Notes

### For Development:

- `.env` file is **NOT committed** to git (check `.gitignore`)
- Default passwords should be changed
- SECRET_KEY should be a long random string

### For Production:

- Use strong `SECRET_KEY` (32+ characters)
- Set strong database passwords
- Enable HTTPS
- Set `NODE_ENV=production`
- Use environment variables, not `.env` file
- Enable CORS properly
- Add rate limiting
- Update all dependencies

---

## 📚 Additional Resources

- **Full API Documentation:** See `POSTMAN_ENDPOINTS.md`
- **Original README:** See `README.md`
- **Activate User Script:** `activate-user.sql`
- **Setup Admin Script:** `setup-admin.sql`

---

## 🆘 Still Need Help?

If you're still having issues:

1. Check all prerequisites are installed
2. Verify MySQL is running
3. Confirm `.env` file is configured correctly
4. Check backend terminal for error messages
5. Test backend API directly: `http://localhost:3001/api`
6. Clear browser cache and localStorage
7. Try in incognito/private browser window

---

## ✅ Success Checklist

Before considering setup complete, verify:

- [ ] Node.js and npm installed
- [ ] MySQL/XAMPP/WAMP running
- [ ] Database `hrms_db` created
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`cd client && npm install`)
- [ ] `.env` file created with all required fields
- [ ] `SECRET_KEY` added to `.env`
- [ ] Backend starts without errors (`npm run server`)
- [ ] Frontend starts without errors (`npm run client`)
- [ ] Can access `http://localhost:3000`
- [ ] Can register a user
- [ ] User activated in database
- [ ] Can login successfully
- [ ] Redirected to dashboard after login

---

**Made with ❤️ by Mantzaris Vasileios**

**Modified and documented for easy setup**

---

## 🎉 You're All Set!

Congratulations! Your HRMS is now up and running. Enjoy managing your human resources! 🚀
