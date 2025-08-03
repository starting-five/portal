const { Pool } = require('pg');
const path = require('path');

// When this module is required by `setup.js` or the main app,
// this ensures environment variables are loaded from the .env file in the project root.
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// --- Add this block for debugging ---
// console.log('--- Checking Environment Variables ---');
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_DATABASE:', process.env.DB_DATABASE);
// console.log('DB_SSL:', process.env.DB_SSL);
// console.log('--- End Environment Variables Check ---');

// Database connection configuration using environment variables
// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_DATABASE,
//   ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
//   family: 4, // Force IPv4, as Docker may have issues with IPv6 routing
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure this is set in your .env
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
// });

// Test the database connection when the module is loaded.
// This provides immediate feedback when the server starts.
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Successfully connected to the database!');
  release(); // Release the client back to the pool
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Export the pool itself if you need direct access (e.g., for transactions)
};
