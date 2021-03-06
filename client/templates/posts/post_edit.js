Template.postEdit.created = function() {
  Session.set('postEditErrors', {});
}

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postAttributes = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    var errors = validatePost(postAttributes);
    if(errors.title || errors.url) {
      return Session.set('postEditErrors', errors);
    }

    Meteor.call('postEdit', currentPostId, postAttributes, function(error, result) {
      if(error) {
        throwError(error.reason);
      }

      if(!result.isOwner) {
        throwError("You cannot edit another user's post");
      } else if(result.urlExists) {
        throwError('This link has already been posted.');
      }
      
      Router.go('postPage', {_id: currentPostId});
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      Posts.remove(this._id);
      Router.go('postsList');
    }
  }
});