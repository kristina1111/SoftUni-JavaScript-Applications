let constants = require('./constants');
let requester = require('./requests');

function getAuthentication() {
    function login(username, password) {
        let data = {
            username : username,
            password : password
        };
        return requester.post('user', 'login', data, 'basic')
    }
}