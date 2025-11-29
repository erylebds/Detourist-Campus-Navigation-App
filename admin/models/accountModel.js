const pool = require("../controllers/connectDB");
const bcrypt = require("bcrypt");

async function getByUsernameOrEmail(identifier) {
    const [rows] = await pool.query(
        "SELECT admin_id, username, email, password FROM admin WHERE username = ? OR email = ? LIMIT 1",
        [identifier, identifier]
    );
    return rows[0] || null;
}

async function getById(id) {
    const [rows] = await pool.query(
        "SELECT admin_id, username, email, password FROM admin WHERE admin_id = ? LIMIT 1",
        [id]
    );
    return rows[0] || null;
}

async function updateUsername(id, newUsername) {
    const [result] = await pool.query(
        "UPDATE admin SET username = ? WHERE admin_id = ?",
        [newUsername, id]
    );
    return result.affectedRows;
}

async function updatePassword(id, password) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        "UPDATE admin SET password = ? WHERE admin_id = ?",
        [hash, id]
    );
    return result.affectedRows;
}

module.exports = {
    getByUsernameOrEmail,
    getById,
    updateUsername,
    updatePassword
};
