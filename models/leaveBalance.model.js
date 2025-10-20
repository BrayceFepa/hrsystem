module.exports = (sequelize, Sequelize) => {
  const LeaveBalance = sequelize.define(
    "leave_balance",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "user",
          key: "id",
        },
      },
      annualLeaveTotal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 20,
        comment: "Total annual leave days allocated for the year",
      },
      annualLeaveUsed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Number of annual leave days used",
      },
      annualLeaveRemaining: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 20,
        comment: "Remaining annual leave days",
      },
      sickLeaveDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
        comment: "Sick leave days available",
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: new Date().getFullYear(),
        comment: "Year for which this balance applies",
      },
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return LeaveBalance;
};
