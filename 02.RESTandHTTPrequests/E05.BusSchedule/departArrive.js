function solve() {
    let infoContainer = $('div#info .info:first');
    let btnDepart = $('#depart');
    let btnArrive = $('#arrive');

    let currentStop = {
        nextStopId : 'depot',
        name: 'Depot'
    };


    let req = {
        method: "GET",
        url: "https://judgetests.firebaseio.com/schedule/" + currentStop.nextStopId + ".json",
        success: handleSuccess,
        error: handleError
    };
    function updateUrl() {
        req.url = "https://judgetests.firebaseio.com/schedule/" + currentStop.nextStopId + ".json"
    }

    function handleSuccess(data) {
        currentStop.name = data.name;
        currentStop.nextStopId = data.next;

        infoContainer.text("Next stop " + currentStop.name);

    }
    function handleError() {
        infoContainer.text("Error");
        btnDepart.attr('disabled', true);
        btnArrive.attr('disabled', true);
    }


    function depart() {
        $.ajax(req);
        btnDepart.attr('disabled', true);
        btnArrive.attr('disabled', false);
    }
    function arrive() {
        infoContainer.text("Arriving " + currentStop.name);
        updateUrl();
        btnDepart.attr('disabled', false);
        btnArrive.attr('disabled', true);
    }

    return {
        depart,
        arrive
    };
}

let result = solve();