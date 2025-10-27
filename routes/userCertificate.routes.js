var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { cacheMiddleware } = require("../config/cache.config");

const userCertificate = require("../controllers/userCertificate.controller.js");

// Create a new user certificate (Admin, HR, or Employee for their own)
router.post("/", withAuth.verifyToken, userCertificate.create);

// Retrieve all user certificates (Admin, Manager, HR, or Finance)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManagerOrHROrFinance,
  cacheMiddleware(300),
  userCertificate.findAll
);

// Retrieve all certificates for a specific user (Admin, Manager, HR, Finance, or Employee for their own)
router.get(
  "/user/:userId",
  withAuth.verifyToken,
  cacheMiddleware(300),
  userCertificate.findAllByUserId
);

// Retrieve a single user certificate with id (Admin, Manager, HR, Finance, or Employee for their own)
router.get(
  "/:id",
  withAuth.verifyToken,
  cacheMiddleware(600),
  userCertificate.findOne
);

// Update a user certificate with id (Admin, HR, or Employee for their own)
router.put("/:id", withAuth.verifyToken, userCertificate.update);

// Delete a user certificate with id (Admin, HR, or Employee for their own)
router.delete("/:id", withAuth.verifyToken, userCertificate.delete);

// Delete all certificates for a specific user (Admin or HR)
router.delete(
  "/user/:userId",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrHR,
  userCertificate.deleteAllByUserId
);

module.exports = router;
