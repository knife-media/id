const express = require('express');
const onerror = require('http-errors');
const router = express.Router();

const ownership = require('../utils/ownership');
const sanitize = require('../utils/sanitize');

// Require models
const models = require('../models');


// Get comments
router.get('/', async (req, res, next) => {
  let post = req.query.post || '';

  if (!post.match(/^\d+$/)) {
    return next(onerror(400, 'Post parameter wrong format'));
  }

  let result = {};

  try {
    let comments = await models.findByPost(post);

    if (req.user) {
      // Add comments vote
      comments = await models.appendVotes(comments, req.user);

      // Add self property
      comments = ownership(comments, req.user);

      // Get user identity
      let identity = await models.getIdentity(req.user);

      if (identity) {
        result.identity = identity;
      }
    }

    // Sanitize comments
    result.comments = sanitize(comments);

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


// Post new comment
router.post('/', async (req, res, next) => {
  let post = req.query.post || '';

  // Check post
  if (!post.match(/^\d+$/)) {
    return next(onerror(400, 'Post parameter wrong format'));
  }

  let parent = req.query.parent || '';

  // Check parent format
  if (!parent.match(/^\d+$/)) {
    parent = null;
  }

  let content = req.body.content || '';

  // Check content length
  if (content.length < 1) {
    return next(onerror(400, 'Content parameter is empty'));
  }

  let result = {};

  try {
    let id = await models.addComment(parent, post, req.user, req.clientIp, content);

    // Get comment fields
    let comments = await models.findComment(id);

    // Add self property
    comments = ownership(comments, req.user);

    // Sanitize comments before output
    result.comments = sanitize(comments);

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


// Delete comment
router.delete('/:comment([0-9]+)', async (req, res, next) => {
  try {
    await models.deleteComment(req.params.comment, req.user);

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