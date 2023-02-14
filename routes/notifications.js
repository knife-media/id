const express = require('express');
const onerror = require('http-errors');
const router = express.Router();
const striptags = require('striptags');

// Require models
const models = require('../models');


// Get user's notifications
router.get('/', async (req, res, next) => {
  if (!req.auth) {
    return next(onerror(401, 'Access denied for unauthorized requests'));
  }

  let result = {};

  try {
    result = await models.findNotifications(req.auth);

    result.map(v => {
      v.title = striptags(v.title);
    });

    res.status(200).json({
      'success': true,
      'result': result
    });
  } catch (err) {
    next(onerror(500, 'Database returned an error', {
      'console': err.message
    }));
  }
});


// Set notification viewed
router.post('/', async (req, res, next) => {
  let comments = req.body.comments || [];

  try {
    for (let i = 0; i < comments.length; i++) {
      let comment = String(comments[i]);

      if (comment.match(/^\d+$/)) {
        await models.setNotification(comment, req.auth)
      }
    }

    res.status(200).json({
      'success': true
    });
  } catch (err) {
    next(onerror(500, 'Database returned an error', {
      'console': err.message
    }));
  }
});


module.exports = router;
