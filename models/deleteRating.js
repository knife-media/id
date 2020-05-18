const database = require('../utils/database');

async function deleteRating(comment, user) {
  // Delete current user ratings by comment
  const query = `DELETE FROM ratings WHERE comment_id = ? AND user_id = ?`;

  // Process query
  await database.execute(query, [comment, user]);
}

module.exports = deleteRating;