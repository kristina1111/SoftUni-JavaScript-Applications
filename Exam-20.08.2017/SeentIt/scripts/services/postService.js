let postService = (function () {
    function prepareNewPost(dataForPost) {
        dataForPost.author = sessionHandler.getUsername();
        return dataForPost

    }

    function handleMakeNewPost(dataForPost) {
        if (validator.validateNewPost(dataForPost)) {
            let newDataForPost = prepareNewPost(dataForPost);
            return requester.post('appdata', 'posts', newDataForPost);
        }
    }

    function prepareEditNewPost(postInfo, newDataForPost) {
        postInfo.imageUrl = newDataForPost.imageUrl;
        postInfo.url = newDataForPost.url;
        postInfo.title = newDataForPost.title;
        postInfo.description = newDataForPost.description;
        return postInfo;

    }

    function handleEditPost(dataForPost, postId) {
        if (validator.validateNewPost(dataForPost)) {
            queryManager.getPostById(postId)
                .then(function (postInfo) {
                    postInfo = prepareEditNewPost(postInfo, dataForPost);
                    requester.update('appdata', 'posts/' + postId, postInfo)
                        .then(function () {
                            notificationHandler.showInfo('Post ' + context.params.title + ' updated.');
                            context.redirect('#/allPosts');
                        })
                })
                .catch(notificationHandler.handleError)
        }
    }

    function handleDeletePost(id) {
        return requester.del('appdata', 'posts/' + id);
    }


    return {
        handleMakeNewPost,
        handleEditPost,
        handleDeletePost
    }
})();