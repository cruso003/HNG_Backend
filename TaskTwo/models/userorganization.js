module.exports = (sequelize, DataTypes) => {
    const UserOrganisations = sequelize.define('UserOrganisations', {});
  
    return UserOrganisations;
  };