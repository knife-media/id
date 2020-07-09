const database = require('../utils/database');

async function findForUser(user, fields) {
  let comments = [];

  fields.forEach((item) => {
    comments.push(item.id);
  });

  comments = comments.join(',');

  // Select ratings for user
  const query = `SELECT * FROM ratings WHERE user_id = ? AND comment_id IN (${comments})`;

  // Get database fields
  let [rows] = await database.query(query, [user]);

  // Add user votes and self
  fields.forEach((item, i, arr) => {
    // Check if comment by current user
    if (parseInt(user) === item.user_id) {
      arr[i].self = 1;
    }

    rows.forEach(rating => {
      if (item.id === rating.comment_id) {
        arr[i].vote = rating.vote;
      }
    });

    delete arr[i].user_id;
  });

  return fields;
}

module.exports = findForUser;
