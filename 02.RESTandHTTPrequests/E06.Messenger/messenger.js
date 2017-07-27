function attachEvents() {
    // define request object
    let req = {
        method: "GET",
        url: "https://messenger-9e545.firebaseio.com/.json",
        success: handleSuccess,
        error: handleError
    };

    // add eventlistener to the send and refresh buttons

    let btnSend = $('#submit').on('click', sendMessage);
    let btnRefresh = $('#refresh').on('click', refreshMessenger);


    function sendMessage() {

        let nameAuthor = $('#author').val().trim();
        let messageText = $('#content').val().trim();

        // check if name and message input fields are filled;
        if (nameAuthor !== '' && messageText !== '') {
            // if yes empty message input and prepare message that will be posted
            $('#content').val("");
            let message = prepareMessage(nameAuthor, messageText);

            // change the request object method to POST
            req.method = "POST";
            // add data property to the request object - this is the message that will be posted
            req.data = JSON.stringify(message);
            $.ajax(req);
        } else {
            $('#main').append(
                $('<div>').text("Name and message fields should not be empty!")
            );
        }
    }

    function refreshMessenger() {
        // the refresh button only makes ajax call so that all messages in the database be displayed
        $.ajax(req);
    }


    function handleSuccess(messages) {
        // check if the method of the request object is POST
        // if yes this means that handleSuccess is called after POST of new message
        // and second ajax call need to be made to get all messages from the database
        if (req.method == "POST") {
            req.method = "GET";
            $.ajax(req);
            return;
        }
        // then call displayMessages function
        displayMessages(messages);
    }

    function handleError() {
        $('#main').append(
            $('<div>').text("Messages cannot be displayed!")
        );
    }

    function displayMessages(messages) {
        // concatenate all messages from the database in one string
        let allMessagesString = "";
        for (let msg in messages) {
            allMessagesString += messages[msg].author + ": " + messages[msg].content + '\n';
        }
        allMessagesString.trim();

        // insert the string in the textarea
        $('#messages').text(allMessagesString);
    }

    function prepareMessage(nameAuthor, messageText) {
        // the function returns message that is ready to be posted
        let message = {};
        message.author = nameAuthor;
        message.content = messageText;
        message.timestamp = Date.now();
        return message;
    }
}

attachEvents();