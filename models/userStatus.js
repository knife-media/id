const database = require('../utils/database');

async function userStatus(user) {
  // Select comment by post id
  const query = `SELECT status FROM users WHERE id = ? LIMIT 1`

  // Get database fields
  let [rows] = await database.query(query, [user]);

  // Check user status
  let status = null;

  if (rows.length > 0) {
    status = rows[0].status;
  }

  return status;
}

module.exports = userStatus;