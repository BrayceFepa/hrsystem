module.exports = (sequelize, Sequelize) => {
  const UserCertificate = sequelize.define(
    "user_certificate",
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
      certificateType: {
        type: Sequelize.ENUM,
        values: [
          "Diploma",
          "Degree",
          "Certificate",
          "ID Card",
          "Passport",
          "Other",
        ],
        allowNull: false,
      },
      certificateName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment:
          "Name/title of the certificate (e.g., 'Bachelor of Computer Science', 'Driver License')",
      },
      issuingAuthority: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Organization that issued the certificate",
      },
      issueDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Date when the certificate was issued",
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Date when the certificate expires (if applicable)",
      },
      certificateNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Certificate number or reference",
      },
      filePath: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Path to the scanned certificate file",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Whether this certificate is currently active/valid",
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Additional notes about the certificate",
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );

  return UserCertificate;
};
