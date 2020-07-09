const database = require('../utils/database');

async function addComment(parent, post, user, address, content) {
  // Insert new comment
  const query = `INSERT comments (parent, post_id, user_id, address, content)
    VALUES (?, ?, ?, ?, ?)`;

  let params = [parent, post, user, address, content];

  // Update comment content
  let [rows] =  await database.execute(query, params);

  // Return comment id
  return rows.insertId;
}

module.exports = addComment;