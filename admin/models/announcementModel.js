// Import the database connection pool
const pool = require("../controllers/connectDB");

/**
 * Fetch all announcements from the database
 * Ordered by creation date (newest first)
 */
async function getAllAnnouncements() {
  // Execute SQL query using the pool
  const [rows] = await pool.query("SELECT * FROM announcement ORDER BY created_at DESC");
  return rows; // return array of announcement objects
}

/**
 * Fetch a single announcement by its ID
 * @param {number} id - announcement_id to fetch
 */
async function getAnnouncementById(id) {
  // Use parameterized query to prevent SQL injection
  const [rows] = await pool.query(
    "SELECT * FROM announcement WHERE announcement_id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null; // return the first row, or null if not found
}

/**
 * Create a new announcement in the database
 * @param {Object} announcement - { title, message, created_at }
 * @returns insertId - the ID of the newly created announcement
 */
async function createAnnouncement({ title, message, created_at }) {
  const sql = "INSERT INTO announcement (title, message, created_at) VALUES (?, ?, ?)";
  const [result] = await pool.query(sql, [title, message, created_at]);
  return result.insertId; // return the new announcement's ID
}

/**
 * Update an existing announcement
 * @param {Object} announcement - { id, title, message, created_at }
 * @returns affectedRows - number of rows updated (should be 1 if successful)
 */
async function updateAnnouncement({ id, title, message, created_at }) {
  const sql = "UPDATE announcement SET title = ?, message = ?, created_at = ? WHERE announcement_id = ?";
  const [result] = await pool.query(sql, [title, message, created_at, id]);
  return result.affectedRows;
}

/**
 * Delete an announcement by ID
 * @param {number} id - announcement_id to delete
 * @returns affectedRows - number of rows deleted (should be 1 if successful)
 */
async function deleteAnnouncement(id) {
  const [result] = await pool.query("DELETE FROM announcement WHERE announcement_id = ?", [id]);
  return result.affectedRows;
}

// Export functions so they can be used in controllers
module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};