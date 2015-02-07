Posts = new Mongo.Collection('posts');

Posts.allow({
  remove: function (userId, post) {
    return ownsDocument(userId, post);
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({
      url: postAttributes.url
    });

    if(postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      };
    }

    var user = Meteor.user()
      , post = _.extend(postAttributes, {
          userId: user._id,
          auther: user.username,
          submitted: new Date()
        })
      , postId = Posts.insert(post);

    return {
      _id: postId
    };
  },
  postEdit: function(postId, postAttributes) {
    var user = Meteor.user();
    var isOwner = ownsDocument(user._id, Posts.findOne({
      _id: postId
    }));
    var returnObject = {
      isOwner: isOwner
    };

    if(!isOwner) {
      return returnObject;
    }

    check(postAttributes, {
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({
      url: postAttributes.url,
      _id: {$ne: postId}
    });

    if(postWithSameLink) {
      returnObject.urlExists = true;
      return returnObject;
    }

    var post = {
      url: postAttributes.url,
      title: postAttributes.title,
      edited: new Date()
    };

    Posts.update(postId, {$set: post});

    returnObject.updated = true;

    return returnObject;
  }
});
