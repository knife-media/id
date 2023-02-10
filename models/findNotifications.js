const database = require('../utils/database');

async function findNotifications(user) {
  // Select comment by post id
  const query = `SELECT
    comments.id,
    comments.post_id,
    comments.created,
    users.name,
    users.avatar,
    posts.slug
    FROM comments
    LEFT JOIN notifications ON comments.id = notifications.comment_id
    LEFT JOIN users ON users.id = comments.user_id
    LEFT JOIN posts ON posts.post_id = comments.post_id
    WHERE parent IN (SELECT id FROM comments WHERE user_id = ?)
    AND (notifications.comment_id IS NULL OR notifications.user_id != ?)
    AND comments.status = 'visible'
    AND comments.user_id != ?
    ORDER BY comments.created DESC LIMIT 20`;

  // Get database fields
  let [rows] = await database.query(query, [user, user, user]);

  return rows;
}

module.exports = findNotifications;
