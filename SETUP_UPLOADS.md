# Upload Directory Setup

## Quick Setup

Before running the server, ensure the uploads directory exists:

### Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path uploads\job-files
New-Item -ItemType Directory -Force -Path uploads\personal-info-files
```

### Windows (Command Prompt):

```cmd
mkdir uploads\job-files
mkdir uploads\personal-info-files
```

### Linux/Mac:

```bash
mkdir -p uploads/job-files
mkdir -p uploads/personal-info-files
```

---

## Automatic Setup

The upload configuration (`config/upload.config.js`) will **automatically create** these directories when the server starts if they don't exist:

- `uploads/`
- `uploads/job-files/` - For job contracts and certificates
- `uploads/personal-info-files/` - For ID copies and personal documents

So you don't actually need to create them manually!

---

## File Access

Once files are uploaded, they can be accessed via HTTP:

### Job Files:

```
http://localhost:3002/uploads/job-files/contract-1234567890-123456789.pdf
http://localhost:3002/uploads/job-files/certificate-1234567890-987654321.pdf
```

### Personal Info Files:

```
http://localhost:3002/uploads/personal-info-files/idCopy-1234567890-123456789.pdf
```

This is configured in `app.js`:

```javascript
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

---

## Permissions

Make sure the Node.js process has write permissions to the project directory:

### Linux/Mac:

```bash
chmod 755 uploads
chmod 755 uploads/job-files
```

### Windows:

Usually no action needed - the folder inherits permissions from the parent directory.

---

## Verification

After starting the server and uploading files, verify:

1. **Directories exist:**

   ```
   hrsytem/uploads/job-files/
   hrsytem/uploads/personal-info-files/
   ```

2. **Files are created:**

   ```
   hrsytem/uploads/job-files/contract-1710123456-987654321.pdf
   hrsytem/uploads/personal-info-files/idCopy-1710123456-123456789.pdf
   ```

3. **Files are accessible:**
   ```
   http://localhost:3002/uploads/job-files/contract-1710123456-987654321.pdf
   http://localhost:3002/uploads/personal-info-files/idCopy-1710123456-123456789.pdf
   ```

---

## Production Notes

In production, consider:

1. **Using cloud storage** (AWS S3, Azure Blob, Google Cloud Storage)
2. **Setting up CDN** for faster file delivery
3. **Automated backups** of the uploads directory
4. **Proper access control** and authentication for file downloads

---

## Troubleshooting

### Problem: "Cannot create directory"

**Solution:** Make sure you have write permissions to the project folder

### Problem: "404 Not Found" when accessing files

**Solution:**

1. Check that `app.js` has the static file serving configured
2. Restart the server after configuration changes
3. Verify the file path in the database matches the actual file location

### Problem: Files disappear after server restart

**Solution:**

1. In development: This is normal if using Docker without volumes
2. In production: Use cloud storage or mount a persistent volume

---

That's it! The upload directory setup is automatic. Just start your server and begin uploading files! 🚀
