// Import the database connection pool
const pool = require("../controllers/connectDB");

/**
 * Find an admin by username or email
 * @param {string} identifier - username or email
 * @returns {Object|null} - the first matching admin or undefined if not found
 */
async function findAdminByUsernameOrEmail(identifier) {
    // Parameterized query prevents SQL injection
    const [rows] = await pool.query(
        "SELECT * FROM admin WHERE username = ? OR email = ?",
        [identifier, identifier] // Both placeholders use the same identifier
    );
    return rows[0]; // Return the first matching admin
}

/**
 * Fetch all admins from the database
 * @returns {Array} - array of admin objects
 */
async function getAllAdmins() {
    const [rows] = await pool.query("SELECT * FROM admin");
    return rows;
}

/**
 * Find an admin by their ID
 * @param {number} id - admin_id
 * @returns {Object|null} - admin object or undefined if not found
 */
async function findAdminById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM admin WHERE admin_id = ?",
        [id]
    );
    return rows[0]; // Return the first matching admin
}

// Export functions so they can be used by controllers
module.exports = {
    findAdminByUsernameOrEmail,
    getAllAdmins,  
    findAdminById
};