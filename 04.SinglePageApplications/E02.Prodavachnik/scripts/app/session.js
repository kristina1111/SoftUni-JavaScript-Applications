let sessionHandler = (function () {
    function getAuthToken() {
        return localStorage.getItem('authToken');
    }

    function saveSessionForUser(authToken, userId, userName) {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
    }
    function destroySessionForUser() {
        localStorage.clear();
    }

    return {
        getAuthToken,
        saveSessionForUser,
        destroySessionForUser
    }
})();


module.exports = sessionHandler;