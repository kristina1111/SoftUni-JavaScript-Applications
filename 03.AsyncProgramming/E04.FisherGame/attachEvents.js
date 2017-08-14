function attachEvents() {
    const collectionName = 'biggestCatches';
    const appId = 'kid_S1tyBYgvW';
    const url = "https://baas.kinvey.com/appdata/" + appId + "/" + collectionName;
    const credentials = 'Basic ' + btoa('test:test');

    let divCatches = $('#catches');
    let divAside = $('#aside');

    let addBtn = $(divAside.find('.add')[0]);
    addBtn.on('click', addNewCatch);

    let loadBtn = $(divAside.find('.load')[0]);
    loadBtn.on('click', loadAllCatches);

    function addNewCatch() {
        let divCatches = $('#catches');
        let divAside = $('#aside');
        let anglerInput = $(divAside.find('.angler')[0]);
        let weightInput = $(divAside.find('.weight')[0]);
        let speciesInput = $(divAside.find('.species')[0]);
        let locationInput = $(divAside.find('.location')[0]);
        let baitInput = $(divAside.find('.bait')[0]);
        let captureTimeInput = $(divAside.find('.captureTime')[0]);

        // if(anglerInput.val() != ''
        // && weightInput.val() != ''
        // && speciesInput.val() != ''
        // && locationInput.val() != ''
        // && baitInput.val() != ''
        // && captureTimeInput.val() != ''){
        //     if(!isNaN(Number(weightInput.val())) && !isNaN(Number(captureTimeInput.val()))){
                let recordData = {
                    angler : anglerInput.val(),
                    weight : Number(weightInput.val()),
                    species : speciesInput.val(),
                    location : locationInput.val(),
                    bait : baitInput.val(),
                    captureTime : Number(captureTimeInput.val())
                };

                $.ajax({
                    method:"POST",
                    url:url,
                    data : JSON.stringify(recordData),
                    headers: {
                        'Authorization' : credentials
                    },
                    success: loadAllCatches,
                    error: handleError
                });

                anglerInput.val('');
                weightInput.val('');
                speciesInput.val('');
                locationInput.val('');
                baitInput.val('');
                captureTimeInput.val('');
        //     }
        // }

    }

    function loadAllCatches() {
        $.ajax({
            method : "GET",
            url : url,
            headers: {
                'Authorization' : credentials
            },
            success : renderData,
            error : handleError
        });

        function renderData(data) {
            let divCatches = $('#catches');
            divCatches.empty();
            for(let dataEntry of data){
                divCatches.append(
                    $('<div>').addClass('catch').attr('data-id', dataEntry._id)
                        .append(
                            $('<label>').text('Angler'),
                            $('<input>').attr('type', 'text').addClass('angler').val(dataEntry.angler)
                        )
                        .append(
                            $('<label>').text('Weight'),
                            $('<input>').attr('type', 'number').addClass('weight').val(dataEntry.weight)
                        )
                        .append(
                            $('<label>').text('Species'),
                            $('<input>').attr('type', 'text').addClass('species').val(dataEntry.species)
                        )
                        .append(
                            $('<label>').text('Location'),
                            $('<input>').attr('type', 'text').addClass('location').val(dataEntry.location)
                        )
                        .append(
                            $('<label>').text('Bait'),
                            $('<input>').attr('type', 'text').addClass('bait').val(dataEntry.bait)
                        )
                        .append(
                            $('<label>').text('Capture Time'),
                            $('<input>').attr('type', 'number').addClass('captureTime').val(dataEntry.captureTime)
                        )
                        .append(
                            $('<button>').addClass('update').text('Update').on('click', updateInfoForEntry),
                            $('<button>').addClass('delete').text('Delete').on('click', deleteEntry)
                        )
                )
            }
        }
    }

    function updateInfoForEntry(event) {
        let divEntry = $(event.target).parent();
        // console.dir(divEntry);
        let anglerInput = $(divEntry.find('.angler')[0]);
        let weightInput = $(divEntry.find('.weight')[0]);
        let speciesInput = $(divEntry.find('.species')[0]);
        let locationInput = $(divEntry.find('.location')[0]);
        let baitInput = $(divEntry.find('.bait')[0]);
        let captureTimeInput = $(divEntry.find('.captureTime')[0]);

        // if(anglerInput.val() != ''
        //     && weightInput.val() != ''
        //     && speciesInput.val() != ''
        //     && locationInput.val() != ''
        //     && baitInput.val() != ''
        //     && captureTimeInput.val() != ''){
        //     if(!isNaN(Number(weightInput.val())) && !isNaN(Number(captureTimeInput.val()))){
        let recordData = {
            angler : anglerInput.val(),
            weight : Number(weightInput.val()),
            species : speciesInput.val(),
            location : locationInput.val(),
            bait : baitInput.val(),
            captureTime : Number(captureTimeInput.val())
        };

        $.ajax({
            method:"PUT",
            url:url + '/' + divEntry.attr('data-id'),
            data : JSON.stringify(recordData),
            headers: {
                'Authorization' : credentials
            },
            success: loadAllCatches,
            error: handleError
        });
        //     }
        // }

    }

    function deleteEntry(event) {
        let divEntry = $(event.target).parent();
        $.ajax({
            method:"DELETE",
            url:url + "/" + divEntry.attr('data-id'),
            headers: {
                'Authorization' : credentials
            },
            success: loadAllCatches,
            error: handleError
        });
    }

    function handleError(err) {
        let errorDiv = $("<div>").text("Error: " + err.status + ' (' + err.statusText + ')');
        $(document.body).prepend(errorDiv);

        setTimeout(function () {
            $(errorDiv).fadeOut(function () {
                $(errorDiv).remove();
            });
        }, 3000);
    }

}