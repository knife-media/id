const express = require('express');
const onerror = require('http-errors');
const router = express.Router();

// Require models
const models = require('../models');


// Set vote for comment
router.post('/', async (req, res, next) => {
  let comment = req.query.comment || '';

  if (!comment.match(/^\d+$/)) {
    return next(onerror(400, 'Comment parameter wrong format'));
  }

  let vote = req.query.vote || '';

  if (!['plus', 'minus'].includes(vote)) {
    return next(onerror(400, 'Wrong vote parameter'));
  }

  try {
    await models.setRating(comment, vote, req.user);

    res.status(200).json({
      'success': true
    });
  } catch (err) {
    next(onerror(500, 'Database returned an error', {
      'console': err.message
    }));
  }
});


// Delete vote for comment
router.delete('/', async (req, res, next) => {
  let comment = req.query.comment || '';

  if (!comment.match(/^\d+$/)) {
    return next(onerror(400, 'Comment parameter wrong format'));
  }

  try {
    await models.deleteRating(comment, req.user);

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