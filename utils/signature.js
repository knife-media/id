const jwt = require('jsonwebtoken');

signature = (req, res) => {
  const token = jwt.sign(req.user, process.env.JWT_SECRET);

  res.json(token);
}

module.exports = signature;