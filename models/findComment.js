const database = require('../utils/database');

async function findComment(comment) {
  // Select comment by post id
  const query = `SELECT
    comments.id,
    comments.parent,
    comments.content,
    comments.status,
    comments.created,
    comments.user_id,
    users.name,
    users.avatar,
    posts.slug,
    IFNULL(SUM(ratings.vote = 'plus'), 0) plus,
    IFNULL(SUM(ratings.vote = 'minus'), 0) minus
    FROM comments
    LEFT JOIN users on users.id = comments.user_id
    LEFT JOIN ratings on comments.id = ratings.comment_id
    LEFT JOIN posts on comments.post_id = posts.post_id
    WHERE comments.id = ? LIMIT 1`

  // Get database fields
  let [rows] = await database.query(query, [comment]);

  return rows;
}

module.exports = findComment;
