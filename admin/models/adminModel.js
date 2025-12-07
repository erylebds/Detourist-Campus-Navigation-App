const pool = require("../controllers/connectDB");

async function findAdminByUsernameOrEmail(identifier) {
    const [rows] = await pool.query(
        "SELECT * FROM admin WHERE username = ? OR email = ?",
        [identifier, identifier]
    );
    return rows[0];
}

// get all admins
async function getAllAdmins() {
    const [rows] = await pool.query("SELECT * FROM admin");
    return rows;
}

// find admin by ID
async function findAdminById(id) {
    const [rows] = await pool.query("SELECT * FROM admin WHERE admin_id = ?", [id]);
    return rows[0];
}

module.exports = {
    findAdminByUsernameOrEmail,
    getAllAdmins,  
    findAdminById
};