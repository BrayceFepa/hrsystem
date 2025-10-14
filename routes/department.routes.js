var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { cacheMiddleware } = require("../config/cache.config");

const department = require("../controllers/department.controller.js");

// Create a new Department
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  department.create
);

//Retrieve all Departments (with 5 minute cache)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManager,
  cacheMiddleware(300),
  department.findAll
);

//Retrieve a single Department with an id (with 10 minute cache)
router.get(
  "/:id",
  withAuth.verifyToken,
  cacheMiddleware(600),
  department.findOne
);

// Update a Department with an id
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManager,
  department.update
);

// Delete a Department with an id
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  department.delete
);

// Delete all Departments
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  department.deleteAll
);

module.exports = router;
