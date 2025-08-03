const { pool } = require("./index");
const fs = require("fs");
const path = require("path");

const setupDatabase = async () => {
  try {
    console.log("Reading schema file...");
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    console.log("Setting up database tables from schema.sql...");
    await pool.query(schemaSQL);
    console.log("✅ Database schema is fully configured!");
  } catch (err) {
    console.error("Error setting up tables:", err);
  } finally {
    // Close the connection pool. This is important for scripts that are not long-running servers.
    await pool.end();
  }
};

setupDatabase();
