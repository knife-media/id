const database = require('../utils/database');

async function addProfile(user, entity, provider) {
  const query = `INSERT INTO profiles (user_id, entity, provider) VALUES (?, ?, ?)`;

  // Send and wait nothing
  await database.execute(query, [user, entity, provider]);
}

module.exports = addProfile;