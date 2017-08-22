$(()=> {
    let app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

// ------------------------- HOME PAGE -----------------------------------------
        this.get('index.html', homeController.getHomePage);
        this.get('#/home', homeController.getHomePage);

// ------------------------- LOGIN ---------------------------------------------
        this.post('#/login', userController.handleLogin);

// ------------------------- REGISTER ------------------------------------------
        this.post('#/register', userController.handleRegister);

// ----------------------- LOGOUT ----------------------------------------------
        this.get('#/logout', userController.handleLogout);

// -------------------- VIEW ALL POSTS PAGE ------------------------------------
        this.get('#/allPosts', postController.handleShowAllPosts);

//    ------------------- CREATE POST ------------------------------------------
        this.get('#/createPost', postController.showCreatePostView);
        this.post('#/createPost', postController.handleCreatePost);

// --------------------------------- EDIT POST ---------------------------------
        this.get('#/editPost/:id', postController.showEditPostView);
        this.post('#/editPost/:id', postController.handleEditPost);

//  ----------------------------- DELETE POST ----------------------------------
        this.get('#/deletePost/:id', postController.handleDeletePost);

//  ------------------------ VIEW MY POSTS -------------------------------------
        this.get('#/myPosts', postController.handleShowMyPosts);

//  -------------------- VIEW DETAILS FOR POST ---------------------------------

        this.get('#/comments/:id', postController.handleShowPostDetails);

//  ----------------------- ADD COMMENT TO POST -------------------------------------
        this.post('#/comment/:id', commentController.handleAddCommentToPost);

//  delete all comments of the deleted post!

    });

    viewManager.manageHeader();
    viewManager.manageFooter();
    app.run();



});