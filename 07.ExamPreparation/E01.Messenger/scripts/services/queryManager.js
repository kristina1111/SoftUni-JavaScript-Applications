let queryManager = (function () {
    function getAllUsers() {
        return requester.get('user');
    }
    
    function getAllSentMessagesBySenderUsername(username) {
        return requester.get('appdata', 'messages/?query={"senderUsername":"' + username + '"}');
    }

    function getAllReceivedMessagesByRecipientUsername(username) {
        return requester.get('appdata', 'messages/?query={"recipientUsername":"' + username + '"}')
    }

    return {
        getAllUsers,
        getAllSentMessagesBySenderUsername,
        getAllReceivedMessagesByRecipientUsername
    }
})();
