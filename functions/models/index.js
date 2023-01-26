"use strict";

const glob = require("glob");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// const config = require("../config/config.js")[env];
const db = {};

let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
  sequelize = new Sequelize({
      host: "engifest-staging.caonzjz0qhgb.ap-south-1.rds.amazonaws.com",
      username: "postgres",
      password: "Engifest123",
      database: "postgres",
      port: process.env.DB_PORT || "5432",
      dialect: "postgres",
      dialectOptions: {
        connectTimeout: 220000,
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 220000,
        idle: 10000,
      },
    }
  );
// }

glob
  .sync(`${__dirname}/**/*.js`)
  .filter((file) => {
    const fileName = file.split("/");
    return (
      fileName[fileName.length - 1].indexOf(".") !== 0 &&
      fileName[fileName.length - 1] !== basename &&
      fileName[fileName.length - 1].slice(-3) === ".js"
    );
  })
  .forEach(async (file) => {
    const fileName = file.split("/");
    db[fileName[fileName.length - 1].slice(0, -3)] = require(file)(
      sequelize,
      Sequelize
    );
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
