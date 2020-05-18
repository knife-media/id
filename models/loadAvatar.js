const mime = require('mime-types');
const fetch = require('node-fetch');
const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');

async function loadAvatar(profile) {
  let avatar = null;

  if (profile.photos && profile.photos[0].value) {
    // Try to fetch remote image
    const res = await fetch(profile.photos[0].value);

    // Set avatar filename
    avatar = uuid() + '.' + mime.extension(res.headers.get('content-type'));

    // Download avatar
    res.body.pipe(fs.createWriteStream(__dirname + '/../avatars/' + avatar));
  }

  return avatar;
}

module.exports = loadAvatar;