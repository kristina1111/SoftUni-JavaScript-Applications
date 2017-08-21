(function () {
    Handlebars.registerHelper('ifCond', function (a, operator, b, opts) {
        var bool = false;
        switch (operator) {
            case '==':
                bool = a == b;
                break;
            case '>':
                bool = a > b;
                break;
            case '<':
                bool = a < b;
                break;
            case "!=":
                bool = a != b;
                console.log(a);
                console.log(b)
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
        if (sessionHandler.getAuthToken() !== null) {
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

    Handlebars.registerHelper('formatMoney', function (nDigitsAfterPoint, thousandSeparator, price) {
        return Number(price).toFixed(Number(nDigitsAfterPoint)).replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    });

    Handlebars.registerHelper('calculate', function (a, operator, b) {
        switch (operator) {
            case "+":
                return Number(a) + Number(b);
            case "-":
                return Number(a) - Number(b);
            case "*":
                return Number(a) * Number(b);
            case "/":
                return Number(a) / Number(b);
            default:
                return "Unknown operator";
        }
    });

    Handlebars.registerHelper("isEmptyObject", function (obj, opts) {
        if (Object.keys(obj).length === 0) {
            return opts.inverse(this);
        }
        return opts.fn(this);

    });


    Handlebars.registerHelper("inc", function (value, options) {
        return parseInt(value) + 1;
    });

    Handlebars.registerHelper('createdBefore', function (dateIsoFormat) {
        let diff = new Date - (new Date(dateIsoFormat));
        diff = Math.floor(diff / 60000);
        if (diff < 1) return 'less than a minute';
        if (diff < 60) return diff + ' minute' + pluralize(diff);
        diff = Math.floor(diff / 60);
        if (diff < 24) return diff + ' hour' + pluralize(diff);
        diff = Math.floor(diff / 24);
        if (diff < 30) return diff + ' day' + pluralize(diff);
        diff = Math.floor(diff / 30);
        if (diff < 12) return diff + ' month' + pluralize(diff);
        diff = Math.floor(diff / 12);
        return diff + ' year' + pluralize(diff);
        function pluralize(value) {
            if (value !== 1) return 's';
            else return '';

        }
    })


})();