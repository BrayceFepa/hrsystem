var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { cacheMiddleware } = require("../config/cache.config");

const financialInformation = require("../controllers/userFinancialInformation.controller");

// Create a new User Financial Information
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  financialInformation.create
);

// Retrieve all User Financial Information (with 5 minute cache)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManager,
  cacheMiddleware(300),
  financialInformation.findAll
);

// Retrieve User Financial Information by User Id (with 5 minute cache)
router.get(
  "/user/:id",
  withAuth.verifyToken,
  cacheMiddleware(300),
  financialInformation.findByUserId
);

// Retrieve a single User Financial Information with an id (with 10 minute cache)
router.get(
  "/:id",
  withAuth.verifyToken,
  cacheMiddleware(600),
  financialInformation.findOne
);

// Update a User Financial Information with an id
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  financialInformation.update
);

module.exports = router;
