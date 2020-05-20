const mime = require('mime-types');
const fetch = require('node-fetch');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

async function loadAvatar(profile) {
  let avatar = null;

  if (profile.photos && profile.photos[0].value) {
    // Try to fetch remote image
    const res = await fetch(profile.photos[0].value);

    // Get extension from headers
    const extension = mime.extension(res.headers.get('content-type'));

    // Set avatar filename
    avatar = crypto.randomBytes(16).toString('hex') + '.' + extension;

    // Create subdir based on file name
    const directory = path.join('avatars', avatar.substring(0, 2));

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, {
        recursive: true
      });
    }

    // Download avatar
    res.body.pipe(fs.createWriteStream(path.join(directory, avatar)));
  }

  return avatar;
}

module.exports = loadAvatar;