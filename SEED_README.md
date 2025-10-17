# Database Seeding Guide

## Overview

The `seed.js` script populates your database with realistic sample data for testing and development purposes.

## What Gets Created

- **8 Departments**: Engineering, Marketing, Sales, HR, Finance, Operations, Customer Support, Product Development
- **30 Users**:
  - 2 Admins
  - 5 Managers
  - 23 Employees
- **30 Jobs**: One job record per user with realistic employment details
- **30 Leave Balances**: Initial leave balances for all users
- **30 Leave Applications**: Mix of pending, approved, and rejected applications with various leave types
- **Leave Balance Updates**: Approved applications automatically deduct from annual leave

## Prerequisites

Make sure you have:

- Node.js installed
- Database configured and accessible
- All dependencies installed (`npm install`)

## How to Run

### Option 1: Run directly with Node

```bash
node seed.js
```

### Option 2: Add to package.json (Recommended)

Add this script to your `package.json`:

```json
"scripts": {
  "seed": "node seed.js"
}
```

Then run:

```bash
npm run seed
```

## Default Login Credentials

All users are created with the same password for easy testing:

- **Password**: `password123`
- **Usernames**: Generated from first and last names (e.g., `james_smith0`, `mary_johnson1`)

## Sample Users

After running the seed script, you'll see a list of sample usernames in the console output. Examples:

- `james_smith0` (ROLE_ADMIN)
- `mary_johnson1` (ROLE_ADMIN)
- `john_williams2` (ROLE_MANAGER)
- `patricia_brown3` (ROLE_MANAGER)
- ... and 26 more

## What the Script Does

1. **Syncs Database**: Ensures all tables exist
2. **Creates Departments**: 8 departments with unique names
3. **Creates Users**: 30 users with random names, assigned to departments
4. **Creates Jobs**: Each user gets a job with realistic employment details
5. **Creates Leave Balances**: Initial annual and sick leave allocations
6. **Creates Applications**: 30 leave requests with various types and statuses
7. **Updates Balances**: Approved annual/sick leave requests deduct from balances
8. **Shows Summary**: Displays counts of all created records

## Data Characteristics

### Leave Applications

- **Types**: Sick Leave (with/without document), Remote Work, Annual Leave, Bereavement, Unexcused Absence, Business Leave
- **Statuses**: Pending, Approved, Rejected
- **Duration**: 1-14 days
- **Date Range**: Applications span from 1 year ago to 1 year in the future
- **Business Leave**: Includes realistic purposes and destinations

### Employment Details

- **Types**: Full-time, Part-time, Contract, Intern
- **Statuses**: Active, On Leave, Terminated
- **Contracts**: Permanent, Temporary, Contractual
- **Job Titles**: 28 realistic titles (Software Engineer, HR Manager, etc.)

## Safety Features

- **Non-destructive**: Uses `findOrCreate` for departments to avoid duplicates
- **Realistic Data**: All data follows your database schema and constraints
- **Proper Relationships**: Foreign keys and associations are maintained
- **Error Handling**: Comprehensive try-catch with detailed error messages

## Customization

You can easily customize the script by modifying the arrays at the top:

```javascript
// Add more names
const firstNames = ["James", "Mary", "YourName", ...];

// Add more job titles
const jobTitles = ["Software Engineer", "YourTitle", ...];

// Change quantities
for (let i = 0; i < 30; i++) { // Change 30 to any number
```

## Troubleshooting

### Error: "Cannot find module 'bcrypt'"

```bash
npm install bcrypt
```

### Error: "Access denied for user"

- Check your database credentials in `config/db.config.js`
- Ensure MySQL/MariaDB is running

### Error: "Table doesn't exist"

- Make sure you've run the app at least once to create tables
- Or run: `db.sequelize.sync({ force: true })` first (⚠️ WARNING: This deletes all data)

### Port already in use

- The seeding script doesn't start a server, so this shouldn't occur
- If it does, check for zombie Node processes

## Resetting the Database

If you want to start fresh:

1. **Option 1**: Delete all data manually from database
2. **Option 2**: Modify `seed.js` to use `{ force: true }`:
   ```javascript
   await db.sequelize.sync({ force: true }); // ⚠️ Deletes all data!
   ```

## Production Warning

⚠️ **DO NOT run this script in production!**

This script is for development and testing only. It creates predictable passwords and sample data.

## Next Steps

After seeding:

1. Test login with any generated username
2. Test pagination with the applications endpoint
3. Test filtering by status, type, and date
4. Test leave balance deductions
5. Test approval/rejection workflows

## Support

If you encounter issues:

1. Check the console output for specific errors
2. Verify database connectivity
3. Ensure all models are properly defined
4. Check that all required fields are being populated

---

Happy Testing! 🎉
