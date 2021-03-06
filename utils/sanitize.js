const autolinker = require('autolinker');
const striptags = require('striptags');

const sanitize = (comments) => {
  comments = comments.map(item => {
    delete item.user_id;

    if (item.status === 'removed') {
      return item;
    }

    // Just set proper type to integers
    item.plus = parseInt(item.plus);
    item.minus = parseInt(item.minus);

    // Sanitize name
    item.name = striptags(item.name);

    // First strip all tags
    item.content = striptags(item.content);

    // Then add autolinks to links
    item.content = autolinker.link(item.content, {
      replaceFn: (match) => {
        let tag = match.buildTag();
        tag.setAttr('rel', 'nofollow noopener');

        return tag;
      }
    });

    return item;
  });

  return comments;
}

module.exports = sanitize;