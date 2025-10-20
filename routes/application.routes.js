var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");

const application = require("../controllers/application.controller.js");

// Retrieve all applications (Admin, Manager, or HR only)
router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManagerOrHR,
  application.findAll
);

// Create a new Application
router.post("/", withAuth.verifyToken, application.create);

// Get user's leave balance
router.get(
  "/user/:id/balance",
  withAuth.verifyToken,
  application.getUserBalance
);

// Get complete leave history for a user
router.get(
  "/history/:userId",
  withAuth.verifyToken,
  application.getUserHistory
);

// Get leave usage reports (Admin or HR)
router.get(
  "/reports",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrHR,
  application.getReports
);

//Retrieve all Application by User Id
router.get("/user/:id", withAuth.verifyToken, application.findAllByUserId);

//Retrieve all Application by Department Id
router.get(
  "/department/:id",
  withAuth.verifyToken,
  withAuth.withRoleManager,
  application.findAllByDeptId
);

//Retrieve Recent Applications (2 weeks old)
router.get("/recent", withAuth.verifyToken, application.findAllRecent);

//Retrieve Recent Applications (2 weeks old) And Dept
router.get(
  "/recent/department/:id",
  withAuth.verifyToken,
  withAuth.withRoleManager,
  application.findAllRecentAndDept
);

//Retrieve Recent Applications (2 weeks old) And User
router.get(
  "/recent/user/:id",
  withAuth.verifyToken,
  application.findAllRecentAndUser
);

//Retrieve a single Application with an id
router.get("/:id", withAuth.verifyToken, application.findOne);

// Update a Application with an id (Admin, Manager, or HR)
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManagerOrHR,
  application.update
);

// Delete all Applications (Admin only)
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  application.deleteAll
);

// Delete single application (Admin, Manager, or HR)
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdminOrManagerOrHR,
  application.delete
);

// Delete all Application by User Id (Admin only)
router.delete(
  "/user/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  application.deleteAllByUserId
);

module.exports = router;
