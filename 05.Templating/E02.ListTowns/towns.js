function attachEvents() {
    $('#btnLoadTowns').on('click', handleTownDisplay);

    function handleTownDisplay() {
        let townsArr = $('#towns').val().split(', ').filter(e => e!=='').map(e => e = {name : e});
        let context = {
            towns : townsArr
        };

        loadTemplate(context);
    }
}