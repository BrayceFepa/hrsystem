module.exports = (sequelize, Sequelize) => {
  const EmployeeAllowance = sequelize.define(
    "employee_allowance",
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
        comment: "Employee who receives this allowance",
      },
      allowanceTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "allowance_type",
          key: "id",
        },
        comment: "Type of allowance",
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Amount of the allowance in ETB",
      },
      effectiveDate: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "Date when this allowance became effective",
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Date when this allowance ended (null if current/active)",
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Additional notes about this allowance",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Whether this allowance is currently active",
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );

  return EmployeeAllowance;
};
