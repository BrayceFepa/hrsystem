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
        type: Sequelize.STRING,
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
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
    }
  );

  return Job;
};
