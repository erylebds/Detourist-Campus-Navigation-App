const pool = require("../controllers/connectDB");

async function findAdminByUsernameOrEmail(identifier) {
    const [rows] = await pool.query(
        "SELECT * FROM admin WHERE username = ? OR email = ?",
        [identifier, identifier]
    );
    return rows[0];
}

async function findAdminById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM admin WHERE admin_id = ?",
        [id]
    );
    return rows[0];
}

async function createAdmin(username, email, password) {
    const [result] = await pool.query(
        "INSERT INTO admin (username, email, password) VALUES (?, ?, ?)",
        [username, email, password]
    );
    return result.insertId;
}

module.exports = {
    findAdminByUsernameOrEmail,
    findAdminById,
    createAdmin
};