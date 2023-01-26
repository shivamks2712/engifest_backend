require("dotenv").config();
module.exports = {
  development: {
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
  },
  databaseConfigs: {
    host: "engifest-staging.caonzjz0qhgb.ap-south-1.rds.amazonaws.com",
    dialect: "postgres",
    port: process.env.DB_PORT || "5432",
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              rejectUnauthorized: false,
            }
          : false,
    },
  },
};
