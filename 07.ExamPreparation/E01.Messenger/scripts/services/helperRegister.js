(function () {
    Handlebars.registerHelper('ifCond', function(a, operator, b, opts) {
        var bool = false;
        switch(operator) {
            case '==':
                bool = a == b;
                break;
            case '>':
                bool = a > b;
                break;
            case '<':
                bool = a < b;
                break;
            default:
                throw "Unknown operator " + operator;
        }

        if (bool) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });

    Handlebars.registerHelper("isAuthenticated", function (opts) {
        if(sessionHandler.getAuthToken()!== null){
            return opts.fn(this);
        }
        return opts.inverse(this);
    });

    Handlebars.registerHelper('formatName', function (name, username) {
        function formatSender(name, username) {
            if (!name)
                return username;
            else
                return username + ' (' + name + ')';
        }

        return formatSender(name, username);
    });

    Handlebars.registerHelper('formatTime', function (date) {
        function formatDate(dateISO8601) {
            let date = new Date(dateISO8601);
            if (Number.isNaN(date.getDate()))
                return '';
            return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
                "." + date.getFullYear() + ' ' + date.getHours() + ':' +
                padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

            function padZeros(num) {
                return ('0' + num).slice(-2);
            }
        }

        return formatDate(date);
    });



    // Handlebars.registerHelper('hasTeam', function (opts) {
    //     if(sessionHandler.getUserTeamId() !== "undefined"
    //     && sessionHandler.getUserTeamId() !== ""){
    //         return opts.fn(this);
    //     }
    //     return opts.inverse(this);
    // });


})();