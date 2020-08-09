const ownership = (comments, user) => {
  // Set self field for comments
  comments = comments.map(item => {
    if (parseInt(user) === item.user_id) {
      item.self = 1;
    }

    return item;
  });

  return comments;
}

module.exports = ownership;