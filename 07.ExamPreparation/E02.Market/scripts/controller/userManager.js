let userManager = (function () {
    function handleLogin(dataForLogin) {
        // some validation
        if (!validator.validateUsername(dataForLogin.username)) {
            return;
        }
        return authenticator.login(dataForLogin);
    }

    function handleLogout() {
        return authenticator.logout();
    }

    function successLogout() {
        sessionHandler.destroySessionForUser();
        notificationHandler.showInfo("You successfully logged out!");
        viewManager.manageHeader();
    }

    function handleRegister(dataForRegister) {
        // some validation
        if (!validator.validateUsername(dataForRegister.username)) {
            return;
        }
        if (!validator.validatePassword(dataForRegister.password)) {
            return;
        }

        dataForRegister.cart = {};
        // return promise
        return authenticator.register(dataForRegister);

    }

    function successLogin(data) {
        sessionHandler.saveSessionForUser(data._kmd.authtoken, data._id, data.username, data.name);
        notificationHandler.showInfo("Hello " + sessionHandler.getUsername());
        viewManager.manageHeader();
        return true;
    }

    function handleChangingTeam(userDataFromDb, teamId) {
        let userData = userDataFromDb;
        userData.teamId = teamId;
        return requester.update('user', sessionHandler.getUserId(), userData);
    }

    return {
        handleLogin,
        handleLogout,
        handleRegister,
        successLogin,
        successLogout,
        handleChangingTeam
    }


})();