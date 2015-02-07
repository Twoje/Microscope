Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postAttributes = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }    

    Meteor.call('postEdit', currentPostId, postAttributes, function(error, result) {
      if(error) {
        return alert(error.reason);
      }

      if(!result.isOwner) {
        alert("You cannot edit another user's post");
      } else if(result.urlExists) {
        alert('This link has already been posted.');
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