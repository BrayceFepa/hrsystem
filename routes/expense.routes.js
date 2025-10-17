var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");

const expense = require("../controllers/expense.controller.js");

// Create a new Expense (Admin OR Finance)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  expense.create
);

//Retrieve all Expenses (Admin OR Finance)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  expense.findAll
);

// Retrieve Expenses By Year (Admin OR Finance)
router.get(
  "/year/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  expense.findAllByYear
);

// Retrieve Expenses By Year and Department (Admin OR Finance)
router.get(
  "/year/:id/department/:id2",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  expense.findAllByYearAndDept
);

//Retrieve all Expenses by Department Id (Admin OR Finance)
router.get(
  "/department/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  expense.findAllByDeptId
);

//Retrieve a single Expense with an id (Admin OR Finance)
router.get(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  expense.findOne
);

// Update an Expense with an id (Admin OR Finance)
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  expense.update
);

// Delete all Expenses (Admin only)
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  expense.deleteAll
);

// Delete an Expense with an id (Admin only)
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  expense.delete
);

// Delete all Expenses by Department Id (Admin only)
router.delete(
  "/department/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  expense.deleteAllByDeptId
);

module.exports = router;
