const database = require('../utils/database');

async function updateAvatar(avatar, user) {
  const query = `UPDATE users SET avatar = ? WHERE id = ?`;

  // Send and wait nothing
  await database.execute(query, [avatar, user]);
}

module.exports = updateAvatar;