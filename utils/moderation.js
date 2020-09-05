const got = require('got')

const moderation = async (id, post, content) => {
  // Check all required options
  let options = ['SHORT_URL', 'TELEGRAM_TOKEN', 'TELEGRAM_CHAT'];

  for (let i = 0; i < options.length; i++) {
    let option = options[i];

    if (process.env[option] === undefined) {
      return false;
    }
  }

  // List of badwords regex
  let badwords = ['https?:', '@', '[0-9]{8,}'];

  // Try to find badwords in comment
  for (let i = 0; i < badwords.length; i++) {
    let regex = new RegExp(badwords[i], 'ig');

    if (regex.test(content)) {
      break;
    }

    return false;
  }


  try {
    let link = process.env.SHORT_URL + post;

    // Get redirect urls array
    let urls = await got(link);

    if (urls.redirectUrls.length > 0) {
      link = urls.redirectUrls[urls.redirectUrls.length - 1];
    }

    link = link + '#comment-' + id;

    // Try to send comment to Telegram
    await got.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      json: {
        'chat_id': process.env.TELEGRAM_CHAT,
        'text': [content, link].join("\n\n"),
        'disable_web_page_preview': 1
      }
    });

  } catch (error) {
    console.error(error);
  }
}

module.exports = moderation;