var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { cacheMiddleware } = require("../config/cache.config");

const financialInformation = require("../controllers/userFinancialInformation.controller");

// Create a new User Financial Information (Admin OR Finance)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  financialInformation.create
);

// Retrieve all User Financial Information (Admin OR Finance)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  cacheMiddleware(300),
  financialInformation.findAll
);

// Retrieve User Financial Information by User Id (Admin OR Finance OR Employee for own data)
router.get(
  "/user/:id",
  withAuth.verifyToken,
  cacheMiddleware(300),
  financialInformation.findByUserId
);

// Retrieve a single User Financial Information with an id (Admin OR Finance)
router.get(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  cacheMiddleware(600),
  financialInformation.findOne
);

// Update a User Financial Information with an id (Admin OR Finance)
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrFinance,
  financialInformation.update
);

module.exports = router;
