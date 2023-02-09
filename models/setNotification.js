const database = require('../utils/database');

async function setNotification(comment, user) {
  // Insert viewed notification for current user
  const query = `INSERT IGNORE INTO notifications (comment_id, user_id) VALUES (?, ?)`;

  // Process query
  await database.execute(query, [comment, user]);
}

module.exports = setNotification;
