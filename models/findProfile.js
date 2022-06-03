const database = require('../utils/database');

async function findProfile(entity, provider) {
  const query = `SELECT user_id AS user FROM profiles WHERE entity = ? AND provider = ?`;

  // Get database fields
  let [rows] = await database.execute(query, [entity, provider]);

  // Check if user exists
  let user = null;

  if (rows.length > 0) {
    user = rows[0].user;
  }

  return user;
}

module.exports = findProfile;
