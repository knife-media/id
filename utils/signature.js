const jwt = require('jsonwebtoken');
const path = require('path');

signature = (req, res) => {
  const token = jwt.sign(req.user, process.env.JWT_SECRET);

  // Set cookie with token for 90 days
  res.cookie('id.token', token, {
    expires: new Date(Date.now() + 90 * 24 * 3600000)
  })

  // Show profiles view to close popup
  res.sendFile(path.resolve('views/profiles.html'));
}

module.exports = signature;