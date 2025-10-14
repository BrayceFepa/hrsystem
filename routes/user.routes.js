var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { cacheMiddleware } = require("../config/cache.config");

const user = require("../controllers/user.controller.js");

// Create a new user
router.post("/", user.create);

// Retrieve all Users (with 5 minute cache)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManager,
  cacheMiddleware(300),
  user.findAll
);

//Retreive user count (with 5 minute cache)
router.get(
  "/total",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManager,
  cacheMiddleware(300),
  user.findTotal
);

router.get(
  "/total/department/:id",
  withAuth.verifyToken,
  withAuth.withRoleManager,
  cacheMiddleware(300),
  user.findTotalByDept
);

//Retrieve all Users by Department Id (with 5 minute cache)
router.get(
  "/department/:id",
  withAuth.verifyToken,
  cacheMiddleware(300),
  user.findAllByDeptId
);

//Retrieve a single User with an id (with 10 minute cache)
router.get("/:id", withAuth.verifyToken, cacheMiddleware(600), user.findOne);

// Update a User with id
router.put("/:id", withAuth.verifyToken, withAuth.withRoleAdmin, user.update);

router.put("/changePassword/:id", withAuth.verifyToken, user.changePassword);

// Delete a User with id
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  user.delete
);

// Delete all Users
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  user.deleteAll
);

//Delete all Users by Department Id
router.delete(
  "/department/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  user.deleteAllByDeptId
);

module.exports = router;
