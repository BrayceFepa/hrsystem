module.exports = (sequelize, Sequelize) => {
  const SalaryHistory = sequelize.define(
    "salary_history",
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
        references: {
          model: "user",
          key: "id",
        },
      },
      effectiveDate: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "Date when this salary became effective",
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Date when this salary ended (null if current)",
      },
      salaryBasic: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Basic salary amount",
      },
      salaryGross: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Gross salary amount",
      },
      salaryNet: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Net salary amount",
      },
      allowanceHouseRent: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      allowanceMedical: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      allowanceSpecial: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      allowanceFuel: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      allowancePhoneBill: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      allowanceOther: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      allowanceTotal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      deductionProvidentFund: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      deductionTax: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      deductionOther: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      deductionTotal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Reason for salary change (promotion, annual increase, etc.)",
      },
      approvedBy: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Person who approved this salary change",
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Additional notes about the salary change",
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );

  return SalaryHistory;
};
