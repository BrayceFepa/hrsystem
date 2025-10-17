const db = require("./models");
const bcrypt = require("bcrypt");

// Sample data arrays
const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Christopher",
  "Karen",
  "Charles",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Mark",
  "Sandra",
  "Donald",
  "Ashley",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
];

const jobTitles = [
  "Software Engineer",
  "Senior Developer",
  "Junior Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Project Manager",
  "Product Manager",
  "UI/UX Designer",
  "Graphic Designer",
  "Marketing Manager",
  "Sales Representative",
  "HR Manager",
  "HR Specialist",
  "Accountant",
  "Financial Analyst",
  "Operations Manager",
  "Business Analyst",
  "Customer Support",
  "Technical Support",
  "Content Writer",
  "Data Analyst",
  "Network Administrator",
  "System Administrator",
  "Database Administrator",
  "Security Analyst",
];

const leaveTypes = [
  "Sick Leave with document",
  "Sick Leave without document",
  "Remote Work",
  "Annual Leave",
  "Bereavement Leave",
  "Unexcused Absence",
  "Business Leave",
];

const leaveStatuses = ["Pending", "Approved", "Rejected"];

const employmentTypes = ["Full-time", "Part-time", "Contract", "Intern"];
const employmentStatuses = ["Active", "On Leave", "Terminated"];
const contractTypes = ["Permanent", "Temporary", "Contractual"];

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Support",
  "Product Development",
];

const businessPurposes = [
  "Client Meeting",
  "Training Session",
  "Conference Attendance",
  "Site Visit",
  "Team Building",
  "Workshop",
  "Project Review",
  "Vendor Meeting",
];

const destinations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Boston",
  "Seattle",
  "Miami",
  "Atlanta",
  "Denver",
  "Portland",
  "Las Vegas",
  "Nashville",
];

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUsername(firstName, lastName, index) {
  return `${firstName.toLowerCase()}_${lastName.toLowerCase()}${index}`;
}

function generateEmail(firstName, lastName, index) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@company.com`;
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Sync database
    await db.sequelize.sync({ force: false });
    console.log("✅ Database synced\n");

    // 1. Create Departments
    console.log("📁 Creating departments...");
    const createdDepartments = [];
    for (const deptName of departments) {
      const [dept, created] = await db.department.findOrCreate({
        where: { departmentName: deptName },
        defaults: { departmentName: deptName },
      });
      createdDepartments.push(dept);
    }
    console.log(`✅ Created ${createdDepartments.length} departments\n`);

    // 2. Create Users (30 users)
    console.log("👥 Creating users...");
    const createdUsers = [];
    const hashedPassword = await bcrypt.hash("password123", 10);

    for (let i = 0; i < 30; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const username = generateUsername(firstName, lastName, i);
      const fullName = `${firstName} ${lastName}`;

      // Assign roles: 2 admins, 5 managers, 2 HR, 2 Finance, rest employees
      let role = "ROLE_EMPLOYEE";
      if (i === 0) role = "ROLE_ADMIN";
      else if (i === 1) role = "ROLE_ADMIN";
      else if (i < 7) role = "ROLE_MANAGER";
      else if (i === 7) role = "ROLE_HR";
      else if (i === 8) role = "ROLE_HR";
      else if (i === 9) role = "ROLE_FINANCE";
      else if (i === 10) role = "ROLE_FINANCE";

      const user = await db.user.create({
        username: username,
        password: hashedPassword,
        fullName: fullName,
        role: role,
        active: true,
        departmentId: getRandomElement(createdDepartments).id,
      });
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // 3. Create Jobs for each user
    console.log("💼 Creating jobs...");
    const createdJobs = [];
    for (const user of createdUsers) {
      const startDate = getRandomDate(
        new Date(2020, 0, 1),
        new Date(2023, 11, 31)
      );
      const endDate =
        Math.random() > 0.7 ? getRandomDate(startDate, new Date()) : null;

      const job = await db.job.create({
        jobTitle: getRandomElement(jobTitles),
        startDate: startDate,
        endDate: endDate,
        empType: getRandomElement(employmentTypes),
        empStatus: getRandomElement(employmentStatuses),
        contract: getRandomElement(contractTypes),
        certificate: Math.random() > 0.5 ? "Bachelor's Degree" : null,
        directSupervisor:
          getRandomElement(firstNames) + " " + getRandomElement(lastNames),
        userId: user.id,
      });
      createdJobs.push(job);
    }
    console.log(`✅ Created ${createdJobs.length} jobs\n`);

    // 4. Create Leave Balances for all users
    console.log("📊 Creating leave balances...");
    const createdBalances = [];
    for (const user of createdUsers) {
      const balance = await db.leaveBalance.create({
        userId: user.id,
        annualLeaveTotal: getRandomInt(15, 25),
        annualLeaveUsed: 0,
        annualLeaveRemaining: getRandomInt(15, 25),
        sickLeaveDays: getRandomInt(8, 12),
        year: 2024,
      });
      createdBalances.push(balance);
    }
    console.log(`✅ Created ${createdBalances.length} leave balances\n`);

    // 5. Create Leave Applications (30 applications)
    console.log("📝 Creating leave applications...");
    const createdApplications = [];
    const now = new Date();
    const oneYearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );
    const oneYearFromNow = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      now.getDate()
    );

    for (let i = 0; i < 30; i++) {
      const user = getRandomElement(createdUsers);
      const leaveType = getRandomElement(leaveTypes);
      const status = getRandomElement(leaveStatuses);

      let startDate = getRandomDate(oneYearAgo, oneYearFromNow);
      let endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + getRandomInt(1, 14)); // 1-14 days

      // Calculate number of days
      const numberOfDays =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const application = await db.application.create({
        name: user.fullName,
        positionTitle: getRandomElement(jobTitles),
        reason: `Leave request for ${leaveType.toLowerCase()}`,
        startDate: startDate,
        endDate: endDate,
        numberOfDays: numberOfDays,
        status: status,
        type: leaveType,
        approvedBy:
          status !== "Pending"
            ? getRandomElement(firstNames) + " " + getRandomElement(lastNames)
            : null,
        businessLeavePurpose:
          leaveType === "Business Leave"
            ? getRandomElement(businessPurposes)
            : null,
        businessLeaveDestination:
          leaveType === "Business Leave"
            ? getRandomElement(destinations)
            : null,
        deductedFromBalance:
          (leaveType === "Annual Leave" ||
            leaveType === "Sick Leave without document") &&
          status === "Approved",
        userId: user.id,
      });
      createdApplications.push(application);
    }
    console.log(
      `✅ Created ${createdApplications.length} leave applications\n`
    );

    // 6. Update leave balances based on approved applications
    console.log("🔄 Updating leave balances based on approved applications...");
    let updatedCount = 0;
    for (const app of createdApplications) {
      if (app.deductedFromBalance && app.status === "Approved") {
        const balance = await db.leaveBalance.findOne({
          where: { userId: app.userId },
        });
        if (balance && balance.annualLeaveRemaining >= app.numberOfDays) {
          await balance.update({
            annualLeaveUsed: balance.annualLeaveUsed + app.numberOfDays,
            annualLeaveRemaining:
              balance.annualLeaveRemaining - app.numberOfDays,
          });
          updatedCount++;
        }
      }
    }
    console.log(`✅ Updated ${updatedCount} leave balances\n`);

    // Summary
    console.log("=".repeat(50));
    console.log("📊 SEEDING SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Departments: ${createdDepartments.length}`);
    console.log(`✅ Users: ${createdUsers.length}`);
    console.log(
      `   - Admins: ${
        createdUsers.filter((u) => u.role === "ROLE_ADMIN").length
      }`
    );
    console.log(
      `   - Managers: ${
        createdUsers.filter((u) => u.role === "ROLE_MANAGER").length
      }`
    );
    console.log(
      `   - HR: ${createdUsers.filter((u) => u.role === "ROLE_HR").length}`
    );
    console.log(
      `   - Finance: ${
        createdUsers.filter((u) => u.role === "ROLE_FINANCE").length
      }`
    );
    console.log(
      `   - Employees: ${
        createdUsers.filter((u) => u.role === "ROLE_EMPLOYEE").length
      }`
    );
    console.log(`✅ Jobs: ${createdJobs.length}`);
    console.log(`✅ Leave Balances: ${createdBalances.length}`);
    console.log(`✅ Leave Applications: ${createdApplications.length}`);
    console.log(
      `   - Pending: ${
        createdApplications.filter((a) => a.status === "Pending").length
      }`
    );
    console.log(
      `   - Approved: ${
        createdApplications.filter((a) => a.status === "Approved").length
      }`
    );
    console.log(
      `   - Rejected: ${
        createdApplications.filter((a) => a.status === "Rejected").length
      }`
    );
    console.log("=".repeat(50));
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Login credentials for testing:");
    console.log("   Username: Any username from the list below");
    console.log("   Password: password123");
    console.log("\n👤 Sample usernames:");
    for (let i = 0; i < Math.min(10, createdUsers.length); i++) {
      console.log(`   - ${createdUsers[i].username} (${createdUsers[i].role})`);
    }
    console.log("\n");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await db.sequelize.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log("✅ Seeding process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding process failed:", error);
    process.exit(1);
  });
