$(()=> {
    let app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

// ------------------------- HOME PAGE --------------------------------------
        this.get('index.html', function (context) {
            context.username = sessionHandler.getUsername();
            context.partial('./templates/app/home.hbs');
        });
        this.get('#/home', function (context) {
            context.username = sessionHandler.getUsername();
            context.partial('./templates/app/home.hbs');
        });
// ------------------------- REGISTER PAGE --------------------------------------
        this.get('#/register', function () {
            this.partial('./templates/userAuthentication/register.hbs')
        });

        this.post('#/register', function (context) {
            userManager.handleRegister(context.params)
                .then(function (data) {
                    userManager.successLogin(data);
                    // context.username = sessionHandler.getUsername();
                    // context.partial('./templates/app/home.hbs');
                    context.redirect('#/home');
                })
                .catch(notificationHandler.handleError)

        });

// ------------------------- LOGIN PAGE --------------------------------------
        this.get('#/login', function () {
            this.partial('./templates/userAuthentication/login.hbs')
        });

        this.post('#/login', function (context) {
            userManager.handleLogin(context.params)
                .then(function (data) {
                    userManager.successLogin(data);
                    context.redirect('#/home');
                })
                .catch(notificationHandler.handleError)
        });

// ------------------------- LOGOUT PAGE --------------------------------------
        this.get('#/logout', function () {
            userManager.handleLogout();
            this.redirect('#/home');
        });

// ------------------------- SEND MESSAGE PAGE --------------------------------------
        this.get('#/sendMessage', function (context) {
            queryManager.getAllUsers()
                .then(function (data) {
                    context.users = data;
                    context.partial('./templates/user/sendMessage.hbs');
                })
                .catch(notificationHandler.handleError)
        });

        this.post('#/sendMessage', function (context) {
            console.dir(context.params);
            messageService.handleSendMessage(context.params)
                .then(function () {
                    notificationHandler.showInfo("Message sent!");

                    context.redirect('#/home');
                })
                .catch(notificationHandler.handleError)
        });
// ------------------------- SENT MESSAGES PAGE --------------------------------------
        this.get('#/sentMessages', function (context) {
            queryManager.getAllSentMessagesBySenderUsername(sessionHandler.getUsername())
                .then(function (messages) {
                    context.messages = messages;
                    context.partial('./templates/user/sentMessages.hbs')
                        .then(function () {
                            $('button').on('click', function (e) {
                                let btn = $(e.target);
                                messageService.handleDeleteMessage(btn.attr('data-id'))
                                    .then(function () {
                                        notificationHandler.showInfo('You successfully deleted this message!');
                                        btn.parent().parent().remove();
                                    })
                                    .catch(notificationHandler.handleError)
                            })
                        })
                })
        });
// ------------------------- RECEIVED MESSAGES PAGE --------------------------------------
        this.get('#/receivedMessages', function (context) {
            queryManager.getAllReceivedMessagesByRecipientUsername(sessionHandler.getUsername())
                .then(function (messages) {
                    console.dir(messages);
                    context.messages = messages;
                    context.partial('./templates/user/receivedMessages.hbs')
                })
        })

    });

    viewManager.manageHeader();
    app.run();
    viewManager.manageFooter();


});