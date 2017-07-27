function getInfo() {
    let infoLink = "https://judgetests.firebaseio.com/businfo/" + $('#stopId').val() + ".json";
    let uList = $('#buses');
    $.ajax({
        method:"GET",
        url: infoLink,
        success: displayInfo,
        error: displayError
    });

    function displayInfo(data) {
        uList.empty();
        $('#stopName').text(data.name);
        let infoForBuses = data['buses'];
        for(let info in infoForBuses){
            uList.append(
                $('<li>').text("Bus " + info + " arrives in " + infoForBuses[info] + " minutes")
            )
        }
    }
    function displayError() {
        $('#stopName').text("Error");
    }
}