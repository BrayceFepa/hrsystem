module.exports = (sequelize, Sequelize) => {
  const Application = sequelize.define(
    "application",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Employee full name (auto-populated)",
      },
      positionTitle: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Employee position/job title (auto-populated)",
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Reason/comments for the leave request",
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      numberOfDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Auto-calculated from start and end date",
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Approved", "Rejected", "Pending"],
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM,
        values: [
          "Sick Leave with document",
          "Sick Leave without document",
          "Remote Work",
          "Annual Leave",
          "Bereavement Leave",
          "Unexcused Absence",
          "Business Leave",
        ],
        allowNull: false,
      },
      approvedBy: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Name or ID of the supervisor/manager who approved",
      },
      businessLeavePurpose: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Purpose of business leave (required for Business Leave type)",
      },
      businessLeaveDestination: {
        type: Sequelize.STRING,
        allowNull: true,
        comment:
          "Destination for business leave (required for Business Leave type)",
      },
      deductedFromBalance: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment:
          "Flag to track if leave was deducted from annual leave balance",
      },
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );

  return Application;
};
