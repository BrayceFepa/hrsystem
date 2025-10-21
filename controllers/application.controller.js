const db = require("../models");
const Application = db.application;
const User = db.user;
const Job = db.job;
const Department = db.department;
const Op = db.Sequelize.Op;
const moment = require("moment");
const { department } = require("../models");
const leaveBalanceController = require("./leaveBalance.controller");
const { getPagination, getPagingData } = require("../utils/pagination");

// Helper function to calculate number of days between two dates
const calculateNumberOfDays = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return end.diff(start, "days") + 1; // +1 to include both start and end dates
};

// Create and Save a new Application
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  try {
    const userId = req.body.userId;
    const leaveType = req.body.type;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    // Validate required fields
    if (!userId || !leaveType || !startDate || !endDate) {
      return res.status(400).send({
        message: "Missing required fields: userId, type, startDate, endDate",
      });
    }

    // Calculate number of days
    const numberOfDays = calculateNumberOfDays(startDate, endDate);

    if (numberOfDays <= 0) {
      return res.status(400).send({
        message: "End date must be after start date",
      });
    }

    // Fetch user and job information
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Get user's current job/position
    const job = await Job.findOne({
      where: { userId: userId },
      order: [["startDate", "DESC"]],
    });

    // Validate business leave has purpose and destination
    if (leaveType === "Business Leave") {
      if (
        !req.body.businessLeavePurpose ||
        !req.body.businessLeaveDestination
      ) {
        return res.status(400).send({
          message: "Business Leave requires purpose and destination fields",
        });
      }
    }

    // Check if leave type requires balance deduction
    const requiresDeduction =
      leaveType === "Sick Leave without document" ||
      leaveType === "Annual Leave";

    let deductedFromBalance = false;

    if (requiresDeduction) {
      // Get or create leave balance
      const balance = await leaveBalanceController.getOrCreateBalance(userId);

      // Check if sufficient balance
      if (balance.annualLeaveRemaining < numberOfDays) {
        return res.status(400).send({
          message: `Insufficient annual leave balance. Available: ${balance.annualLeaveRemaining} days, Requested: ${numberOfDays} days`,
        });
      }

      // Deduct from balance
      await leaveBalanceController.deductAnnualLeave(userId, numberOfDays);
      deductedFromBalance = true;
    }

    // Create Application
    const application = {
      name: user.fullName,
      positionTitle: job ? job.jobTitle : null,
      reason: req.body.reason,
      startDate: startDate,
      endDate: endDate,
      numberOfDays: numberOfDays,
      status: "Pending",
      type: leaveType,
      approvedBy: req.body.approvedBy || null,
      businessLeavePurpose: req.body.businessLeavePurpose || null,
      businessLeaveDestination: req.body.businessLeaveDestination || null,
      deductedFromBalance: deductedFromBalance,
      userId: userId,
    };

    // Save Application in the database
    const data = await Application.create(application);

    res.send(data);
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Application.",
    });
  }
};

// Retrieve all Applications from the database with pagination and filtering
exports.findAll = (req, res) => {
  const { page, size, status, type, startDate, endDate } = req.query;
  const { limit, offset } = getPagination(page, size);

  // Build where clause for filtering
  let whereClause = {};

  if (status) {
    whereClause.status = status;
  }

  if (type) {
    whereClause.type = type;
  }

  if (startDate && endDate) {
    whereClause.startDate = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  } else if (startDate) {
    whereClause.startDate = {
      [Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    whereClause.startDate = {
      [Op.lte]: new Date(endDate),
    };
  }

  Application.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    include: [
      {
        model: User,
        attributes: ["id", "username", "fullName", "departmentId"],
      },
    ],
    order: [["startDate", "DESC"]],
    distinct: true,
  })
    .then((data) => {
      const response = getPagingData(data, page || 1, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

// Retrieve all Applications for a Manager (their own + their department's employees)
exports.findAllForManager = async (req, res) => {
  try {
    const managerId = req.authData.user.id;
    const { page, size, status, type, startDate, endDate } = req.query;
    const { limit, offset } = getPagination(page, size);

    // Fetch manager's information to get their department
    const manager = await User.findByPk(managerId);

    if (!manager) {
      return res.status(404).send({
        message: "Manager not found",
      });
    }

    if (!manager.departmentId) {
      return res.status(400).send({
        message: "Manager is not assigned to any department",
      });
    }

    // Build where clause for application filtering
    let whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (type) {
      whereClause.type = type;
    }

    if (startDate && endDate) {
      whereClause.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereClause.startDate = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      whereClause.startDate = {
        [Op.lte]: new Date(endDate),
      };
    }

    // Query applications from manager's department
    const data = await Application.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: User,
          where: { departmentId: manager.departmentId },
          attributes: ["id", "username", "fullName", "departmentId"],
        },
      ],
      order: [["startDate", "DESC"]],
      distinct: true,
    });

    const response = getPagingData(data, page || 1, limit);
    res.send(response);
  } catch (err) {
    console.error("Error retrieving applications for manager:", err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Applications.",
    });
  }
};

// Retrieve all Applications from the database.
exports.findAllRecent = (req, res) => {
  Application.findAll({
    where: {
      [Op.and]: [
        {
          startDate: {
            [Op.gte]: moment().subtract(14, "days").toDate(),
          },
        },
        {
          startDate: {
            [Op.lte]: moment().add(7, "days").toDate(),
          },
        },
      ],
    },
    include: [
      {
        model: User,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

exports.findAllRecentAndDept = (req, res) => {
  const id = req.params.id;

  Application.findAll({
    where: {
      [Op.and]: [
        {
          startDate: {
            [Op.gte]: moment().subtract(14, "days").toDate(),
          },
        },
        {
          startDate: {
            [Op.lte]: moment().add(7, "days").toDate(),
          },
        },
      ],
    },
    include: [
      {
        model: User,
        where: { departmentId: id },
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

exports.findAllRecentAndUser = (req, res) => {
  const id = req.params.id;

  Application.findAll({
    where: {
      [Op.and]: [
        {
          startDate: {
            [Op.gte]: moment().subtract(14, "days").toDate(),
          },
        },
        {
          startDate: {
            [Op.lte]: moment().add(7, "days").toDate(),
          },
        },
      ],
    },
    include: [
      {
        model: User,
        where: { id: id },
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

//Retrieve all Applications By Department Id with pagination and filtering
exports.findAllByDeptId = (req, res) => {
  const deptId = req.params.id;
  const { page, size, status, type } = req.query;
  const { limit, offset } = getPagination(page, size);

  // Build where clause for the application table
  let whereClause = {};

  if (status) {
    whereClause.status = status;
  }

  if (type) {
    whereClause.type = type;
  }

  Application.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    include: [
      {
        model: User,
        where: { departmentId: deptId },
        attributes: ["id", "username", "fullName", "departmentId"],
      },
    ],
    order: [["startDate", "DESC"]],
    distinct: true,
  })
    .then((data) => {
      const response = getPagingData(data, page || 1, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Applications.",
      });
    });
};

//Retrieve all Applications By User Id with pagination and filtering
exports.findAllByUserId = (req, res) => {
  const userId = req.params.id;
  const { page, size, status, type } = req.query;
  const { limit, offset } = getPagination(page, size);

  // Build where clause
  let whereClause = { userId: userId };

  if (status) {
    whereClause.status = status;
  }

  if (type) {
    whereClause.type = type;
  }

  User.findByPk(userId).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: "User not found with id=" + userId,
      });
    }

    Application.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ["id", "username", "fullName", "departmentId"],
        },
      ],
      order: [["startDate", "DESC"]],
      distinct: true,
    })
      .then((data) => {
        const response = getPagingData(data, page || 1, limit);
        res.send(response);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Applications.",
        });
      });
  });
};

// Find a single Application with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Application.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Application with id=" + id,
      });
    });
};

// Update a Application by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    // Get the existing application
    const existingApp = await Application.findByPk(id);

    if (!existingApp) {
      return res.status(404).send({
        message: `Application with id=${id} not found`,
      });
    }

    const oldStatus = existingApp.status;
    const newStatus = req.body.status;

    // Update the application
    const [num] = await Application.update(req.body, {
      where: { id: id },
    });

    if (num == 1) {
      // Handle balance restoration if application is rejected
      if (
        oldStatus !== "Rejected" &&
        newStatus === "Rejected" &&
        existingApp.deductedFromBalance
      ) {
        try {
          await leaveBalanceController.restoreAnnualLeave(
            existingApp.userId,
            existingApp.numberOfDays
          );
          console.log(
            `Restored ${existingApp.numberOfDays} days to user ${existingApp.userId} due to rejection`
          );
        } catch (balanceError) {
          console.error("Error restoring balance:", balanceError);
          // Don't fail the update if balance restoration fails, but log it
        }
      }

      res.send({
        message: "Application was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update Application with id=${id}. Maybe Application was not found or req.body is empty!`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error updating Application with id=" + id,
    });
  }
};

// Delete a Application with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Application.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Application was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Application with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Application with id=" + id,
      });
    });
};

// Delete all Applications from the database.
exports.deleteAll = (req, res) => {
  Application.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Applications were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Applications.",
      });
    });
};

// Delete all Applications by User Id.
exports.deleteAllByUserId = (req, res) => {
  const userId = req.params.id;

  Application.destroy({
    where: { userId: userId },
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Applications were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Applications.",
      });
    });
};

// Get user's leave balance
exports.getUserBalance = async (req, res) => {
  const userId = req.params.id;

  try {
    const balance = await leaveBalanceController.getOrCreateBalance(userId);
    res.send(balance);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving leave balance for user with id=" + userId,
    });
  }
};

// Get complete leave history for a user
exports.getUserHistory = (req, res) => {
  const userId = req.params.userId;

  Application.findAll({
    where: { userId: userId },
    include: [
      {
        model: User,
        attributes: ["id", "username", "fullName"],
      },
    ],
    order: [["startDate", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving leave history for user with id=" + userId,
      });
    });
};

// Get leave usage reports (Admin only)
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate, departmentId } = req.query;

    let whereClause = {};

    // Filter by date range if provided
    if (startDate && endDate) {
      whereClause.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Get all applications with user details
    const applications = await Application.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "username", "fullName", "departmentId"],
          ...(departmentId && {
            where: { departmentId: departmentId },
          }),
        },
      ],
      order: [["startDate", "DESC"]],
    });

    // Calculate statistics
    const stats = {
      totalApplications: applications.length,
      pending: applications.filter((app) => app.status === "Pending").length,
      approved: applications.filter((app) => app.status === "Approved").length,
      rejected: applications.filter((app) => app.status === "Rejected").length,
      totalDaysUsed: applications
        .filter((app) => app.status === "Approved")
        .reduce((sum, app) => sum + (app.numberOfDays || 0), 0),
      byType: {},
    };

    // Group by leave type
    applications.forEach((app) => {
      if (!stats.byType[app.type]) {
        stats.byType[app.type] = {
          count: 0,
          totalDays: 0,
        };
      }
      stats.byType[app.type].count++;
      if (app.status === "Approved") {
        stats.byType[app.type].totalDays += app.numberOfDays || 0;
      }
    });

    res.send({
      applications: applications,
      statistics: stats,
    });
  } catch (err) {
    console.error("Error generating reports:", err);
    res.status(500).send({
      message: "Error generating leave reports: " + err.message,
    });
  }
};
