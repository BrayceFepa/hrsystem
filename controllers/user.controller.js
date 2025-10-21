const db = require("../models");
const User = db.user;
const UserPersonalInfo = db.userPersonalInfo;
const UserFinancialInfo = db.userFinancialInfo;
const Department = db.department;
const Job = db.job;
const Payment = db.payment;
const Op = db.Sequelize.Op;

const bcrypt = require("bcrypt");
const { getPagination, getPagingData } = require("../utils/pagination");
const { clearCache } = require("../config/cache.config");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  let hash = null;
  if (req.body.password) {
    hash = bcrypt.hashSync(req.body.password.toString(), 10);
  }

  console.log(req.body);
  // Create a User
  const user = {
    username: req.body.username,
    password: hash,
    fullName: req.body.fullname,
    role: req.body.role,
    active: true,
    departmentId: req.body.departmentId,
  };

  // Save User in the database
  User.findOne({
    where: { username: user.username },
  }).then((userExists) => {
    if (!userExists) {
      User.create(user)
        .then((data) => {
          // Clear users cache
          clearCache("/api/users");
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
    } else {
      res.status(403).send({
        message: "Username already exists",
      });
    }
  });
};

// Retrieve all Users from the database with pagination
exports.findAll = (req, res) => {
  const { page, size, role, active, empStatus } = req.query;
  const { limit, offset } = getPagination(page, size);

  // Build where clause for user filtering
  let whereClause = {};

  // Role filter (single or multiple comma-separated values)
  if (role) {
    const roles = role.split(",").map((r) => r.trim());
    whereClause.role = roles.length === 1 ? roles[0] : { [Op.in]: roles };
  }

  // Active status filter
  if (active !== undefined) {
    whereClause.active = active === "true" || active === true;
  }

  // Build Job include with optional empStatus filter
  const jobInclude = {
    model: Job,
  };

  if (empStatus) {
    jobInclude.where = { empStatus: empStatus };
    jobInclude.required = true; // INNER JOIN to filter users by employment status
  }

  User.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    include: [
      {
        model: UserPersonalInfo,
      },
      {
        model: UserFinancialInfo,
      },
      {
        model: Department,
      },
      jobInclude,
    ],
    distinct: true, // Important for accurate count with associations
  })
    .then((data) => {
      const response = getPagingData(data, page || 1, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Users.",
      });
    });
};

// Retrieve all Users from the database.
exports.findTotal = (req, res) => {
  User.count()
    .then((data) => {
      res.send(data.toString());
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Users.",
      });
    });
};

// Retrieve all Users from the database.
exports.findTotalByDept = (req, res) => {
  const id = req.params.id;

  User.count({
    where: { departmentId: id },
  })
    .then((data) => {
      res.send(data.toString());
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Users.",
      });
    });
};

// Retrieve all Users by Department Id with pagination
exports.findAllByDeptId = (req, res) => {
  const departmentId = req.params.id;
  const { page, size, role, active, empStatus } = req.query;
  const { limit, offset } = getPagination(page, size);

  // Build where clause for user filtering
  let whereClause = { departmentId: departmentId };

  // Role filter (single or multiple comma-separated values)
  if (role) {
    const roles = role.split(",").map((r) => r.trim());
    whereClause.role = roles.length === 1 ? roles[0] : { [Op.in]: roles };
  }

  // Active status filter
  if (active !== undefined) {
    whereClause.active = active === "true" || active === true;
  }

  // Build Job include with optional empStatus filter
  const jobInclude = {
    model: Job,
  };

  if (empStatus) {
    jobInclude.where = { empStatus: empStatus };
    jobInclude.required = true; // INNER JOIN to filter users by employment status
  }

  User.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    include: [
      {
        model: UserPersonalInfo,
      },
      {
        model: UserFinancialInfo,
      },
      {
        model: Department,
      },
      jobInclude,
    ],
    distinct: true,
  })
    .then((data) => {
      const response = getPagingData(data, page || 1, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving the Users from the Department with Id:" +
            departmentId,
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findOne({
    include: [
      {
        model: UserPersonalInfo,
      },
      {
        model: UserFinancialInfo,
      },
      {
        model: Department,
      },
      {
        model: Job,
        include: [
          {
            model: Payment,
          },
        ],
      },
    ],
    where: {
      id: id,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  if (req.body.password) {
    req.body.password = bcrypt(req.body.password, 10);
  }

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Clear users cache
        clearCache("/api/users");
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe Organization was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.changePassword = (req, res) => {
  const id = req.params.id;

  if (!req.body.oldPassword || !req.body.newPassword) {
    res.status(400).send({
      message: "Please send oldPassword and newPassword!",
    });
    return;
  }

  User.findOne({
    where: { id: id },
  }).then((user) => {
    if (user) {
      if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
        let hash = bcrypt.hashSync(req.body.newPassword, 10);
        console.log("hash", hash);
        let data = {
          password: hash,
        };
        User.update(data, {
          where: { id: id },
        })
          .then((num) => {
            if (num == 1) {
              // Clear users cache
              clearCache("/api/users");
              res.send({
                message: "User was updated successfully.",
              });
            } else {
              res.send({
                message: `Cannot update User with id=${id}. Maybe Organization was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating User with id=" + id,
            });
          });
      } else {
        res.status(400).send({
          message: "Wrong Password",
        });
      }
    } else {
      res.status(400).send({
        message: "No such user!",
      });
    }
  });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Clear users cache
        clearCache("/api/users");
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      // Clear users cache
      clearCache("/api/users");
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};

exports.deleteAllByDeptId = (req, res) => {
  const departmentId = req.params.id;

  User.destroy({
    where: { departmentId: departmentId },
    truncate: false,
  })
    .then((nums) => {
      // Clear users cache
      clearCache("/api/users");
      res.send({
        message:
          `${nums} Users of Organizations with id: ` +
          departmentId +
          ` were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};
