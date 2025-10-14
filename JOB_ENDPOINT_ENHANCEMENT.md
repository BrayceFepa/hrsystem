# Job Endpoint Enhancement Summary

## Overview

Enhanced the job creation endpoint to support additional employment fields and file uploads for contracts and certificates.

---

## What Was Changed

### 1. Database Model (`models/job.model.js`)

**Added New Fields:**

```javascript
{
  empType: STRING,           // Employment type (Full-Time, Part-Time, Contract, etc.)
  empStatus: STRING,         // Employment status (Active, On Leave, Terminated, etc.)
  contract: STRING,          // File path to contract document
  certificate: STRING,       // File path to certificate document
  directSupervisor: STRING,  // Direct supervisor name/ID
  endDate: STRING (nullable) // Changed from required to optional
}
```

**All new fields are optional** and can be null.

---

### 2. File Upload Configuration (`config/upload.config.js`)

**New File Created** with the following features:

- **Multer configuration** for handling multipart/form-data
- **Storage location:** `uploads/job-files/`
- **Allowed file types:** JPEG, JPG, PNG, GIF, PDF
- **File size limit:** 5MB per file
- **Automatic filename generation:** `fieldname-timestamp-randomnumber.extension`
- **File validation** with error messages for invalid types/sizes

**Key Functions:**

```javascript
uploadJobFiles - Middleware for handling contract and certificate uploads
```

---

### 3. Controller Updates (`controllers/job.controller.js`)

**Updated `create()` method:**

```javascript
const newJob = {
  jobTitle: req.body.jobTitle, // Required
  startDate: req.body.startDate, // Required
  endDate: req.body.endDate || null, // Optional
  empType: req.body.empType || null, // Optional
  empStatus: req.body.empStatus || null, // Optional
  directSupervisor: req.body.directSupervisor || null, // Optional
  contract: req.files?.contract?.[0].path || null, // Optional file
  certificate: req.files?.certificate?.[0].path || null, // Optional file
  userId: req.body.userId, // Required
};
```

**Added cache clearing:**

- `create()` - Clears `/api/jobs` cache after creating a job
- `update()` - Clears `/api/jobs` cache after updating a job
- `delete()` - Clears `/api/jobs` cache after deleting a job
- `deleteAll()` - Clears `/api/jobs` cache after bulk delete
- `deleteAllByUserId()` - Clears `/api/jobs` cache after user jobs delete

---

### 4. Routes Updates (`routes/job.routes.js`)

**Added file upload middleware:**

```javascript
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  uploadJobFiles, // NEW: File upload middleware
  job.create
);
```

**Added caching middleware for GET requests:**

- `GET /api/jobs` - 5 minute cache (300s)
- `GET /api/jobs/user/:id` - 5 minute cache (300s)
- `GET /api/jobs/:id` - 10 minute cache (600s)

---

### 5. API Documentation (`API.md`)

**Comprehensive documentation added:**

- Request format for multipart/form-data
- All field specifications with types and optional/required indicators
- Example Postman request
- File upload specifications
- Error responses for invalid files
- Success response with file paths

---

### 6. Git Configuration (`.gitignore`)

**Added to .gitignore:**

```
# Uploaded files
uploads/
```

This prevents uploaded files from being committed to the repository.

---

## New API Request Format

### Before (JSON):

```json
POST /api/jobs
Content-Type: application/json

{
  "jobTitle": "Software Engineer",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "userId": 1
}
```

### After (Form Data):

```
POST /api/jobs
Content-Type: multipart/form-data

jobTitle: Software Engineer
startDate: 2024-01-01
endDate: 2024-12-31
empType: Full-Time
empStatus: Active
directSupervisor: John Smith
contract: [FILE: employment_contract.pdf]
certificate: [FILE: certificate_of_employment.pdf]
userId: 1
```

---

## Example Usage

### Using Postman:

1. **Select:** POST request to `http://localhost:3002/api/jobs`
2. **Authorization:** Add Bearer token
3. **Body:** Select "form-data"
4. **Add fields:**

| Key              | Type | Value                   |
| ---------------- | ---- | ----------------------- |
| jobTitle         | text | Software Engineer       |
| startDate        | text | 2024-01-01              |
| endDate          | text | 2024-12-31              |
| empType          | text | Full-Time               |
| empStatus        | text | Active                  |
| directSupervisor | text | John Smith              |
| contract         | file | employment_contract.pdf |
| certificate      | file | certificate.pdf         |
| userId           | text | 1                       |

### Using cURL:

```bash
curl -X POST http://localhost:3002/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "jobTitle=Software Engineer" \
  -F "startDate=2024-01-01" \
  -F "endDate=2024-12-31" \
  -F "empType=Full-Time" \
  -F "empStatus=Active" \
  -F "directSupervisor=John Smith" \
  -F "contract=@/path/to/contract.pdf" \
  -F "certificate=@/path/to/certificate.pdf" \
  -F "userId=1"
```

### Using JavaScript (FormData):

```javascript
const formData = new FormData();
formData.append("jobTitle", "Software Engineer");
formData.append("startDate", "2024-01-01");
formData.append("endDate", "2024-12-31");
formData.append("empType", "Full-Time");
formData.append("empStatus", "Active");
formData.append("directSupervisor", "John Smith");
formData.append("contract", contractFile); // File object
formData.append("certificate", certificateFile); // File object
formData.append("userId", "1");

fetch("http://localhost:3002/api/jobs", {
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
│   └── job-files/
│       ├── contract-1234567890-123456789.pdf
│       ├── certificate-1234567890-987654321.pdf
│       └── ...
```

### Database Storage:

Files are stored as **paths** in the database:

```json
{
  "contract": "uploads/job-files/contract-1234567890-123456789.pdf",
  "certificate": "uploads/job-files/certificate-1234567890-987654321.pdf"
}
```

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
- Original filenames are not preserved (prevents path traversal attacks)
- File validation before storage
- Uploaded files are in `.gitignore` (not committed to repo)

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

### Missing Required Fields:

```json
{
  "message": "Content can not be empty!"
}
```

---

## Production Considerations

### Current Implementation (Local Storage):

- ✅ Simple to implement
- ✅ Works for small teams
- ❌ Not scalable for large deployments
- ❌ Files are lost on server restart/redeploy
- ❌ No redundancy/backup

### Recommended for Production:

**Option 1: Cloud Storage (AWS S3)**

- Use `multer-s3` package
- Automatic backups and redundancy
- CDN integration for fast delivery
- Scalable and reliable

**Option 2: Cloud Storage (Azure Blob)**

- Use `multer-azure-storage` package
- Integration with Azure services
- Enterprise-grade security

**Option 3: Keep Local Storage**

- Mount external volume/NAS
- Set up automated backups
- Use load balancer sticky sessions

---

## Migration Steps for Production

### If deploying to production:

1. **Create uploads directory on server:**

   ```bash
   mkdir -p uploads/job-files
   chmod 755 uploads
   chmod 755 uploads/job-files
   ```

2. **Set up file serving (in `app.js`):**

   ```javascript
   // Serve uploaded files statically
   app.use("/uploads", express.static("uploads"));
   ```

3. **Configure cloud storage (optional but recommended):**

   ```javascript
   // Example for AWS S3
   const multerS3 = require("multer-s3");
   const s3 = new AWS.S3();

   const storage = multerS3({
     s3: s3,
     bucket: "your-bucket-name",
     acl: "private",
     key: function (req, file, cb) {
       cb(null, `job-files/${Date.now()}-${file.originalname}`);
     },
   });
   ```

---

## Testing Checklist

- [ ] Create job without files
- [ ] Create job with only contract
- [ ] Create job with only certificate
- [ ] Create job with both files
- [ ] Upload PDF file
- [ ] Upload image file (JPEG, PNG, GIF)
- [ ] Try uploading invalid file type (should fail)
- [ ] Try uploading file > 5MB (should fail)
- [ ] Verify files are saved in `uploads/job-files/`
- [ ] Verify file paths are stored in database
- [ ] Verify cache is cleared after create/update/delete
- [ ] Test with all optional fields filled
- [ ] Test with minimal required fields only

---

## Backward Compatibility

✅ **Fully backward compatible**

- Old requests without new fields still work
- All new fields are optional
- Existing jobs in database won't break
- `endDate` is now optional (can be null)

---

## Database Migration

When you restart the server with `db.sequelize.sync({ alter: true })`, Sequelize will automatically:

1. Add new columns to the `job` table
2. Set all new columns as nullable
3. Preserve existing data
4. No manual SQL migration needed

---

## Summary

✅ **Added 5 new optional fields** to job model  
✅ **File upload support** for contracts and certificates  
✅ **Security validation** for file types and sizes  
✅ **Cache invalidation** on data changes  
✅ **Comprehensive documentation** in API.md  
✅ **Backward compatible** with existing code  
✅ **Production-ready** with cloud storage path

---

**Last Updated:** March 2024

**Status:** ✅ Complete and Ready for Testing
