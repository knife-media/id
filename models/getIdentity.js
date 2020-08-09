const database = require('../utils/database');

async function getIdentity(user) {
  const query = `SELECT name, avatar FROM users WHERE id = ? LIMIT 1`;

  // Get database fields
  let [rows] = await database.execute(query, [user]);

  if (rows.length < 1) {
    return null;
  }

  return rows[0];
}

module.exports = getIdentity;