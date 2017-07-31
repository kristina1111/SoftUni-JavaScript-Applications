function attachEvents() {
    // HTML elements
    $('#submit').on('click', loadWeather);
    let forecastDiv = $('#forecast');
    let currentConditionTag = $('#current');
    let upcomingConditionsTag = $('#upcoming');


    const weatherSymbols = {
        'Sunny': '&#x2600;',
        'Partly sunny': '&#x26C5;',
        'Overcast': '&#x2601;',
        'Rain': '&#x2614;',
        'Degrees': '&#176;'
    };

    function request(endPoint) {
        return $.ajax({
            method: "GET",
            url: "https://judgetests.firebaseio.com/" + endPoint + ".json "
        });
    }

    function loadWeather() {
        let cityName = $('#location').val();
        if (cityName !== '') {
            request("locations")
                .then(getCityForecastInformation)
                .catch(handleError);


            function getCityForecastInformation(locationsData) {
                let cityCode = getCityCode(locationsData, cityName);
                let todayForecastPromise = request("forecast/today/" + cityCode);
                let upcomingForecastPromise = request("forecast/upcoming/" + cityCode);

                Promise.all([todayForecastPromise, upcomingForecastPromise])
                    .then(renderInformation)
                    .catch(handleError);;

                function renderInformation([todayForecast, upcomingForecast]) {
                    // console.dir(todayForecast);
                    // console.dir(upcomingForecast);
                    currentConditionTag
                        .append(
                            getSpanWithInfo('condition symbol', weatherSymbols[todayForecast['forecast']['condition']])
                        )
                        .append(
                            getSpanWithInfo('condition')
                                .append(
                                    getSpanWithInfo('forecast-data', todayForecast['name']),
                                    getSpanWithInfo('forecast-data', todayForecast['forecast']['low'] + '&deg;/' + todayForecast['forecast']['high'] + '&deg;'),
                                    getSpanWithInfo('forecast-data', todayForecast['forecast']['condition']),
                                )
                        );

                    for(let forecast of upcomingForecast['forecast']){
                        upcomingConditionsTag
                            .append(
                                getSpanWithInfo('upcoming')
                                    .append(
                                        getSpanWithInfo('symbol', weatherSymbols[forecast['condition']]),
                                        getSpanWithInfo('forecast-data', forecast['low'] + '&deg;/' + forecast['high'] + '&deg;'),
                                        getSpanWithInfo('forecast-data', forecast['condition']),
                                    )
                            )
                    }

                    forecastDiv.css({'display': 'block'});

                    function getSpanWithInfo(classToAdd, textInSpan = '') {
                        return $('<span>').addClass(classToAdd).html(textInSpan);
                    }
                }


                function getCityCode(locationsData, cityWanted) {
                    for (let location of locationsData) {
                        if (location.name == cityWanted) {
                            return location.code;
                        }
                    }
                }
            }
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
}