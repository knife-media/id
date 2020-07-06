const express = require('express');
const onerror = require('http-errors');
const striptags = require('striptags');
const router = express.Router();

// Require models
const models = require('../models');


// Get comments
router.get('/', async (req, res, next) => {
  let post = req.query.post || '';

  if (!post.match(/^\d+$/)) {
    return next(onerror(400, 'Post parameter wrong format'));
  }

  try {
    let fields = [];

    if (req.user) {
      fields = await models.findForUser([req.user, req.user, post]);
    } else {
      fields = await models.findByPost([post]);
    }

    res.status(200).json({
      'success': true,
      'fields': fields
    });
  } catch (err) {
    next(onerror(500, 'Database returned an error', {
      'console': err.message
    }));
  }
});


// Post new comment
router.post('/', async (req, res, next) => {
  if (!req.user) {
    return next(onerror(401, 'Access denied for unauthorized requests'));
  }

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

  let content = req.query.content || '';

  // Strip html tags
  content = striptags(content);

  if (content.length < 1) {
    return next(onerror(400, 'Content parameter is empty'));
  }

  try {
    let comment = await models.addComment(parent, post, req.user, req.clientIp, content);

    // Get comment fields
    let fields = await models.findComment(comment);

    res.status(200).json({
      'success': true,
      'fields': fields
    });
  } catch (err) {
    next(onerror(500, 'Database returned an error', {
      'console': err.message
    }));
  }
});


// Edit comment
router.put('/:comment([0-9]+)', async (req, res, next) => {
  if (!req.user) {
    return next(onerror(401, 'Access denied for unauthorized requests'));
  }

  let content = req.query.content || '';

  // Strip html tags
  content = striptags(content);

  if (content.length < 1) {
    return next(onerror(400, 'Content parameter is empty'));
  }

  try {
    await models.editComment(content, req.params.comment, req.user);

    res.status(200).json({
      'success': true
    });
  } catch (err) {
    next(onerror(500, 'Database returned an error', {
      'console': err.message
    }));
  }
});


// Delete comment
router.delete('/:comment([0-9]+)', async (req, res, next) => {
  if (!req.user) {
    return next(onerror(401, 'Access denied for unauthorized requests'));
  }

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
