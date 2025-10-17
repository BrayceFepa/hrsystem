var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");

const leaveBalance = require("../controllers/leaveBalance.controller.js");

// Initialize leave balance for a user (Admin or HR)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrHR,
  leaveBalance.initialize
);

// Retrieve leave balance for a specific user
router.get("/user/:userId", withAuth.verifyToken, leaveBalance.findByUserId);

// Retrieve all leave balances (Admin or HR)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrHR,
  leaveBalance.findAll
);

// Update leave balance for a user (Admin or HR)
router.put(
  "/user/:userId",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrHR,
  leaveBalance.update
);

// Reset all leave balances for a new year (Admin only)
router.post(
  "/reset",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  leaveBalance.resetAll
);

module.exports = router;
