let validator = (function () {
    const usernamePattern = /^[a-zA-Z]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    function validateUsername(username) {
        let isValid = true;
        if(!usernamePattern.test(username)){
            notificationHandler.showError("Username must consists of latin letters only!");
            isValid = false;
            return isValid;
        }
        if(username.length <3){
            notificationHandler.showError("Username must be at least 3 symbols long!");
            isValid = false;
        }
        return isValid
    }

    function validatePassword(password, repeatPassword) {
        let isValid = true;
        if(!passwordPattern.test(password)){
            isValid = false;
            notificationHandler.showError("Password must contain letters and numbers and must be at least 6 symbols long!");
            return isValid;
        }
        if(password !== repeatPassword){
            isValid = false;
            notificationHandler.showError("Passwords don't match!")
        }
        return isValid;

    }

    function validateNewPost(dataForPost) {
        let isValid = true;
        if(dataForPost.url.length < 8 || dataForPost.url.indexOf('http') !== 0){
            isValid = false;
            notificationHandler.showError("New post's url is not valid!");
            return isValid;
        }
        if(dataForPost.title.length <2){
            isValid = false;
            notificationHandler.showError("New post's title must be at least 2 symbols long!");
            return isValid;
        }

        return isValid;
    }

    function isLoggedIn() {
        if(sessionHandler.getUsername() == "" || sessionHandler.getUsername() == null){
            return false;
        }
        if(sessionHandler.getAuthToken() == "" || sessionHandler.getAuthToken()== null){
            return false;
        }
        return true;
    }

    function validateComment(comment) {
        let isValid = true;
        if(comment.length < 2){
            isValid = false;
            notificationHandler.showError("Comment must be at least 2 symbols long!");
            return isValid;
        }
        return isValid;
    }

    return {
        validateUsername,
        validatePassword,
        validateNewPost,
        isLoggedIn,
        validateComment
    }
})();