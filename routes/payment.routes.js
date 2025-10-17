var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");

const payment = require("../controllers/payment.controller.js");

// Create a new Payment (Admin OR Finance)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  payment.create
);

// Retrieve all Payments (Admin OR Finance)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  payment.findAll
);

// Retrieve Expenses By Year (Admin OR Finance)
router.get(
  "/year/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  payment.findAllByYear
);

//Retrieve all Payments by Job Id (Admin OR Finance)
router.get(
  "/job/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  payment.findAllByJobId
);

// Retrieve payments by user (Admin OR Finance)
router.get(
  "/user/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  payment.findAllByUser
);

//Retrieve a single Payment with an id (Admin OR Finance)
router.get(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  payment.findOne
);

// Update a Payment with an id (Admin OR Finance)
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  payment.update
);

// Delete a Payment with an id (Admin only)
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  payment.delete
);

// Delete all Payments (Admin only)
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  payment.deleteAll
);

// Delete all Payments by Job Id (Admin only)
router.delete(
  "/job/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  payment.deleteAllByOrgId
);

module.exports = router;
