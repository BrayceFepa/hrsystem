const db = require("../models");
const SalaryHistory = db.salaryHistory;
const { clearCache } = require("../config/cache.config");

// Create and Save a new Salary History
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Salary History
  const salaryHistory = {
    userId: req.body.userId,
    effectiveDate: req.body.effectiveDate,
    endDate: req.body.endDate || null,
    salaryBasic: req.body.salaryBasic || null,
    salaryGross: req.body.salaryGross || null,
    salaryNet: req.body.salaryNet || null,
    allowanceHouseRent: req.body.allowanceHouseRent || 0,
    allowanceMedical: req.body.allowanceMedical || 0,
    allowanceSpecial: req.body.allowanceSpecial || 0,
    allowanceFuel: req.body.allowanceFuel || 0,
    allowancePhoneBill: req.body.allowancePhoneBill || 0,
    allowanceOther: req.body.allowanceOther || 0,
    allowanceTotal: req.body.allowanceTotal || 0,
    deductionProvidentFund: req.body.deductionProvidentFund || 0,
    deductionTax: req.body.deductionTax || 0,
    deductionOther: req.body.deductionOther || 0,
    deductionTotal: req.body.deductionTotal || 0,
    reason: req.body.reason || null,
    approvedBy: req.body.approvedBy || null,
    remarks: req.body.remarks || null,
  };

  // Save Salary History in the database
  SalaryHistory.create(salaryHistory)
    .then((data) => {
      // Clear salary history cache
      clearCache("/api/salaryHistory");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Salary History.",
      });
    });
};

// Retrieve all Salary History from the database
exports.findAll = (req, res) => {
  SalaryHistory.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving salary history.",
      });
    });
};

// Retrieve all Salary History by User Id
exports.findAllByUserId = (req, res) => {
  const userId = req.params.id;

  SalaryHistory.findAll({
    where: { userId: userId },
    order: [["effectiveDate", "DESC"]], // Most recent first
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving salary history.",
      });
    });
};

// Get current salary for a user
exports.getCurrentSalary = (req, res) => {
  const userId = req.params.id;

  SalaryHistory.findOne({
    where: {
      userId: userId,
      endDate: null, // Current salary has no end date
    },
    order: [["effectiveDate", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving current salary.",
      });
    });
};

// Find a single Salary History with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  SalaryHistory.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Salary History with id=" + id,
      });
    });
};

// Update a Salary History by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  SalaryHistory.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Clear salary history cache
        clearCache("/api/salaryHistory");
        res.send({
          message: "Salary History was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Salary History with id=${id}. Maybe Salary History was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Salary History with id=" + id,
      });
    });
};

// Delete a Salary History with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  SalaryHistory.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Clear salary history cache
        clearCache("/api/salaryHistory");
        res.send({
          message: "Salary History was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Salary History with id=${id}. Maybe Salary History was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Salary History with id=" + id,
      });
    });
};

// Delete all Salary History by User Id
exports.deleteAllByUserId = (req, res) => {
  const userId = req.params.id;

  SalaryHistory.destroy({
    where: { userId: userId },
    truncate: false,
  })
    .then((nums) => {
      // Clear salary history cache
      clearCache("/api/salaryHistory");
      res.send({
        message: `${nums} Salary History records were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all Salary History records.",
      });
    });
};
