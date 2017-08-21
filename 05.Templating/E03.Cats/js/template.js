$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        $.get('./templates/catPartial.hbs')
            .then(function (data) {
                let catTemplate = Handlebars.compile(data);
                $('body').empty().prepend(catTemplate({cats : cats}));
                attachEvent();
            })
    }

});
