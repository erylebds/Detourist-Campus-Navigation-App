const pool = require("../controllers/connectDB");
const bcrypt = require("bcrypt");

// get all admins from the database
async function getAllAdmins() {
    const [rows] = await pool.query("SELECT admin_id, username, email FROM admin ORDER BY admin_id ASC");
    return rows;
}

// get a single admin by id
async function getAdminById(id) {
    const [rows] = await pool.query(
        "SELECT admin_id, username, email, password FROM admin WHERE admin_id = ? LIMIT 1",
        [id]
    );
    return rows[0] || null;
}

// find an admin by username or email
async function findByUsernameOrEmail(identifier) {
    const [rows] = await pool.query(
        "SELECT admin_id, username, email, password FROM admin WHERE username = ? OR email = ? LIMIT 1",
        [identifier, identifier]
    );
    return rows[0] || null;
}

// create a new admin with hashed password
async function createAdmin({ username, email, password }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        "INSERT INTO admin (username, email, password) VALUES (?, ?, ?)",
        [username, email, hash]
    );
    return result.insertId;
}

// update username for a specific admin
async function updateUsername({ id, newUsername }) {
    const [result] = await pool.query(
        "UPDATE admin SET username = ? WHERE admin_id = ?",
        [newUsername, id]
    );
    return result.affectedRows;
}

// update password and store previous passwords
async function updatePasswordWithHistory(id, newHash, oldPasswordsJSON) {
    const [result] = await pool.query(
        "UPDATE admin SET password = ?, old_passwords = ? WHERE admin_id = ?",
        [newHash, oldPasswordsJSON, id]
    );
    return result.affectedRows;
}

// delete an admin by id
async function deleteAdmin(id) {
    const [result] = await pool.query(
        "DELETE FROM admin WHERE admin_id = ?",
        [id]
    );
    return result.affectedRows;
}

// update email for a specific admin
async function updateEmail({ id, newEmail }) {
    const [result] = await pool.query(
        "UPDATE admin SET email = ? WHERE admin_id = ?",
        [newEmail, id]
    );
    return result.affectedRows;
}

// update multiple admin fields, password only if provided
async function updateAdmin({ id, username, email, password }) {
    let query = "UPDATE admin SET username = ?, email = ?";
    const params = [username, email];

    if (password) {
        const hash = await bcrypt.hash(password, 10);
        query += ", password = ?";
        params.push(hash);
    }

    query += " WHERE admin_id = ?";
    params.push(id);

    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

module.exports = {
    getAllAdmins,
    getAdminById,
    findByUsernameOrEmail,
    createAdmin,
    updateUsername,
    updatePassword: updatePasswordWithHistory,
    updateEmail,
    updateAdmin,
    deleteAdmin
};
