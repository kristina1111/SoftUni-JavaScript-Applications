let postService = (function () {
    function prepareNewPost(dataForPost) {
        dataForPost.author = sessionHandler.getUsername();
        return dataForPost

    }
    function handleMakeNewPost(dataForPost) {
        if(validator.validateNewPost(dataForPost)){
            let newDataForPost = prepareNewPost(dataForPost);
            return requester.post('appdata', 'posts', newDataForPost);
        }
    }

    function prepareEditNewPost(dataForPost, id) {
        if(validator.validateNewPost(dataForPost)){
            queryManager.getPostById(id)
                .then(function (postInfo) {
                    postInfo.imageUrl = dataForPost.imageUrl;
                    postInfo.url = dataForPost.url;
                    postInfo.title = dataForPost.title;
                    postInfo.description = dataForPost.description;
                    return postInfo;
                })
        }
    }

    function handleEditPost(dataForPost, postId) {
        if(validator.validateNewPost(dataForPost)){
            queryManager.getPostById(postId)
                .then(function (postInfo) {
                    postInfo.imageUrl = dataForPost.imageUrl;
                    postInfo.url = dataForPost.url;
                    postInfo.title = dataForPost.title;
                    postInfo.description = dataForPost.description;
                    requester.update('appdata', 'posts/'+postId, postInfo);
                })
                .catch(notificationHandler.handleError)
        }
    }

    function handleDeletePost(id) {
        return requester.del('appdata', 'posts/'+id);
    }


    return{
        handleMakeNewPost,
        handleEditPost,
        handleDeletePost
    }
})();