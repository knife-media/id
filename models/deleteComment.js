const database = require('../utils/database');

async function deleteComment(comment, user) {
  // Delete current user ratings by comment
  const query = `UPDATE comments SET status = 'removed' WHERE id = ? AND user_id = ?`;

  // Process query
  await database.execute(query, [comment, user]);
}

module.exports = deleteComment;