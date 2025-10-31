const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = "./uploads";
const jobFilesDir = "./uploads/job-files";
const personalInfoFilesDir = "./uploads/personal-info-files";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(jobFilesDir)) {
  fs.mkdirSync(jobFilesDir, { recursive: true });
}

if (!fs.existsSync(personalInfoFilesDir)) {
  fs.mkdirSync(personalInfoFilesDir, { recursive: true });
}

// Configure storage for job files
const jobStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, jobFilesDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: fieldname-timestamp-randomstring.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Configure storage for personal info files
const personalInfoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, personalInfoFilesDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: fieldname-timestamp-randomstring.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter - only allow PDF and image files
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed."
      )
    );
  }
};

// Configure multer for job files
const uploadJob = multer({
  storage: jobStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: fileFilter,
});

// Configure multer for personal info files
const uploadPersonalInfo = multer({
  storage: personalInfoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: fileFilter,
});

// Multer middleware for job files (contract and certificate)
const uploadJobFiles = uploadJob.fields([
  { name: "contract", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]);

// Multer middleware for personal info files (idCopy and guarantorSignature)
const uploadPersonalInfoFiles = uploadPersonalInfo.fields([
  { name: "idCopy", maxCount: 1 },
  { name: "guarantorSignature", maxCount: 1 },
]);

module.exports = {
  uploadJob,
  uploadPersonalInfo,
  uploadJobFiles,
  uploadPersonalInfoFiles,
};
