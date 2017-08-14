let constants = require('./constants');
let sessionHandler = require('./session');

let requester = (function () {
    function getAuth(type) {
        if(type == 'basic'){
            return "Basic " + btoa(constants.appKey + ":" + constants.appSecret)
        }
        return "Kinvey " + sessionHandler.getAuthToken();
    }

    function get(module, endpoint, authType) {
        return $.ajax({
            method : "GET",
            url : constants.baseUrl + module + "/" + constants.appKey + "/" + endpoint,
            headers: {
                'Authorization' : getAuth(authType)
            }
        })
    }

    function post(module, endpoint, data, authType) {
        return $.ajax({
            method : "POST",
            url : constants.baseUrl + module + "/" + constants.appKey + "/" + endpoint,
            headers: {
                'Authorization' : getAuth(authType)
            },
            data : JSON.stringify(data)
        })
    }

    return {
        get,
        post
    }
})();

module.exports = requester;