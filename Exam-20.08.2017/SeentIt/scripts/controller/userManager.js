let userManager = (function () {
    function handleLogin(dataForLogin) {
        // some validation
        if (dataForLogin.username == '') {
            notificationHandler.showError("Please enter valid username");
            return;
        }
        if (dataForLogin.password == '') {
            notificationHandler.showError("Please enter your password");
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

        console.dir(dataForRegister);
        // some validation
        if (!validator.validateUsername(dataForRegister.username)) {
            console.log("YESS");
            return;
        }
        if (!validator.validatePassword(dataForRegister.password, dataForRegister.repeatPass)) {
            console.log("YESS");
            return;
        }
        delete dataForRegister.repeatPass;
        // return promise
        return authenticator.register(dataForRegister);

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
        successRegister,
        handleChangingTeam
    }


})();