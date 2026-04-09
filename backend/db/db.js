const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:            process.env.DB_PORT     || 3306,
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || 'root',
  database:        process.env.DB_NAME     || 'hostel_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  multipleStatements: false,
  timezone:           '+00:00'
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully to hostel_db');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
  });

// Handle unexpected bracket/connection errors to prevent server crash
pool.on('error', (err) => {
  console.error('⚠️ Unexpected MySQL Pool Error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Attempting to reconnect...');
  }
});

module.exports = pool;
