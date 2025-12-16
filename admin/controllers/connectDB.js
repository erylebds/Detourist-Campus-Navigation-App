// Import the mysql2 library and enable promise-based API
// "require" is used in Node.js to import modules (libraries or other files)
// Using "mysql2/promise" gives us a version of mysql2 where all queries return Promises
const mysql = require("mysql2/promise");

// Create a connection pool to the MySQL database
// "createPool" manages multiple database connections efficiently
// Instead of opening and closing a connection for every query, it reuses connections
const db = mysql.createPool({
    host: "localhost",   // Database server address
    user: "root",        // Database username
    password: "",        // Database password
    database: "detourist" // Name of the database to connect to
});

// Export the pool so it can be used in other parts of the application
module.exports = db;