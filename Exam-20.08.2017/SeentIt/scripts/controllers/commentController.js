let commentController = (function () {
    function deleteComment(commentId, postId, context) {
        if (validator.isLoggedIn()) {
            commentService.deleteComment(commentId)
                .then(function () {
                    notificationHandler.showInfo('Comment deleted.');
                    context.redirect('#/comments/:' + postId);
                    postController.showPostDetails(context)
                })
        }
    }

    function handleAddCommentToPost(context) {
        if (validator.isLoggedIn()) {
            let postId = context.params.id.slice(1);
            commentService.createComment(context.params, postId)
                .then(function () {
                    notificationHandler.showInfo('Comment created.');
                    context.redirect('#/comments/:' + postId);
                })
                .catch(notificationHandler.handleError)
        } else {
            notificationHandler.showError("You should be logged in in order to see this page!")
            context.redirect('#/home')
        }
    }

    return {
        deleteComment,
        handleAddCommentToPost
    }
})();