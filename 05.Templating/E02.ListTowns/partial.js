function loadTemplate(context) {
    const main = $('#root');
    let townSource = null;
    let listTownsSource = null;
    Promise.all([$.get('./templates/liPartial.hbs'), $.get('./templates/listTowns.hbs')])
        .then(function ([town, listTowns]) {
            townSource = town;
            listTownsSource = listTowns;

            Handlebars.registerPartial('town', townSource);
            let townListTemplate = Handlebars.compile(listTownsSource);
            main.empty().append(townListTemplate(context));
        })
}
