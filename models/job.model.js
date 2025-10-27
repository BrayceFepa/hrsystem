module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define(
    "job",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      jobTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      empType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      empStatus: {
        type: Sequelize.ENUM,
        values: ["Active", "On Leave", "Terminated", "Resigned"],
        allowNull: true,
      },
      contract: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      certificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      directSupervisor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      laptopAgreement: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "File path to laptop agreement document",
      },
      guaranteeForm: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "File path to guarantee form document",
      },
      companyGuaranteeSupportLetter: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "File path to company guarantee support letter",
      },
      agreementType: {
        type: Sequelize.ENUM,
        values: ["Permanent", "Contract", "Probation", "Intern"],
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
    }
  );

  return Job;
};
