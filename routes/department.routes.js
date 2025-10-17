var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { cacheMiddleware } = require("../config/cache.config");

const department = require("../controllers/department.controller.js");

// Create a new Department (Admin or HR)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrHR,
  department.create
);

//Retrieve all Departments (Admin, Manager, or HR)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManagerOrHR,
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

// Update a Department with an id (Admin, Manager, or HR)
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManagerOrHR,
  department.update
);

// Delete a Department with an id (Admin only)
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  department.delete
);

// Delete all Departments (Admin only)
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  department.deleteAll
);

module.exports = router;
