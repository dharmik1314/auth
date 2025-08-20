const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize the Sequelize connection using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
);

// Define the User model which corresponds to the 'Users' table in the database
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Use UUIDs for primary keys for better security and scalability
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensure the email is in a valid format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Export the sequelize instance and the User model
module.exports = { sequelize, User };