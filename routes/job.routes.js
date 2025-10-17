var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { uploadJobFiles } = require("../config/upload.config");
const { cacheMiddleware } = require("../config/cache.config");

const job = require("../controllers/job.controller.js");

// Create a new Job (Admin or HR)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrHR,
  uploadJobFiles,
  job.create
);

//Retrieve all Jobs (Admin, Manager, or HR)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManagerOrHR,
  cacheMiddleware(300),
  job.findAll
);

//Retrieve all Jobs by User Id (Admin, Manager, or HR)
router.get(
  "/user/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManagerOrHR,
  cacheMiddleware(300),
  job.findAllByUserId
);

//Retrieve a single Job with an id (with 10 minute cache)
router.get("/:id", withAuth.verifyToken, cacheMiddleware(600), job.findOne);

// Update a Job with an id (Admin or HR)
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrHR,
  job.update
);

// Delete a Job with an id (Admin only)
router.delete("/:id", withAuth.verifyToken, withAuth.withRoleAdmin, job.delete);

// Delete all Jobs (Admin only)
router.delete("/", withAuth.verifyToken, withAuth.withRoleAdmin, job.deleteAll);

// Delete all Jobs by User Id (Admin only)
router.delete(
  "/user/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  job.deleteAllByUserId
);

module.exports = router;
