const db = require("../models");
const LeaveBalance = db.leaveBalance;
const User = db.user;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("../utils/pagination");

// Initialize leave balance for a user
exports.initialize = (req, res) => {
  // Validate request
  if (!req.body.userId) {
    res.status(400).send({
      message: "User ID is required!",
    });
    return;
  }

  const leaveBalance = {
    userId: req.body.userId,
    annualLeaveTotal: req.body.annualLeaveTotal || 20,
    annualLeaveUsed: 0,
    annualLeaveRemaining: req.body.annualLeaveTotal || 20,
    sickLeaveDays: req.body.sickLeaveDays || 10,
    year: req.body.year || new Date().getFullYear(),
  };

  // Save LeaveBalance in the database
  LeaveBalance.create(leaveBalance)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Leave Balance.",
      });
    });
};

// Retrieve leave balance for a specific user
exports.findByUserId = (req, res) => {
  const userId = req.params.userId;

  LeaveBalance.findOne({
    where: { userId: userId },
    include: [
      {
        model: User,
        attributes: ["id", "username", "fullName", "role"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Leave balance not found for user with id=${userId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving leave balance for user with id=" + userId,
      });
    });
};

// Retrieve all leave balances (Admin/HR only) with pagination
exports.findAll = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  LeaveBalance.findAndCountAll({
    limit,
    offset,
    include: [
      {
        model: User,
        attributes: ["id", "username", "fullName", "role", "departmentId"],
      },
    ],
    order: [["userId", "ASC"]],
    distinct: true,
  })
    .then((data) => {
      const response = getPagingData(data, page || 1, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving leave balances.",
      });
    });
};

// Update leave balance for a user (Admin only)
exports.update = (req, res) => {
  const userId = req.params.userId;

  LeaveBalance.update(req.body, {
    where: { userId: userId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Leave balance was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update leave balance for user with id=${userId}. Maybe leave balance was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating leave balance for user with id=" + userId,
      });
    });
};

// Reset all leave balances for a new year (Admin only)
exports.resetAll = (req, res) => {
  const newYear = req.body.year || new Date().getFullYear();
  const defaultAnnualLeave = req.body.annualLeaveTotal || 20;
  const defaultSickLeave = req.body.sickLeaveDays || 10;

  LeaveBalance.findAll()
    .then((balances) => {
      const updatePromises = balances.map((balance) => {
        return LeaveBalance.update(
          {
            annualLeaveTotal: defaultAnnualLeave,
            annualLeaveUsed: 0,
            annualLeaveRemaining: defaultAnnualLeave,
            sickLeaveDays: defaultSickLeave,
            year: newYear,
          },
          {
            where: { id: balance.id },
          }
        );
      });

      return Promise.all(updatePromises);
    })
    .then(() => {
      res.send({
        message:
          "All leave balances have been reset successfully for year " + newYear,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error resetting leave balances: " + err.message,
      });
    });
};

// Deduct from annual leave balance (internal function)
exports.deductAnnualLeave = async (userId, numberOfDays) => {
  try {
    const balance = await LeaveBalance.findOne({ where: { userId: userId } });

    if (!balance) {
      throw new Error("Leave balance not found for user");
    }

    if (balance.annualLeaveRemaining < numberOfDays) {
      throw new Error("Insufficient annual leave balance");
    }

    await LeaveBalance.update(
      {
        annualLeaveUsed: balance.annualLeaveUsed + numberOfDays,
        annualLeaveRemaining: balance.annualLeaveRemaining - numberOfDays,
      },
      {
        where: { userId: userId },
      }
    );

    return true;
  } catch (error) {
    throw error;
  }
};

// Restore annual leave balance (internal function)
exports.restoreAnnualLeave = async (userId, numberOfDays) => {
  try {
    const balance = await LeaveBalance.findOne({ where: { userId: userId } });

    if (!balance) {
      throw new Error("Leave balance not found for user");
    }

    await LeaveBalance.update(
      {
        annualLeaveUsed: balance.annualLeaveUsed - numberOfDays,
        annualLeaveRemaining: balance.annualLeaveRemaining + numberOfDays,
      },
      {
        where: { userId: userId },
      }
    );

    return true;
  } catch (error) {
    throw error;
  }
};

// Get or create leave balance for a user (helper function)
exports.getOrCreateBalance = async (userId) => {
  try {
    let balance = await LeaveBalance.findOne({ where: { userId: userId } });

    if (!balance) {
      // Create default balance if doesn't exist
      balance = await LeaveBalance.create({
        userId: userId,
        annualLeaveTotal: 20,
        annualLeaveUsed: 0,
        annualLeaveRemaining: 20,
        sickLeaveDays: 10,
        year: new Date().getFullYear(),
      });
    }

    return balance;
  } catch (error) {
    throw error;
  }
};
