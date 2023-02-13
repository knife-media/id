const database = require('../utils/database');

async function findNotifications(user) {
  let query = `SELECT
    comments.id,
    comments.post_id,
    comments.created,
    comments.parent,
    posts.slug,
    posts.title
    FROM comments
    LEFT JOIN notifications ON comments.id = notifications.comment_id
    LEFT JOIN posts ON comments.post_id = posts.post_id
    WHERE comments.parent IN (SELECT id FROM comments WHERE user_id = ?)
    AND (notifications.comment_id IS NULL OR notifications.user_id != ?)
    AND comments.status = 'visible'
    AND comments.user_id != ?
    ORDER BY comments.created DESC LIMIT 100`;

  // Get database fields
  let [rows] = await database.query(query, [user, user, user]);

  return rows;
}

module.exports = findNotifications;
