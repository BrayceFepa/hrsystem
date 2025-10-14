# Personal Information Endpoint Enhancement

## Overview

Enhanced the personal information creation endpoint to support emergency contact details and ID document upload.

---

## What Was Changed

### 1. Database Model (`models/userPersonalInfo.model.js`)

**Added New Fields:**

```javascript
{
  emergencyContact: STRING,  // Emergency contact details (name, phone, relationship)
  idCopy: STRING            // File path to ID document (passport, driver's license, etc.)
}
```

**All new fields are optional** and can be null.

---

### 2. File Upload Configuration (`config/upload.config.js`)

**Enhanced with Personal Info File Handling:**

- **New storage location:** `uploads/personal-info-files/`
- **New middleware:** `uploadPersonalInfoFiles`
- **Allowed file types:** JPEG, JPG, PNG, GIF, PDF
- **File size limit:** 5MB per file
- **Automatic directory creation**

**Key Functions:**

```javascript
uploadPersonalInfoFiles - Middleware for handling idCopy upload
```

---

### 3. Controller Updates (`controllers/userPersonalInformation.controller.js`)

**Updated `create()` method:**

```javascript
const userPersonalInformation = {
  dateOfBirth: req.body.dateOfBirth || null,
  gender: req.body.gender || null,
  maritalStatus: req.body.maritalStatus || null,
  fatherName: req.body.fatherName || null,
  idNumber: req.body.idNumber || null,
  address: req.body.address || null,
  city: req.body.city || null,
  country: req.body.country || null,
  mobile: req.body.mobile || null,
  phone: req.body.phone || null,
  emailAddress: req.body.emailAddress || null,
  emergencyContact: req.body.emergencyContact || null, // NEW
  idCopy: req.files?.idCopy?.[0].path || null, // NEW - File upload
  userId: req.body.userId,
};
```

**Added cache clearing:**

- `create()` - Clears `/api/personalInformations` cache
- `update()` - Clears `/api/personalInformations` cache
- `delete()` - Clears `/api/personalInformations` cache
- `deleteAll()` - Clears `/api/personalInformations` cache

---

### 4. Routes Updates (`routes/userPersonalInformation.routes.js`)

**Added file upload middleware:**

```javascript
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  uploadPersonalInfoFiles, // NEW: File upload middleware
  personalInformation.create
);
```

**Added caching middleware for GET requests:**

- `GET /api/personalInformations/user/:id` - 5 minute cache (300s)
- `GET /api/personalInformations/:id` - 10 minute cache (600s)

---

### 5. API Documentation (`API.md`)

**Comprehensive documentation added:**

- Request format for multipart/form-data
- All field specifications with types
- Example Postman request format
- File upload specifications
- Error responses for invalid files
- Success response with file path

---

## New API Request Format

### Before (JSON):

```json
POST /api/personalInformations
Content-Type: application/json

{
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "mobile": "+1234567890",
  "emailAddress": "john@example.com",
  "userId": 1
}
```

### After (Form Data):

```
POST /api/personalInformations
Content-Type: multipart/form-data

dateOfBirth: 1990-01-15
gender: Male
maritalStatus: Single
fatherName: Robert Doe
idNumber: 123456789
address: 123 Main St
city: New York
country: USA
mobile: +1234567890
phone: +0987654321
emailAddress: john@example.com
emergencyContact: Jane Doe - +1987654321 (Sister)   ✨ NEW
idCopy: [FILE: id_document.pdf]                      ✨ NEW
userId: 1
```

---

## Example Usage

### Using Postman:

1. **Select:** POST request to `http://localhost:3002/api/personalInformations`
2. **Authorization:** Add Bearer token (Admin user)
3. **Body:** Select "form-data"
4. **Add fields:**

| Key              | Type | Value                  |
| ---------------- | ---- | ---------------------- |
| dateOfBirth      | text | 1990-01-15             |
| gender           | text | Male                   |
| maritalStatus    | text | Single                 |
| idNumber         | text | 123456789              |
| address          | text | 123 Main St            |
| city             | text | New York               |
| mobile           | text | +1234567890            |
| emailAddress     | text | john@example.com       |
| emergencyContact | text | Jane Doe - +1987654321 |
| idCopy           | file | id_document.pdf        |
| userId           | text | 1                      |

### Using cURL:

```bash
curl -X POST http://localhost:3002/api/personalInformations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "dateOfBirth=1990-01-15" \
  -F "gender=Male" \
  -F "maritalStatus=Single" \
  -F "mobile=+1234567890" \
  -F "emailAddress=john@example.com" \
  -F "emergencyContact=Jane Doe - +1987654321" \
  -F "idCopy=@/path/to/id_document.pdf" \
  -F "userId=1"
```

### Using JavaScript (FormData):

```javascript
const formData = new FormData();
formData.append("dateOfBirth", "1990-01-15");
formData.append("gender", "Male");
formData.append("maritalStatus", "Single");
formData.append("mobile", "+1234567890");
formData.append("emailAddress", "john@example.com");
formData.append("emergencyContact", "Jane Doe - +1987654321");
formData.append("idCopy", idCopyFile); // File object
formData.append("userId", "1");

fetch("http://localhost:3002/api/personalInformations", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

---

## File Storage

### Directory Structure:

```
hrsytem/
├── uploads/
│   ├── job-files/
│   │   ├── contract-*.pdf
│   │   └── certificate-*.pdf
│   └── personal-info-files/
│       └── idCopy-1234567890-123456789.pdf
```

### Database Storage:

The ID copy file path is stored in the database:

```json
{
  "idCopy": "uploads/personal-info-files/idCopy-1234567890-123456789.pdf"
}
```

---

## Use Cases for Emergency Contact

The `emergencyContact` field is flexible and can store various formats:

**Example Formats:**

```
Jane Doe - +1987654321 (Sister)
Emergency: John Smith, +44 20 7123 4567, Brother
Contact: Mary Johnson | +1-555-0100 | Spouse
Parent - Robert Doe - 555-1234
```

**Recommended Format:**

```
Name - Phone Number (Relationship)
```

Example: `Jane Doe - +1987654321 (Sister)`

---

## Validation & Security

### File Type Validation:

- Only allows: JPEG, JPG, PNG, GIF, PDF
- Rejects all other file types with error message

### File Size Validation:

- Maximum 5MB per file
- Larger files are rejected with error message

### Security Features:

- Files are renamed with timestamp and random number
- Original filenames are not preserved
- File validation before storage
- Uploaded files are in `.gitignore` (not committed to repo)
- Admin-only access for creation

---

## Error Handling

### Invalid File Type:

```json
{
  "message": "Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed."
}
```

### File Too Large:

```json
{
  "message": "File too large. Maximum file size is 5MB."
}
```

### Duplicate Personal Information:

```json
{
  "message": "Personal Information already exists for this User"
}
```

---

## Testing Checklist

- [ ] Create personal info without idCopy file
- [ ] Create personal info with idCopy file
- [ ] Upload PDF as idCopy
- [ ] Upload image (JPEG, PNG, GIF) as idCopy
- [ ] Try uploading invalid file type (should fail)
- [ ] Try uploading file > 5MB (should fail)
- [ ] Verify file is saved in `uploads/personal-info-files/`
- [ ] Verify file path is stored in database
- [ ] Verify cache is cleared after create/update/delete
- [ ] Test emergencyContact field with various formats
- [ ] Access uploaded idCopy via HTTP URL
- [ ] Verify backward compatibility (without new fields)

---

## Backward Compatibility

✅ **Fully backward compatible**

- Old requests without new fields still work
- All new fields are optional
- Existing personal info records won't break
- No breaking changes

---

## Database Migration

When you restart the server with `db.sequelize.sync({ alter: true })`, Sequelize will automatically:

1. Add `emergencyContact` column to `user_personal_info` table
2. Add `idCopy` column to `user_personal_info` table
3. Set both new columns as nullable
4. Preserve existing data
5. No manual SQL migration needed

---

## File Access

### Accessing Uploaded ID Documents:

**Via HTTP:**

```
http://localhost:3002/uploads/personal-info-files/idCopy-1234567890-123456789.pdf
```

**From Database:**

```javascript
// Query personal info
const personalInfo = await UserPersonalInfo.findOne({ where: { userId: 1 } });

// Get file path
const idCopyPath = personalInfo.idCopy;
// "uploads/personal-info-files/idCopy-1234567890-123456789.pdf"

// Construct URL
const fileUrl = `http://localhost:3002/${idCopyPath}`;
```

---

## Summary

✅ **Added 2 new optional fields** to personal information model  
✅ **File upload support** for ID documents  
✅ **Security validation** for file types and sizes  
✅ **Cache invalidation** on data changes  
✅ **Comprehensive documentation** in API.md  
✅ **Backward compatible** with existing code  
✅ **Production-ready** architecture

---

## Related Documentation

- **API Documentation:** See `API.md` - Personal Information section
- **Job Enhancement:** See `JOB_ENDPOINT_ENHANCEMENT.md`
- **Upload Setup:** See `SETUP_UPLOADS.md`
- **General Improvements:** See `IMPROVEMENTS_SUMMARY.md`

---

**Implementation Date:** March 2024  
**Status:** ✅ Complete and Ready for Testing
