const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: "Radu",
  host: "localhost",
  port: "5432",
  database: "test",
});

module.exports = pool;
