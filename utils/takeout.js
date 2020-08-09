const ignore = ['content', 'name', 'avatar', 'plus', 'minus', 'self'];

/**
 * Hide removed comments
 */
const takeout = (comments) => {
  let fields = [];

  comments.forEach(item => {
    if (item.status === 'removed') {
      // Skip items w/out visible children
      if (!comments.find(key => key.parent === item.id && key.status === 'visible')) {
        return;
      }

      // Remove optional fields for others
      ignore.forEach(key => {
        delete item[key];
      });
    }

    fields.push(item);
  });

  return fields;
}

module.exports = takeout;