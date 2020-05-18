const database = require('../utils/database');

async function editComment(content, comment, user) {
  // Update current user comment by id
  const query = `UPDATE comments SET content = ? WHERE id = ? AND user_id = ?`;

  // Update comment content
  await database.execute(query, [content, comment, user]);
}

module.exports = editComment;