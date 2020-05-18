const database = require('../utils/database');

async function setRating(comment, vote, user) {
  // Insert rating for current user by comment
  const query = `INSERT INTO ratings (comment_id, vote, user_id) VALUES (?, ?, ?)`;

  // Process query
  await database.execute(query, [comment, vote, user]);
}

module.exports = setRating;