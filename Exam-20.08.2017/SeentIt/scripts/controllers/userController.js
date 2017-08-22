let userController = (function () {
    function handleLogin(context) {
        // some validation
        let dataForLogin = context.params;
        if (dataForLogin.username == '') {
            notificationHandler.showError("Please enter valid username");
            return;
        }
        if (dataForLogin.password == '') {
            notificationHandler.showError("Please enter your password");
            return;
        }

        authenticator.login(dataForLogin)
            .then(function (userData) {
                successLogin(userData);
                context.username = sessionHandler.getUsername();
                context.redirect('#/allPosts')
            })
            .catch(notificationHandler.handleError);
    }

    function handleLogout(context) {
        authenticator.logout()
            .then(function () {
                successLogout();
                context.redirect('#/home');
            })
            .catch(notificationHandler.handleError);
    }

    function successLogout() {
        sessionHandler.destroySessionForUser();
        notificationHandler.showInfo("You successfully logged out!");
        viewManager.manageHeader();
    }

    function handleRegister(context) {
        let dataForRegister = context.params;
        // some validation
        if (!validator.validateUsername(dataForRegister.username)) {
            return;
        }
        if (!validator.validatePassword(dataForRegister.password, dataForRegister.repeatPass)) {
            return;
        }
        delete dataForRegister.repeatPass;

        authenticator.register(dataForRegister)
            .then(function (newUserInfo) {
                successRegister(newUserInfo);
                context.username = newUserInfo.username;
                context.redirect('#/allPosts');
            })
            .catch(notificationHandler.handleError);

    }

    function successRegister(data) {
        sessionHandler.saveSessionForUser(data._kmd.authtoken, data._id, data.username, data.name);
        notificationHandler.showInfo("User registration successful.");
        viewManager.manageHeader();
    }

    function successLogin(data) {
        sessionHandler.saveSessionForUser(data._kmd.authtoken, data._id, data.username, data.name);
        notificationHandler.showInfo("Login successful.");
        viewManager.manageHeader();
    }

    return {
        handleLogin,
        handleLogout,
        handleRegister,
    }


})();