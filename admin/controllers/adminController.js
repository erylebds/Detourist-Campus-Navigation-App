const pool = require("./connectDB");

async function findAdminByUsernameOrEmail(identifier) {
  const sql = "SELECT * FROM admin WHERE username = ? OR email = ? LIMIT 1";
  const [rows] = await pool.query(sql, [identifier, identifier]);
  return rows[0] || null;
}

module.exports = {
  findAdminByUsernameOrEmail
};
