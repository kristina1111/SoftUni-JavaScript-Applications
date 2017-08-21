let commentService = (function () {
    function createComment(commentInfo, postId) {
        if(commentInfo.content.length >2){
            let newComment = {
                content : commentInfo.content,
                postId : postId,
                author : sessionHandler.getUsername()
            };
            return requester.post('appdata', 'comments', newComment);
        }else{
            notificationHandler.showError("Comment must be at least 2 symbols long!");
        }
    }

    function deleteComment(commentId) {
        return requester.del('appdata', 'comments/' + commentId);
    }

    return {
        createComment,
        deleteComment
    }
})()