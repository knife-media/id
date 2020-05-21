const database = require('../utils/database');

async function findByPost(params) {
  // Select comments by post id
  const query = `SELECT
    comments.id, comments.parent, comments.content, users.name, users.avatar,
    IFNULL(SUM(ratings.vote = 'plus'), 0) plus,
    IFNULL(SUM(ratings.vote = 'minus'), 0) minus
    FROM comments
    LEFT JOIN users on users.id = comments.user_id
    LEFT JOIN ratings on comments.id = ratings.comment_id
    WHERE comments.post_id = ?
    GROUP BY comments.id`;

  // Get database fields
  const [rows, fields] = await database.query(query, params);

  return rows;
}

module.exports = findByPost;
