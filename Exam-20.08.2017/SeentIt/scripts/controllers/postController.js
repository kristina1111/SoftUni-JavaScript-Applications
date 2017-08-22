let postController = (function () {
    function handleShowAllPosts(context) {
        if (validator.isLoggedIn()) {
            showAllPosts(context);
        } else {
            context.redirect('#/home')
        }
    }

    function showCreatePostView(context) {
        if (validator.isLoggedIn()) {
            context.username = sessionHandler.getUsername();
            this.loadPartials({
                navigation: './templates/common/menuPartial.hbs'
            }).then(function () {
                context.partials = this.partials;
                context.partial('./templates/posts/createPost.hbs');
            })
        } else {
            notificationHandler.showError("You should be logged in in order to see this page!");
            context.redirect('#/home')
        }
    }

    function showEditPostView(context) {
        if (validator.isLoggedIn()) {
            let postId = context.params.id.slice(1);
            queryManager.getPostById(postId)
                .then(function (postData) {
                    context.post = postData;
                    context.loadPartials({
                        navigation: './templates/common/menuPartial.hbs'
                    }).then(function () {
                        context.partials = this.partials;
                        context.partial('./templates/posts/editPost.hbs');
                    })

                })
                .catch(notificationHandler.handleError);
        } else {
            notificationHandler.showError("You should be logged in in order to see this page!")
            context.redirect('#/home')
        }
    }

    function handleCreatePost(context) {
        postService.handleMakeNewPost(context.params)
            .then(function () {
                notificationHandler.showInfo('Post created.');
                context.redirect('#/allPosts');
            })
            .catch(notificationHandler.handleError);
    }

    function handleEditPost(context) {
        let postId = context.params.id.slice(1);
        let dataForPost = context.params;
        postService.handleEditPost(dataForPost, postId);
    }

    function handleDeletePost(context) {
        if (validator.isLoggedIn()) {
            let postId = context.params.id.slice(1);
            postService.handleDeletePost(postId)
                .then(function () {
                    notificationHandler.showInfo('Post deleted.');
                    context.redirect('#/allPosts');
                    showAllPosts(context);
                })

        } else {
            notificationHandler.showError("You should be logged in in order to see this page!")
            context.redirect('#/home')
        }
    }

    function handleShowMyPosts(context) {
        queryManager.getPostsByAuthor(sessionHandler.getUsername())
            .then(function (posts) {
                context.posts = posts;
                showMyPosts(context);
            })
            .catch(notificationHandler.handleError)
    }

    function handleShowPostDetails(context) {
        if (validator.isLoggedIn()) {
            showPostDetails(context);

        } else {
            notificationHandler.showError("You should be logged in in order to see this page!")
            context.redirect('#/home')
        }
    }

    function showAllPosts(context) {
        context.loadPartials({
            navigation: './templates/common/menuPartial.hbs'
        }).then(function () {
            context.partials = this.partials;
            context.username = sessionHandler.getUsername();

            // all posts
            queryManager.getAllPosts()
                .then(function (posts) {
                    context.posts = posts;
                    context.partial('./templates/posts/viewAll.hbs')
                }).catch(notificationHandler.handleError)
        })
    }

    function showMyPosts(context) {
        context.loadPartials({
            navigation: './templates/common/menuPartial.hbs'
        }).then(function () {
            context.partials = this.partials;
            context.username = sessionHandler.getUsername();

            // my posts
            queryManager.getPostsByAuthor(sessionHandler.getUsername())
                .then(function (posts) {
                    context.posts = posts;
                    context.partial('./templates/posts/viewMy.hbs')
                }).catch(notificationHandler.handleError)
        })
    }

    function showPostDetails(context) {
        let postId = context.params.id.slice(1);
        let postPromise = queryManager.getPostById(postId);
        let commentsPromise = queryManager.getAllCommentsByPostId(postId);
        Promise.all([postPromise, commentsPromise])
            .then(function ([post, comments]) {
                context.post = post;
                context.comments = comments;
                context.username = sessionHandler.getUsername();
                context.loadPartials({
                    navigation: './templates/common/menuPartial.hbs'
                }).then(function () {
                    context.partials = this.partials;
                    context.partial('./templates/posts/viewDetails.hbs')
                        .then(function () {
                            $('.deleteLink[data-post-id=' + postId + ']').on('click', function (e) {
                                let commentId = $(e.target).attr('data-comment-id');
                                let postId = $(e.target).attr('data-post-id');
                                commentController.deleteComment(commentId, postId, context);
                                showPostDetails(context);
                            });
                        });

                })
            })
    }

    return {
        handleShowAllPosts,
        showCreatePostView,
        handleCreatePost,
        showEditPostView,
        handleEditPost,
        handleDeletePost,
        handleShowMyPosts,
        showPostDetails,
        handleShowPostDetails
    }
})();