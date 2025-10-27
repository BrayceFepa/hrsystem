module.exports = (sequelize, Sequelize) => {
  const AllowanceType = sequelize.define(
    "allowance_type",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment:
          "Name of the allowance (e.g., 'Transport', 'Shift', 'Position')",
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        comment:
          "Short code for the allowance (e.g., 'TRANSPORT', 'SHIFT', 'POSITION')",
      },
      deductionTax: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Whether this allowance is subject to TAX deduction",
      },
      deductionPension: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Whether this allowance is subject to PENSION deduction",
      },
      maxExemptAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment:
          "Maximum exempt amount from tax/pension (e.g., 600 for Transport). 0 = no exemption",
      },
      exemptFromTax: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether this allowance is completely exempt from tax",
      },
      exemptFromPension: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether this allowance is completely exempt from pension",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Description of the allowance and its rules",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Whether this allowance type is currently active",
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "Order for displaying in lists/forms",
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );

  return AllowanceType;
};
