// ----------------------- Session handler -------------------------------------------------------------------------
//    has methods that wrap session build-in browser functionality (sessionStorage)

let sessionHandler = (function () {
    function getAuthToken() {
        return sessionStorage.getItem('authToken');
    }

    function getUsername() {
        return sessionStorage.username;
    }

    function getUserId() {
        return sessionStorage.getItem('userId');
    }

    function isAuthenticated() {
        return getAuthToken() !== null;
    }

    function updateSessionItemForUser(itemName, newValue) {
        sessionStorage.setItem(itemName, newValue);
    }


    function saveSessionForUser(authToken, userId, username) {
        sessionStorage.setItem('authToken', authToken);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('username', username);
    }

    function destroySessionForUser() {
        sessionStorage.clear();
    }

    return {
        getAuthToken,
        saveSessionForUser,
        destroySessionForUser,
        getUsername,
        getUserId,
        isAuthenticated,
        updateSessionItemForUser
    }
})();
// ----------------------- END Session handler ---------------------------------------------------------------------
