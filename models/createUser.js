const database = require('../utils/database');

async function createUser(name, address) {
  const query = `INSERT INTO users (name, address) VALUES (?, ?)`;

  // Get database fields
  const [rows, fields] = await database.execute(query, [name, address]);

  // Return user id
  return rows.insertId;
}

module.exports = createUser;