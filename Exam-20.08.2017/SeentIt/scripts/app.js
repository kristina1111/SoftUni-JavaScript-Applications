$(()=> {
    let app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

// ------------------------- HOME PAGE -------------------------------------
        this.get('index.html', function (context) {
            if (validator.isLoggedIn()) {
                context.redirect('#/allPosts')
            } else {
                context.username = sessionHandler.getUsername();
                this.loadPartials({
                    navigation: './templates/common/menuPartial.hbs'
                }).then(function () {
                    context.partials = this.partials;
                    context.partial('./templates/userAuth/authenticatePage.hbs');
                })
            }


        });

        this.get('#/home', function (context) {
            if (validator.isLoggedIn()) {
                context.redirect('#/allPosts')
            } else {
                context.username = sessionHandler.getUsername();
                this.loadPartials({
                    navigation: './templates/common/menuPartial.hbs'
                }).then(function () {
                    context.partials = this.partials;
                    context.partial('./templates/userAuth/authenticatePage.hbs');
                })
            }
        });
// ------------------------- LOGIN -----------------------------------------

        this.post('#/login', function (context) {
            userManager.handleLogin(context.params)
                .then(function (userData) {
                    userManager.successLogin(userData);
                    context.username = sessionHandler.getUsername();
                    context.redirect('#/allPosts')
                })
                .catch(notificationHandler.handleError)
        });


// // ------------------------- REGISTER -----------------------------------------

        this.post('#/register', function (context) {
            Promise.all([userManager.handleRegister(context.params)])
                .then(function ([newUserInfo]) {
                    userManager.successRegister(newUserInfo);
                    context.username = newUserInfo.username;
                    context.redirect('#/allPosts');
                })
                .catch(notificationHandler.handleError)
        });

// // ----------------------- LOGOUT ----------------------------------------
        this.get('#/logout', function (context) {
            userManager.handleLogout()
                .then(function () {
                    Promise.all([userManager.successLogout()]).then(function () {
                        context.redirect('#/home')
                    });

                })
                .catch(notificationHandler.handleError)
        });
// -------------------- VIEW ALL POSTS PAGE -------------------------------------

        this.get('#/allPosts', function (context) {
            if (validator.isLoggedIn()) {
                showAllPosts(context);
            } else {
                context.redirect('#/home')
            }

        });


//    ------------------- CREATE POST ---------------------------------------

        this.get('#/createPost', function (context) {
            if (validator.isLoggedIn()) {
                context.username = sessionHandler.getUsername();
                this.loadPartials({
                    navigation: './templates/common/menuPartial.hbs'
                }).then(function () {
                    context.partials = this.partials;
                    context.partial('./templates/posts/createPost.hbs');
                    $('#btnSubmitPost').on('click', function (e) {
                        $(e.target).preventDefault()
                    })
                })
            } else {
                notificationHandler.showError("You should be logged in in order to see this page!")
                context.redirect('#/home')
            }

        });

        this.post('#/createPost', function (context) {
            postService.handleMakeNewPost(context.params)
                .then(function () {
                    notificationHandler.showInfo('Post created.');
                    context.redirect('#/allPosts');
                })
                .catch(notificationHandler.handleError);
        });

// --------------------------------- EDIT POST ----------------------------------------------
        this.get('#/editPost/:id', function (context) {
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
                            $('#btnEditPost').on('click', function (e) {
                                $(e.target).preventDefault()
                            })
                        })

                    })
                    .catch(notificationHandler.handleError);
            } else {
                notificationHandler.showError("You should be logged in in order to see this page!")
                context.redirect('#/home')
            }
        });


        this.post('#/editPost/:id', function (context) {
            // this all logic shouldn't be here but for now is working only when it's here !!!

            let postId = context.params.id.slice(1);
            let dataForPost = context.params;
            if (validator.validateNewPost(dataForPost)) {
                queryManager.getPostById(postId)
                    .then(function (postInfo) {
                        postInfo.imageUrl = dataForPost.imageUrl;
                        postInfo.url = dataForPost.url;
                        postInfo.title = dataForPost.title;
                        postInfo.description = dataForPost.description;
                        requester.update('appdata', 'posts/' + postId, postInfo)
                            .then(function () {
                                notificationHandler.showInfo('Post ' + context.params.title + ' updated.');
                                context.redirect('#/allPosts');
                                showAllPosts(context);

                            })
                    })
                    .catch(notificationHandler.handleError)
            }
        });


//  ----------------------------- DELETE POST ----------------------------------------
        this.get('#/deletePost/:id', function (context) {
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
        });


//  ------------------------ VIEW MY POSTS ------------------------------------------------------

        this.get('#/myPosts', function (context) {
            queryManager.getPostsByAuthor(sessionHandler.getUsername())
                .then(function (posts) {
                    context.posts = posts;
                    showMyPosts(context);
                })
        });


//  -------------------- VIEW DETAILS FOR POST --------------------------------------------------

        this.get('#/comments/:id', function (context) {
            if (validator.isLoggedIn()) {
                showPostDetails(context);

            } else {
                notificationHandler.showError("You should be logged in in order to see this page!")
                context.redirect('#/home')
            }
        });

//  ----------------------- ADD COMMENT TO POST -------------------------------------
        this.post('#/comment/:id', function (context) {
                if (validator.isLoggedIn()) {
                    let postId = context.params.id.slice(1);
                    commentService.createComment(context.params, postId)
                        .then(function (data) {
                            // console.dir(data);
                            notificationHandler.showInfo('Comment created.');
                            context.redirect('#/comments/:' + postId);

                        })

                } else {
                    notificationHandler.showError("You should be logged in in order to see this page!")
                    context.redirect('#/home')
                }
            }
        );

//         not done!!!
//         delete all comments of the deleted post


    });


    function showAllPosts(context, templateName) {
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

//  --------------------- DELETE COMMENT ---------------------------------------------

    function deleteComment(commentId, postId, context) {
        if (validator.isLoggedIn()) {
            commentService.deleteComment(commentId)
                .then(function () {
                    notificationHandler.showInfo('Comment deleted.');
                    context.redirect('#/comments/:' + postId);
                    showPostDetails(context)
                })
        }
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
                                deleteComment(commentId, postId, context);
                                showPostDetails(context);
                            });

                            // $('#btnPostComment').on('click', function (e) {
                            //     $(e.target).preventDefault();
                            // })
                        });

                })
            })
    }

    viewManager.manageHeader();
    app.run();
    viewManager.manageFooter();


});