const database = require('../utils/database');

async function appendVotes(comments, user) {
  // Skip if empty set
  if (comments.length === 0) {
    return comments;
  }

  let fields = [];

  // Get array of comment ids
  comments.forEach((item) => {
    fields.push(item.id);
  });

  fields = fields.join(',');

  // Select user ratings for these comments
  const query = `SELECT * FROM ratings WHERE user_id = ? AND comment_id IN (${fields})`;

  // Get database fields
  let [rows] = await database.query(query, [user]);

  // Add user votes
  comments = comments.map(item => {
    rows.forEach(rating => {
      if (item.id === rating.comment_id) {
        item.vote = rating.vote;
      }
    });

    return item;
  });

  return comments;
}

module.exports = appendVotes;
