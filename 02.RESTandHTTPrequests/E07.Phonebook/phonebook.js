function attachEvents() {
    let uList = $('#phonebook');
    let phoneInput = $('#phone');
    let nameInput = $('#person');
    let req = {
        method: "GET",
        url: "https://phonebook-nakov.firebaseio.com/phonebook.json",
        success: handleSuccess,
        error: handleError
    };

    let btnLoad = $('#btnLoad').on('click', loadInfo);
    let btnCreate = $('#btnCreate').on('click', createEntry);

    function loadInfo() {
        $.ajax(req);
    }

    function createEntry() {
        let name = nameInput.val().trim();
        let phone = phoneInput.val().trim();
        phoneInput.val("");
        nameInput.val("");
        if (name !== '' && phone !== '') {
            let newEntry = prepareNewEntry(name, phone);
            prepareRequest("POST");
            req.data = JSON.stringify(newEntry);
            $.ajax(req);
        }
    }

    function prepareRequest(method, id) {
        if (method == "DELETE") {
            req.url = "https://phonebook-nakov.firebaseio.com/phonebook/" + id + ".json";
        }
        req.method = method;
        if (req.method == "GET") {
            req.url = "https://phonebook-nakov.firebaseio.com/phonebook.json";
        }
    }

    function prepareNewEntry(name, phone) {
        return {
            person: name,
            phone: phone
        }
    }

    function createHTML(name, phone, id) {

        uList.append(
            $('<li>').text(name + ": " + phone).append(
                $('<button>').attr('data-record', id).text("[Delete]").on('click', deleteContact)
            )
        );
    }

    function deleteContact() {
        prepareRequest("DELETE", $(this).attr('data-record'));
        $.ajax(req);
    }

    function handleSuccess(data) {
        if (req.method == "DELETE" || req.method == "POST") {
            prepareRequest("GET");
            $.ajax(req);
            return; // !!! Important because after the upper ajax call we don't need the next code to be processed
        }
        uList.empty();
        for (let entry in data) {
            createHTML(data[entry].person, data[entry].phone, entry);
        }
    }

    function handleError(error) {
        alert("Error");

        // $('body').prepend(
        //     $('<div>').append(
        //         $('<h1>').css('color', 'red').text("Error")
        //     )
        // );
    }
}

attachEvents();