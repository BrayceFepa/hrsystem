const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  dialectOptions: dbConfig.dialectOptions || {},
  define: {
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.user = require("./user.model")(sequelize, Sequelize);
db.userPersonalInfo = require("./userPersonalInfo.model")(sequelize, Sequelize);
db.userFinancialInfo = require("./userFinancialInfo.model")(
  sequelize,
  Sequelize
);
db.userPersonalEvent = require("./userPersonalEvent.model")(
  sequelize,
  Sequelize
);
db.department = require("./department.model")(sequelize, Sequelize);
db.deptAnnouncement = require("./deptAnnouncement.model")(sequelize, Sequelize);
db.job = require("./job.model")(sequelize, Sequelize);
db.application = require("./application.model")(sequelize, Sequelize);
db.leaveBalance = require("./leaveBalance.model")(sequelize, Sequelize);
db.payment = require("./payment.model")(sequelize, Sequelize);
db.expense = require("./expense.model")(sequelize, Sequelize);
db.userCertificate = require("./userCertificate.model")(sequelize, Sequelize);
db.salaryHistory = require("./salaryHistory.model")(sequelize, Sequelize);
db.allowanceType = require("./allowanceType.model")(sequelize, Sequelize);
db.employeeAllowance = require("./employeeAllowance.model")(
  sequelize,
  Sequelize
);

// User Associations
db.user.hasOne(db.userPersonalInfo, { foreignKey: { allowNull: false } });
db.user.hasOne(db.userFinancialInfo, { foreignKey: { allowNull: false } });
db.user.hasOne(db.leaveBalance, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.userPersonalEvent, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.application, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.deptAnnouncement, {
  foreignKey: { name: "createdByUserId", allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.job, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.userCertificate, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.salaryHistory, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.employeeAllowance, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});
db.user.belongsTo(db.department, { foreginKey: { allowNull: true } });

// User Financial Informations Assocations
db.userFinancialInfo.belongsTo(db.user, { foreignKey: { allowNull: false } });

// Department Associations
db.department.hasMany(db.user, { onDelete: "CASCADE", hooks: true });
db.department.hasMany(db.deptAnnouncement, {
  foreignKey: { allowNull: true },
  onDelete: "CASCADE",
  hooks: true,
});
db.department.hasMany(db.expense, { foreignKey: { allowNull: false } });

// Expense Association
db.expense.belongsTo(db.department, { foreignKey: { allowNull: false } });

// Job Associations
db.job.hasMany(db.payment, {
  foreginKey: { allowNull: true },
  onDelete: "CASCADE",
  hooks: true,
});
db.job.belongsTo(db.user, { foreignKey: { allowNull: false } });

// Leave Balance Associations
db.leaveBalance.belongsTo(db.user, { foreignKey: { allowNull: false } });

// Application Associations
db.application.belongsTo(db.user);

// Payment Associations
db.payment.belongsTo(db.job);

// Announcement Associations
db.deptAnnouncement.belongsTo(db.department, {
  foreignKey: { allowNull: true },
});
db.deptAnnouncement.belongsTo(db.user, {
  foreignKey: { name: "createdByUserId", allowNull: false },
});

// User Certificate Associations
db.userCertificate.belongsTo(db.user, { foreignKey: { allowNull: false } });

// Salary History Associations
db.salaryHistory.belongsTo(db.user, { foreignKey: { allowNull: false } });

// Allowance Type Associations
db.allowanceType.hasMany(db.employeeAllowance, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
  hooks: true,
});

// Employee Allowance Associations
db.employeeAllowance.belongsTo(db.user, { foreignKey: { allowNull: false } });
db.employeeAllowance.belongsTo(db.allowanceType, {
  foreignKey: { name: "allowanceTypeId", allowNull: false },
});

module.exports = db;
