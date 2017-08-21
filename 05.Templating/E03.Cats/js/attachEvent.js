function attachEvent() {
    let allBtns = $('#allCats .card-block button');
    allBtns.on('click', function (e) {
        $('#allCats .card-block > div').hide();
        if($(e.target).text().indexOf('Show') !== -1){
            allBtns.text("Show status code");
            $(e.target).text("Hide status code");
            $(e.target).parent().find('div').show();
        }else{
            $(e.target).text("Show status code");
            $(e.target).parent().find('div').hide();
        }



    })
}