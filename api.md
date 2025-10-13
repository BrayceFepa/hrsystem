1. Create User (POST /api/users)
<!-- {
  username: "string (required)",
  password: 1234, // Default password
  fullname: "string (combined first and last name)",
  role: "string (required)",
  departmentId: "number (required)",
  active: 1,
  emergencyContact: "string"
} -->
2. Create Personal Information (POST /api/personalInformations)
<!-- {
  dateOfBirth: "date",
  gender: "string",
  maritalStatus: "string",
  fatherName: "string",
  idNumber: "string",
  address: "string",
  city: "string",
  country: "string",
  mobile: "string",
  phone: "string",
  emailAddress: "string (email format)",
  userId: "number (auto-assigned from user creation)"
} -->
3. Create Financial Information (POST /api/financialInformations)
<!-- {
  bankName: "string",
  accountName: "string",
  accountNumber: "string",
  iban: "string",
  userId: "number (auto-assigned from user creation)"
} -->
4. Create Job (POST /api/jobs)
<!-- {
  jobTitle: "string (required)",
  startDate: "date (required)",
  endDate: "date",
  userId: "number (auto-assigned from user creation)"
}
