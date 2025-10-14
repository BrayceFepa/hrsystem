var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { uploadJobFiles } = require("../config/upload.config");
const { cacheMiddleware } = require("../config/cache.config");

const job = require("../controllers/job.controller.js");

// Create a new Job (with file uploads)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  uploadJobFiles,
  job.create
);

//Retrieve all Jobs (with 5 minute cache)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManager,
  cacheMiddleware(300),
  job.findAll
);

//Retrieve all Jobs by User Id (with 5 minute cache)
router.get(
  "/user/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManager,
  cacheMiddleware(300),
  job.findAllByUserId
);

//Retrieve a single Job with an id (with 10 minute cache)
router.get("/:id", withAuth.verifyToken, cacheMiddleware(600), job.findOne);

// Update a Job with an id
router.put("/:id", withAuth.verifyToken, withAuth.withRoleAdmin, job.update);

// Delete a Job with an id
router.delete("/:id", withAuth.verifyToken, withAuth.withRoleAdmin, job.delete);

// Delete all Jobs
router.delete("/", withAuth.verifyToken, withAuth.withRoleAdmin, job.deleteAll);

// Delete all Jobs by User Id
router.delete(
  "/user/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  job.deleteAllByUserId
);

module.exports = router;
