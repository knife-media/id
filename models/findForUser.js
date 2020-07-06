const database = require('../utils/database');

async function findForUser(params) {
  // Select comments by post id for user
  const query = `SELECT
    comments.id, comments.parent, comments.content, comments.status,
    comments.created, users.name, users.avatar, uv.vote as vote,
    IF(comments.user_id = ?, true, false) AS self,
    IFNULL(SUM(ratings.vote = 'plus'), 0) plus,
    IFNULL(SUM(ratings.vote = 'minus'), 0) minus
    FROM comments
    LEFT JOIN users on users.id = comments.user_id
    LEFT JOIN ratings on comments.id = ratings.comment_id
    LEFT OUTER JOIN (
        SELECT comment_id, vote FROM ratings WHERE user_id = ?
    ) AS uv ON comments.id = uv.comment_id
    WHERE comments.post_id = ?
    GROUP BY comments.id`;

  // Get database fields
  const [rows, fields] = await database.query(query, params);

  return rows;
}

module.exports = findForUser;
