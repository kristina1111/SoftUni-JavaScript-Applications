let messageService = (function () {
    function isValidNewMessage(message) {
        if(message.text == ""){
            notificationHandler.showError("Message should be at lest 1 symbols long!")
            return false;
        }
        return true;
    }
    function handleSendMessage(message) {
        if(isValidNewMessage(message)){
            message.senderName = sessionHandler.getUserName();
            message.senderUsername = sessionHandler.getUsername();
            return requester.post('appdata', "messages", message)
        }
    }

    function handleDeleteMessage(id){
        return requester.del('appdata', 'messages/' + id);
    }


    return {
        handleSendMessage,
        handleDeleteMessage,
    }
})();