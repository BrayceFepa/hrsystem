const db = require("../models");
const UserCertificate = db.userCertificate;
const { clearCache } = require("../config/cache.config");

// Create and Save a new User Certificate
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Validate certificateType if provided
  const validCertificateTypes = [
    "Diploma",
    "Degree",
    "Certificate",
    "ID Card",
    "Passport",
    "Other",
  ];
  if (
    req.body.certificateType &&
    !validCertificateTypes.includes(req.body.certificateType)
  ) {
    res.status(400).send({
      message: `Invalid certificateType. Must be one of: ${validCertificateTypes.join(
        ", "
      )}`,
    });
    return;
  }

  // Create a User Certificate
  const userCertificate = {
    userId: req.body.userId,
    certificateType: req.body.certificateType,
    certificateName: req.body.certificateName,
    issuingAuthority: req.body.issuingAuthority || null,
    issueDate: req.body.issueDate || null,
    expiryDate: req.body.expiryDate || null,
    certificateNumber: req.body.certificateNumber || null,
    filePath:
      req.files && req.files.filePath ? req.files.filePath[0].path : null,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    remarks: req.body.remarks || null,
  };

  // Save User Certificate in the database
  UserCertificate.create(userCertificate)
    .then((data) => {
      // Clear certificates cache
      clearCache("/api/userCertificates");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the User Certificate.",
      });
    });
};

// Retrieve all User Certificates from the database
exports.findAll = (req, res) => {
  UserCertificate.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving user certificates.",
      });
    });
};

// Retrieve all User Certificates by User Id
exports.findAllByUserId = (req, res) => {
  const userId = req.params.id;

  UserCertificate.findAll({ where: { userId: userId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving user certificates.",
      });
    });
};

// Find a single User Certificate with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  UserCertificate.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User Certificate with id=" + id,
      });
    });
};

// Update a User Certificate by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  // Validate certificateType if provided
  const validCertificateTypes = [
    "Diploma",
    "Degree",
    "Certificate",
    "ID Card",
    "Passport",
    "Other",
  ];
  if (
    req.body.certificateType &&
    !validCertificateTypes.includes(req.body.certificateType)
  ) {
    res.status(400).send({
      message: `Invalid certificateType. Must be one of: ${validCertificateTypes.join(
        ", "
      )}`,
    });
    return;
  }

  UserCertificate.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Clear certificates cache
        clearCache("/api/userCertificates");
        res.send({
          message: "User Certificate was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User Certificate with id=${id}. Maybe User Certificate was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User Certificate with id=" + id,
      });
    });
};

// Delete a User Certificate with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  UserCertificate.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Clear certificates cache
        clearCache("/api/userCertificates");
        res.send({
          message: "User Certificate was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User Certificate with id=${id}. Maybe User Certificate was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User Certificate with id=" + id,
      });
    });
};

// Delete all User Certificates by User Id
exports.deleteAllByUserId = (req, res) => {
  const userId = req.params.id;

  UserCertificate.destroy({
    where: { userId: userId },
    truncate: false,
  })
    .then((nums) => {
      // Clear certificates cache
      clearCache("/api/userCertificates");
      res.send({
        message: `${nums} User Certificates were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all User Certificates.",
      });
    });
};
