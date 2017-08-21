let validator = (function () {
    const usernamePattern = /^[a-zA-Z]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,15}$/;
    function validateUsername(username) {
        let isValid = true;
        if(!usernamePattern.test(username)){
            notificationHandler.showError("Username must consists of latin letters only!");
            isValid = false;
        }
        if(username.length <4 || username.length > 15){
            notificationHandler.showError("Username must be between 4 and 15 symbols long!");
            isValid = false;
        }
        return isValid
    }

    function validatePassword(password) {
        let isValid = true;
        if(!passwordPattern.test(password)){
            isValid = false;
            notificationHandler.showError("Password must contain letters and numbers and must be between 4 and 15 symbols long!")
        }
        return isValid;

    }

    return {
        validateUsername,
        validatePassword
    }
})();