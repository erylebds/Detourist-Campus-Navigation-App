const pool = require("../controllers/connectDB");

async function getAllAnnouncements() {
  const [rows] = await pool.query("SELECT * FROM announcement ORDER BY created_at DESC");
  return rows;
}

async function getAnnouncementById(id) {
  const [rows] = await pool.query("SELECT * FROM announcement WHERE announcement_id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function createAnnouncement({ title, message, created_at }) {
  const sql = "INSERT INTO announcement (title, message, created_at) VALUES (?, ?, ?)";
  const [result] = await pool.query(sql, [title, message, created_at]);
  return result.insertId;
}

async function updateAnnouncement({ id, title, message, created_at }) {
  const sql = "UPDATE announcement SET title = ?, message = ?, created_at = ? WHERE announcement_id = ?";
  const [result] = await pool.query(sql, [title, message, created_at, id]);
  return result.affectedRows;
}

async function deleteAnnouncement(id) {
  const [result] = await pool.query("DELETE FROM announcement WHERE announcement_id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};