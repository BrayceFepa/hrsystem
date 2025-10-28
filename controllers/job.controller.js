const db = require("../models");
const Job = db.job;
const Op = db.Sequelize.Op;
const moment = require("moment");
const { clearCache } = require("../config/cache.config");

// Create and Save a new Job
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Validate empStatus if provided
  const validStatuses = ["Active", "On Leave", "Terminated", "Resigned"];
  if (req.body.empStatus && !validStatuses.includes(req.body.empStatus)) {
    res.status(400).send({
      message: `Invalid empStatus. Must be one of: ${validStatuses.join(", ")}`,
    });
    return;
  }

  // Validate agreementType if provided
  const validAgreementTypes = ["Permanent", "Contract", "Probation", "Intern"];
  if (
    req.body.agreementType &&
    !validAgreementTypes.includes(req.body.agreementType)
  ) {
    res.status(400).send({
      message: `Invalid agreementType. Must be one of: ${validAgreementTypes.join(
        ", "
      )}`,
    });
    return;
  }

  // Create a Job
  const newJob = {
    jobTitle: req.body.jobTitle,
    startDate: moment(req.body.startDate).format("YYYY-MM-DD HH:mm:ss"),
    endDate: req.body.endDate
      ? moment(req.body.endDate).format("YYYY-MM-DD HH:mm:ss")
      : null,
    empType: req.body.empType || null,
    empStatus: req.body.empStatus || null,
    directSupervisor: req.body.directSupervisor || null,
    contract:
      req.files && req.files.contract ? req.files.contract[0].path : null,
    certificate:
      req.files && req.files.certificate ? req.files.certificate[0].path : null,
    takenAssets: req.body.takenAssets || null,
    documentScanned:
      req.body.documentScanned !== undefined
        ? req.body.documentScanned === true ||
          req.body.documentScanned === "true" ||
          req.body.documentScanned === 1 ||
          req.body.documentScanned === "1"
        : false,
    guaranteeForm:
      req.files && req.files.guaranteeForm
        ? req.files.guaranteeForm[0].path
        : null,
    companyGuaranteeSupportLetter:
      req.files && req.files.companyGuaranteeSupportLetter
        ? req.files.companyGuaranteeSupportLetter[0].path
        : null,
    agreementType: req.body.agreementType || null,
    userId: req.body.userId,
  };

  Job.findOne({
    where: {
      [Op.and]: [
        { userId: req.body.userId },
        { startDate: { [Op.lte]: Date.now() } },
        {
          endDate: {
            [Op.or]: [{ [Op.gte]: Date.now() }, { [Op.is]: null }],
          },
        },
      ],
    },
  }).then((job) => {
    if (job) {
      if (new Date(job.dataValues.endDate) > new Date(newJob.startDate)) {
        job.dataValues.endDate = moment(newJob.startDate).subtract(1, "days");
      }

      Job.update(job.dataValues, {
        where: { id: job.dataValues.id },
      }).catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Job.",
        });
      });
    } else {
      console.log("job not found");
    }

    Job.create(newJob)
      .then((data) => {
        // Clear jobs cache
        clearCache("/api/jobs");
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Job.",
        });
      });
  });
};

// Retrieve all Jobs from the database.
exports.findAll = (req, res) => {
  Job.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving jobs.",
      });
    });
};

//Retrieve all Jobs By User Id
exports.findAllByUserId = (req, res) => {
  const userId = req.params.id;

  Job.findAll({ where: { userId: userId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving jobs.",
      });
    });
};

// Find a single Job with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Job.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Job with id=" + id,
      });
    });
};

// Update an Job by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  // Validate empStatus if provided
  const validStatuses = ["Active", "On Leave", "Terminated", "Resigned"];
  if (req.body.empStatus && !validStatuses.includes(req.body.empStatus)) {
    res.status(400).send({
      message: `Invalid empStatus. Must be one of: ${validStatuses.join(", ")}`,
    });
    return;
  }

  // Validate agreementType if provided
  const validAgreementTypes = ["Permanent", "Contract", "Probation", "Intern"];
  if (
    req.body.agreementType &&
    !validAgreementTypes.includes(req.body.agreementType)
  ) {
    res.status(400).send({
      message: `Invalid agreementType. Must be one of: ${validAgreementTypes.join(
        ", "
      )}`,
    });
    return;
  }

  // Normalize documentScanned field if provided
  const updateData = { ...req.body };
  if (updateData.documentScanned !== undefined) {
    updateData.documentScanned =
      updateData.documentScanned === true ||
      updateData.documentScanned === "true" ||
      updateData.documentScanned === 1 ||
      updateData.documentScanned === "1";
  }

  Job.update(updateData, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Clear jobs cache
        clearCache("/api/jobs");
        res.send({
          message: "Job was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Job with id=${id}. Maybe Job was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Job with id=" + id,
      });
    });
};

// Delete an Job with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Job.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Clear jobs cache
        clearCache("/api/jobs");
        res.send({
          message: "Job was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Job with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Job with id=" + id,
      });
    });
};

// Delete all Jobs from the database.
exports.deleteAll = (req, res) => {
  Job.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      // Clear jobs cache
      clearCache("/api/jobs");
      res.send({ message: `${nums} Jobs were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Jobs.",
      });
    });
};

// Delete all Jobs by User Id.
exports.deleteAllByUserId = (req, res) => {
  const userId = req.params.id;

  Job.destroy({
    where: { userId: userId },
    truncate: false,
  })
    .then((nums) => {
      // Clear jobs cache
      clearCache("/api/jobs");
      res.send({ message: `${nums} Jobs were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Jobs.",
      });
    });
};
