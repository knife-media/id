const database = require('../utils/database');

async function findByPost(post) {
  // Select comments by post id
  const query = `SELECT
    comments.id,
    comments.parent,
    comments.status,
    comments.content,
    comments.created,
    comments.user_id,
    users.name,
    users.avatar,
    IFNULL(SUM(ratings.vote = 'plus'), 0) plus,
    IFNULL(SUM(ratings.vote = 'minus'), 0) minus
    FROM comments
    LEFT JOIN users on users.id = comments.user_id
    LEFT JOIN ratings on comments.id = ratings.comment_id
    WHERE comments.post_id = ?
    GROUP BY comments.id
    ORDER BY comments.id ASC`;

  // Get database fields
  let [rows] = await database.query(query, [post]);

  return rows;
}

module.exports = findByPost;