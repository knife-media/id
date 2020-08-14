const express = require('express');
const onerror = require('http-errors');
const router = express.Router();

// Require models
const models = require('../models');


// Common authorize function
async function authorize(req, res, next) {
  if (!req.user) {
    return next(onerror(401, 'Access denied for unauthorized requests'));
  }

  try {
    // Get user status
    let status = await models.userStatus(req.user);

    if (status === 'active') {
      return next();
    }

    return next(onerror(403, 'Your profile was banned. Please contact us to unblock'));

  } catch (err) {
    next(onerror(500, 'Database returned an error', {
      'console': err.message
    }));
  }
}

// Forced authorization not readonly methods
router.put('*', authorize);
router.post('*', authorize);
router.delete('*', authorize);


module.exports = router;