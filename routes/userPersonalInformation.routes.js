var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");
const { uploadPersonalInfoFiles } = require("../config/upload.config");
const { cacheMiddleware } = require("../config/cache.config");

const personalInformation = require("../controllers/userPersonalInformation.controller.js");

// Create a new User Personal Information (with file upload)
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  uploadPersonalInfoFiles,
  personalInformation.create
);

//Retrieve User Personal Informations by User Id (with 5 minute cache)
router.get(
  "/user/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  cacheMiddleware(300),
  personalInformation.findAllByUserId
);

//Retrieve a single User Personal Information with an id (with 10 minute cache)
router.get(
  "/:id",
  withAuth.verifyToken,
  cacheMiddleware(600),
  personalInformation.findOne
);

// Update a User Personal Information with an id
router.put(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  personalInformation.update
);

// Delete a User Personal Information with an id
router.delete(
  "/:id",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  personalInformation.delete
);

// Delete all User Personal Informations
router.delete(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleAdmin,
  personalInformation.deleteAll
);

module.exports = router;
