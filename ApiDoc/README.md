# HR System API Documentation

Welcome to the HR System API Documentation. This documentation is organized by module for easier navigation.

---

## 📚 Documentation Modules

### Core Modules

1. **[Authentication](./AuthDoc.md)** - Login, Registration, and Token Management
2. **[Users](./UsersDoc.md)** - User and Employee Management (20KB)
3. **[Departments](./DepartmentsDoc.md)** - Department and Organization Management
4. **[Jobs](./JobsDoc.md)** - Employment and Job Management (6KB)
5. **[Leave Applications](./LeaveApplicationsDoc.md)** - Leave Management and Applications (12KB)

### Financial Modules

6. **[Payments](./PaymentsDoc.md)** - Payment and Financial Records
7. **[Expenses](./ExpensesDoc.md)** - Expense and Budget Management
8. **[Financial Information](./FinancialInfoDoc.md)** - Financial Information and Banking (6KB)
9. **[Salary History](./SalaryHistoryDoc.md)** - Salary History and Management (6KB)

### Communication & Profile Modules

10. **[Announcements](./AnnouncementsDoc.md)** - Department Announcements and Communications
11. **[Personal Information](./PersonalInfoDoc.md)** - Personal Information and Profiles (6KB)
12. **[Personal Events](./PersonalEventsDoc.md)** - Personal Calendar Events
13. **[User Certificates](./UserCertificatesDoc.md)** - User Certificates and Documents (5KB)

### Reference

14. **[Common Reference](./CommonReference.md)** - Common Information, Enums, and General Notes (5KB)

---

## 🚀 Quick Start

1. **Authentication** - Start with [AuthDoc.md](./AuthDoc.md) to understand login and token management
2. **Creating Users** - Follow [UsersDoc.md](./UsersDoc.md) to create employees
3. **Additional Resources** - Check [CommonReference.md](./CommonReference.md) for enums, data types, and general notes

---

## 📋 General Information

- **Backend Port:** 3002 (default, configurable via `process.env.PORT`)
- **Database:** MySQL
- **ORM:** Sequelize v5.21.8
- **Authentication:** JWT (jsonwebtoken) with bcrypt password hashing
- **Token Expiration:** 1 year
- **Monetary Values:** All stored as integers (no decimals)

---

## 📝 Additional Resources

- **Quick Start Guide:** See `QUICK_START.md`
- **Original README:** See `README.md`
- **Setup Scripts:** `activate-user.sql`, `setup-admin.sql`
- **Seed Data:** `seed.js`

---

**Last Updated:** January 2025  
**API Version:** 1.0.0
