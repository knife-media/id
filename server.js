/**
 * Social services for knife.media
 *
 * @author Anton Lukin
 * @license MIT
 * @version 1.0.0
 */

const express = require('express');
const request = require('request-ip');
const cookies = require('cookie-parser');
const {expressjwt: jwt} = require('express-jwt');

const server = express();

// Require settings
require('dotenv').config();

// Require comments router
const routes = require('./routes');

// Add translates for messages
const locale = require('./locales/ru.json');

/// Hide specific Express header
server.disable('x-powered-by');

// Set request ip middleware
server.use(request.mw());

// Parse json requests
server.use(express.json());

// Parse cookies
server.use(cookies());


// Get user from jwt
server.use(jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
  algorithms: ['HS256'],
  getToken: req => req.cookies.signature
}));


// Skip wrong JWT token error
server.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    next();
  }
});


// Set avatars serve-static
server.use('/id/avatars', express.static('avatars'));

// Set logout route first
server.post('/id/logout', (req, res) => {
  res.clearCookie('signature');

  res.status(200).json({
    'success': true
  });
});

// Check is user can make requests
server.use(routes.users);

// Use comments router
server.use('/id/comments', routes.comments);

// Use profiles router
server.use('/id/profiles', routes.profiles);

// Use ratings router
server.use('/id/ratings', routes.ratings);

// Use notifications router
server.use('/id/notifications', routes.notifications);


// Show server error
server.use((err, req, res, next) => {
  let message = err.message || 'Server internal error';

  res.status(err.status || 500).json({
    'success': false,
    'message': locale[message] || message
  });

  if (err.console) {
    console.error(err.console);
  }
});


// Last error handler
server.use((req, res) => {
  let message = 'Resource not found';

  res.status(404).json({
    'success': false,
    'message': locale[message]
  });
});


// Start express app
server.listen(process.env.PORT || 3000);
