const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Organisation extends Model {
    static associate(models) {
      this.belongsToMany(models.User, { through: models.UserOrganisations });
    }
  }

  Organisation.init({
    orgId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Organisation'
  });

  return Organisation;
};
