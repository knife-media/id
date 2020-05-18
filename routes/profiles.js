const express = require('express');
const onerror = require('http-errors');
const passport = require('passport');

const router = express.Router();

const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const YandexStrategy = require('passport-yandex').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const signature = require('../utils/signature');

// Require models
const models = require('../models');


// Common authenticate function
async function authenticate(req, token, refresh, profile, next) {
  try {
    let user = await models.findProfile(profile.id, profile.provider);

    if (!user) {
      // Try to create new user
      user = await models.createUser(profile.displayName, req.clientIp);

      // Insert connection to profiles table
      await models.addProfile(user, profile.id, profile.provider);
    }

    let avatar = await models.loadAvatar(profile);

    // Update profile photo if exist
    if (avatar) {
      await models.updateAvatar(avatar, user);
    }

    next(null, user);

  } catch (err) {
    next(onerror(500, 'Database returned an error', {
      'console': err.message
    }));
  }
}


passport.use(new VKontakteStrategy({
  clientID: process.env.VK_APP,
  clientSecret: process.env.VK_SECRET,
  callbackURL: process.env.VK_CALLBACK,
  passReqToCallback: true
}, authenticate));

passport.use(new FacebookStrategy({
  clientID: process.env.FB_APP,
  clientSecret: process.env.FB_SECRET,
  callbackURL: process.env.FB_CALLBACK,
  profileFields: ['id', 'displayName', 'photos'],
  passReqToCallback: true
}, authenticate));

passport.use(new YandexStrategy({
  clientID: process.env.YANDEX_APP,
  clientSecret: process.env.YANDEX_SECRET,
  callbackURL: process.env.YANDEX_CALLBACK,
  passReqToCallback: true
}, authenticate));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
  passReqToCallback: true
}, authenticate));


// Init passport in express
router.use(passport.initialize());


// Load vkontakte passport
router.get('/vkontakte', passport.authenticate('vkontakte'));

// Callback on vkontakte passport
router.get('/vkontakte/redirect', passport.authenticate('vkontakte', {
  session: false
}), signature);


// Load facebook passport
router.get('/facebook', passport.authenticate('facebook'));

// Callback on facebook passport
router.get('/facebook/redirect', passport.authenticate('facebook', {
  session: false
}), signature);

// Load yandex passport
router.get('/yandex', passport.authenticate('yandex'));

// Callback on yandex passport
router.get('/yandex/redirect', passport.authenticate('yandex', {
  session: false
}), signature);


// Load google passport
router.get('/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
}));

// Callback on google passport
router.get('/google/redirect', passport.authenticate('google', {
  session: false
}), signature);


module.exports = router;
