const pool = require("../controllers/connectDB");
const bcrypt = require("bcrypt");

async function getAllAdmins() {
    const [rows] = await pool.query("SELECT admin_id, username, email FROM admin ORDER BY admin_id ASC");
    return rows;
}

async function getAdminById(id) {
    const [rows] = await pool.query("SELECT admin_id, username, email, password FROM admin WHERE admin_id = ? LIMIT 1", [id]);
    return rows[0] || null;
}

async function findByUsernameOrEmail(identifier) {
    const [rows] = await pool.query("SELECT admin_id, username, email, password FROM admin WHERE username = ? OR email = ? LIMIT 1", [identifier, identifier]);
    return rows[0] || null;
}

async function createAdmin({ username, email, password }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query("INSERT INTO admin (username, email, password, created_at) VALUES (?, ?, ?, NOW())", [username, email, hash]);
    return result.insertId;
}

async function updateUsername({ id, newUsername }) {
    const [result] = await pool.query("UPDATE admin SET username = ? WHERE admin_id = ?", [newUsername, id]);
    return result.affectedRows;
}

async function updatePassword({ id, newPassword }) {
    const hash = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query("UPDATE admin SET password = ? WHERE admin_id = ?", [hash, id]);
    return result.affectedRows;
}

async function deleteAdmin(id) {
    const [result] = await pool.query("DELETE FROM admin WHERE admin_id = ?", [id]);
    return result.affectedRows;
}

async function updateEmail({ id, newEmail }) {
    const [result] = await pool.query(
        "UPDATE admin SET email = ? WHERE admin_id = ?",
        [newEmail, id]
    );
    return result.affectedRows;
}

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
    updatePassword,
    updateEmail,
    updateAdmin,
    deleteAdmin
};
