$(()=> {
    let app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

// ------------------------- HOME PAGE -------------------------------------
        this.get('index.html', function (context) {
            context.username = sessionHandler.getUsername();
            context.partial('./templates/app/home.hbs');
        });

        this.get('#/home', function (context) {
            context.username = sessionHandler.getUsername();
            context.partial('./templates/app/home.hbs');
        });
// ------------------------- LOGIN -----------------------------------------

        this.get('#/login', function () {
            this.partial('./templates/userAuth/login.hbs')
        });

        this.post('#/login', function (context) {
            userManager.handleLogin(context.params)
                .then(function (userData) {
                    userManager.successLogin(userData);
                    context.redirect('#/home')
                })
                .catch(notificationHandler.handleError)
        });


// ------------------------- REGISTER -----------------------------------------

        this.get('#/register', function () {
            this.partial('./templates/userAuth/register.hbs')
        });

        this.post('#/register', function (context) {
            userManager.handleRegister(context.params)
                .then(function (newUserInfo) {
                    // Promise.all([userManager.successLogin(newUserInfo)])
                    //     .then(function () {
                    userManager.successLogin(newUserInfo);
                    context.username = newUserInfo.username;
                    context.redirect('#/home');
                    // });
                })
                .catch(notificationHandler.handleError)
        });

// ----------------------- LOGOUT ----------------------------------------
        this.get('#/logout', function (context) {
            userManager.handleLogout()
                .then(function () {
                    userManager.successLogout();
                    context.redirect('#/home')
                })
                .catch(notificationHandler.handleError)
        });

// ----------------------- SHOP PRODUCTS PAGE ------------------------------
        
        this.get('#/allProducts', function (context) {
            queryManager.getAllProducts()
                .then(function (products) {
                    context.products = products;
                    context.partial('./templates/products/allProducts.hbs')
                        .then(function () {
                            $('#viewListAds button').on('click', function (e) {
                                let productId = $(e.target).attr('data-id');
                                shoppingService.handleAddInCart(productId);
                            })
                        })
                })
        });

// ----------------------- VIEW CART PAGE ------------------------------
        this.get('#/viewCart', function (context) {
            queryManager.getUser(sessionHandler.getUserId())
                .then(function (userInfo) {
                    context.products = userInfo.cart;
                    console.dir(context.products);
                    context.partial('./templates/products/cart.hbs')
                        .then(function () {
                            $('#cartProducts table button').on('click', function (e) {
                                let btn = $(e.target);
                                Promise.all([shoppingService.handleRemoveFromCart(btn.attr('data-id'))])
                                    .then(function () {
                                        notificationHandler.showInfo('You successfully removed this product from your cart')
                                        btn.parent().parent().remove();
                                    })

                            })
                        });
                })
                .catch(notificationHandler.handleError)
        })


    });

    viewManager.manageHeader();
    app.run();
    viewManager.manageFooter();


});