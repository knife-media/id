/**
 * Social services for knife.media
 *
 * @author Anton Lukin
 * @license MIT
 * @version 1.0.0
 */

const express = require('express');
const request = require('request-ip');
const verify = require('express-jwt');

const server = express();

// Require settings
require('dotenv').config();

// Require comments router
const routes = require('./routes');

// Set request ip middleware
server.use(request.mw());

// Parse json requests
server.use(express.json());

// Get user from jwt
server.use(verify({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
  algorithms: ['HS256']
}));


// Skip wrong JWT token error
server.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    next();
  }
});

// Set avatars serve-static
server.use('/id/avatars', express.static('avatars'));

// Use comments router
server.use('/id/comments', routes.comments);

// Use identify router
server.use('/id/profiles', routes.profiles);

// Use ratings router
server.use('/id/ratings', routes.ratings);

// Show server error
server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    'success': false,
    'message': err.message || 'Server internal error'
  });

  if (err.console) {
    console.error(err.console);
  }
});

// Last error handler
server.use((req, res) => {
  res.status(404).json({
    'success': false,
    'message': 'Resource not found'
  });
});


// Start express app
server.listen(process.env.PORT || 3000);