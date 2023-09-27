'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shippings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      destination: {
        type: Sequelize.STRING
      },
      estArrival: {
        type: Sequelize.DATE
      },
      ShipperId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Shippers",
          key:"id"
        },
        onUpdate:"cascade",
        onDelete:"cascade"
      },
      ProfileId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Profiles",
          key:"id"
        },
        onUpdate:"cascade",
        onDelete:"cascade"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Shippings');
  }
};