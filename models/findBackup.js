const database = require('../utils/database');

async function findBackup(entity, provider) {
  const query = `SELECT user_id AS user FROM profiles WHERE backup LIKE ? AND provider = ?`;

  // Get backup from entity
  const backup = entity.substring(0, 14);

  // Get database fields
  let [rows] = await database.execute(query, [backup + '%', provider]);

  if (rows.length === 0) {
    return null;
  }

  // Send and wait nothing
  await database.execute(`UPDATE profiles SET entity = ? WHERE user_id = ?`, [entity, rows[0].user]);

  return rows[0].user;
}

module.exports = findBackup;
