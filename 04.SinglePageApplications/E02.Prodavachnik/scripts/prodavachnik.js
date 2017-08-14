let startApp = (function () {

    // // HTML Elements
    //
    // let formRegister = $('#formRegister'),
    //     formLogin = $('#formLogin');

    // let homeTag = $('#linkHome'),
    //     loginTag = $('#linkLogin'),
    //     registerTag = $('#linkRegister'),
    //     listAdsTag = $('#linkListAds'),
    //     createAdTag = $('#linkCreateAd'),
    //     logoutTag = $('#linkLogout');


    let errorBox = $('#errorBox'),
        infoBox = $('#infoBox'),
        loadingBox = $('#loadingBox');





    let sessionHandler = (function () {
        function getAuthToken() {
            return localStorage.getItem('authToken');
        }

        function getUsername() {
            return localStorage.username;
        }

        function getUserId() {
            return localStorage.userId;
        }


        function saveSessionForUser(authToken, userId, username) {
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);
        }

        function destroySessionForUser() {
            localStorage.clear();
        }

        return {
            getAuthToken,
            saveSessionForUser,
            destroySessionForUser,
            getUsername,
            getUserId
        }
    })();

    let requester = (function () {
        let constants = {
            baseUrl: 'https://baas.kinvey.com/',
            appKey: 'kid_HJri46ePW',
            appSecret: '79df43971e664ee9bdfd820042b06c22'
        };

        function getAuth(type) {
            if (type == 'basic') {
                return "Basic " + btoa(constants.appKey + ":" + constants.appSecret)
            }
            return "Kinvey " + sessionHandler.getAuthToken();
        }

        function get(module, endpoint, authType) {
            return $.ajax({
                method: "GET",
                url: constants.baseUrl + module + "/" + constants.appKey + "/" + endpoint,
                headers: {
                    'Authorization': getAuth(authType),
                }
            })
        }

        function post(module, endpoint, data, authType) {
            return $.ajax({
                method: "POST",
                url: constants.baseUrl + module + "/" + constants.appKey + "/" + endpoint,
                headers: {
                    'Authorization': getAuth(authType),
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data)
            })
        }

        function update(module, endpoint, data, authType) {
            return $.ajax({
                method: "PUT",
                url: constants.baseUrl + module + "/" + constants.appKey + "/" + endpoint,
                headers: {
                    'Authorization': getAuth(authType),
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data)
            })
        }

        function del(module, endpoint, authType) {
            return $.ajax({
                method: "DELETE",
                url: constants.baseUrl + module + "/" + constants.appKey + "/" + endpoint,
                headers: {
                    'Authorization': getAuth(authType),
                    'Content-Type': 'application/json'
                }
            })
        }

        return {
            get,
            post,
            update,
            del
        }
    })();

    let authenticator = (function () {
        function login(data) {
            // let data = {
            //     username : username,
            //     password : password
            // };
            return requester.post('user', 'login', data, 'basic')
        }

        function logout() {
            return requester.post('user', '_logout')
        }

        function register(data) {
            return requester.post('user', '', data, 'basic');
        }

        return {
            login,
            logout,
            register
        }
    })();

    let validator = (function () {

    })();

    let templateHandler = (function () {
        let templateConstants = {
            regexForIfElse: /\{%if ([\s\S]*?)%\}([\s\S]*?)(\{% else %\}([\s\S]*?))?\{% endif %\}/g,
            regexForParsing: /{{\s*(\w+)\s*}}/g,
            templatesPath: './templates/',
            isAuthenticated: function () {
                return sessionHandler.getUsername()
            },
            isUserPublisher: function (publisherName) {
                return sessionHandler.getUsername() == publisherName;
            }
        };

        function parse(htmlAsString, contextObj) {
            // console.log(htmlAsString);
            // // console.log(sessionHandler.getUsername());
            function StatementReplacer(match, g1, g2, g3, g4) {
                // console.log(g2);
                // console.log(g4);
                g1 = g1.trim();
                if (templateConstants.hasOwnProperty(g1)) {
                    if (templateConstants[g1](contextObj.publisher)) {
                        return g2;
                    } else {
                        return g4;
                    }
                }
                return '';

            }

            // console.log(htmlAsString);
            htmlAsString = htmlAsString.replace(templateConstants.regexForIfElse, StatementReplacer);

            return htmlAsString.replace(templateConstants.regexForParsing, function (match, g1) {
                // console.dir(contextObj);
                if (contextObj.hasOwnProperty(g1)) {
                    return contextObj[g1];
                }
            })
        }

        return function (templateName, selectorParent, context) {
            return $.get(templateConstants.templatesPath + templateName)
                .then(function (template) {
                    let parentTag = $(selectorParent);
                    parentTag.empty();
                    if (context instanceof Array) {
                        for (let contextObj of context) {
                            parentTag.append(parse(template, contextObj));
                        }
                    } else {
                        parentTag.append(parse(template, context));
                    }

                }).catch(handleError)


        }
    })();

    let notificationHandler = (function () {
        $(document).on({
            ajaxStart: ()=>loadingBox.show(),
            ajaxStop: ()=>loadingBox.fadeOut()
        });

        function showError(message) {
            errorBox.find('span.notification-text').text(message);
            errorBox.find('span.close-symbol').on('click', function (e) {
                $(e.target).parent().fadeOut();
            });
            errorBox.show();
        }

        function showInfo(message) {
            infoBox.text(message);
            infoBox.show();
            setTimeout(function () {
                infoBox.fadeOut();
            }, 3000)
        }


        return {
            showError,
            showInfo
        }
    })();

    function handleError(err) {
        notificationHandler.showError(err.responseJSON.description);
    }

    // function convertSerializedToStringifiedJSON(serializedString) {
    //     return '{"' + serializedString.replace(/=|&/g, function (match) {
    //             if (match == '&') {
    //                 return '","';
    //             } else if (match == '=') {
    //                 return '":"';
    //             }
    //         }) + '"}';
    // }
    // ------------------------------------------

    let formTransformer = (function () {
        function convertSerializedArrayToJSON(formObj) {
            let arrToConvert = formObj.serializeArray();
            let jsonObj = {};
            arrToConvert.forEach(function (e) {
                jsonObj[e.name] = e.value;
            });
            return jsonObj;
        }

        function populateDataInForm(dataObj, formSelector) {
            for(let key in dataObj){
                let formElement = $('[name=' + key + ']', formSelector);
                if(formElement.length > 0){
                    if(formElement.is('select')){
                        $('option', formElement).each(function () {
                            if($(this).val()== dataObj[key]){
                                this.selected = true;
                            }
                        });
                    }
                    else {
                        switch (formElement.attr('type')){
                            case "text":
                            case "number":
                            case "textarea":
                            case "hidden":
                                formElement.val(dataObj[key]);
                                break;
                        }
                    }
                }
            }
        }


        // function populateForm(frm, data) {
        //     $.each(data, function (key, value) {
        //         var $ctrl = $('[name=' + key + ']', frm);
        //         if ($ctrl.is('select')) {
        //             $("option", $ctrl).each(function () {
        //                 if (this.value == value) {
        //                     this.selected = true;
        //                 }
        //             });
        //         }
        //         else {
        //             switch ($ctrl.attr("type")) {
        //                 case "text" :
        //                 case "hidden":
        //                 case "textarea":
        //                     $ctrl.val(value);
        //                     break;
        //                 case "radio" :
        //                 case "checkbox":
        //                     $ctrl.each(function () {
        //                         if ($(this).attr('value') == value) {
        //                             $(this).attr("checked", value);
        //                         }
        //                     });
        //                     break;
        //             }
        //         }
        //     });
        // }

        return {
            convertSerializedArrayToJSON,
            populateDataInForm
        }
    })();

    // ------------------------------------------


    function startApp() {
        // HTML Elements

        let formRegister = $('#formRegister'),
            formLogin = $('#formLogin');


        // homeTag.on('click', showViewOnClick);
        // loginTag.on('click', showViewOnClick);
        // registerTag.on('click', showViewOnClick);
        // listAdsTag.on('click', handleDisplayingAllAd);
        // createAdTag.on('click', showViewOnClick);
        // logoutTag.on('click', handleLogout);
        manageMenu();
        showView('#viewHome');

        $('#buttonLoginUser').on('click', handleLogin);
        $('#buttonRegisterUser').on('click', handleRegister);
        $('#buttonCreateAd').on('click', handlePublishing);
        $('#buttonEditAd').on('click', handleEditAd);


        // functions that manage the login/logout process

        function handleLogin() {
            let dataForLogin = formTransformer.convertSerializedArrayToJSON(formLogin);

            if (dataForLogin.username == '') {
                notificationHandler.showError("Please enter valid username");
                return;
            }
            if (dataForLogin.password == '') {
                notificationHandler.showError("Please enter your password");
                return;
            }

            authenticator.login(dataForLogin)
                .then(successLogin)
                .catch(handleError);
        }

        function handleLogout() {
            authenticator.logout();
            sessionHandler.destroySessionForUser();
            notificationHandler.showInfo("You successfully logged out!");
            manageMenu();
            showView('#viewLogin');
        }

        function handleRegister() {
            let dataForRegister = formTransformer.convertSerializedArrayToJSON(formRegister);

            if (dataForRegister.username == '') {
                notificationHandler.showError("Username must be at least 3 alphanumeric symbols");
                return;
            }
            if (dataForRegister.password == '') {
                notificationHandler.showError("Password must be at least 3 symbols long");
                return;
            }
            if (dataForRegister.password !== dataForRegister.repeatPassword) {
                notificationHandler.showError("The passwords you entered don't match");
                return;
            }
            // validation needed !!!!!

            delete dataForRegister.repeatPassword;
            authenticator.register(dataForRegister)
                .then(successLogin)
                .catch(handleError);
        }

        function successLogin(data) {
            // clear the input fields after successful login or register
            formLogin.trigger("reset");
            formRegister.trigger("reset");
            sessionHandler.saveSessionForUser(data._kmd.authtoken, data._id, data.username);
            notificationHandler.showInfo("Hello " + sessionHandler.getUsername());
            manageMenu();

            handleDisplayingAllAd();
        }


        // functions that manage te ad publishing process
        function handlePublishing() {
            let dataAd = formTransformer.convertSerializedArrayToJSON($('#formCreateAd'));

            if (dataAd.title == '') {
                notificationHandler.showError("You need to enter a title!");
                return;
            }
            if (dataAd.description == '') {
                notificationHandler.showError("You need to enter a description!");
                return;
            }
            if (dataAd.price == '' || isNaN(Number(dataAd.price)) || Number(dataAd.price < 0.01)) {
                notificationHandler.showError("You need to enter a valid price!");
                return;
            }

            dataAd.createdAt = new Date().toISOString().substring(0, 10);
            dataAd.publisher = sessionHandler.getUsername();

            requester.post('appdata', 'adposts', dataAd)
                .then(successPublishing)
                .catch(handleError);

            function successPublishing(data) {
                // clear the input fields after successful post of ad
                $('#formCreateAd').trigger("reset");
                notificationHandler.showInfo('You successfully posted an ad.');

                handleDisplayingAllAd();
            }

        }

        // functions that manage the rendering of all ads
        function handleDisplayingAllAd() {
            requester.get('appdata', 'adposts')
                .then(renderAllAds)
                .catch(handleError);

            function renderAllAds(data) {
                templateHandler('adPreview.html', '#ads .row', data)
                    .then(function () {
                        $('.edit-btn').on('click', function (e) {
                            let id = $(e.target).closest('.edit-btn').attr('data-id');
                            populateFormToEditAd(id);
                        });
                        $('.delete-btn').on('click', function (e) {
                            let id = $(e.target).closest('.delete-btn').attr('data-id');
                            let name = $(e.target).closest('.delete-btn').attr('data-name');
                            handleDeleteId(id, name);
                        });
                        $('.link-product-page').on('click', function (e) {
                            let id = $(e.target).closest('.link-product-page').attr('data-id');
                            handleShowAllInfoForAd(id);
                        });
                        showView('#viewListAds');
                    });

                // showView('#viewListAds');
            }
        }

        function populateFormToEditAd(adId) {
            requester.get('appdata', 'adposts/' + adId)
                .then(fillInData)
                .catch(handleError);

            // https://stackoverflow.com/questions/9807426/use-jquery-to-re-populate-form-with-json-data
            // https://stackoverflow.com/questions/7298364/using-jquery-and-json-to-populate-forms

            function fillInData(data) {
                formTransformer.populateDataInForm(data, '#formEditAd');
                // console.dir($('#buttonEditAd'));
                // return;
                showView('#viewEditAd');
                // console.dir(data);
            }
        }

        function handleEditAd() {
            let dataAd = formTransformer.convertSerializedArrayToJSON($('#formEditAd'));
            requester.update('appdata', 'adposts/'+ dataAd._id, dataAd)
                .then(function (data) {
                    notificationHandler.showInfo("You successfully edited " + data.title);
                    handleShowAllInfoForAd(dataAd._id);
                })
                .catch(handleError)
        }

        function handleDeleteId(adId, name) {
            requester.del('appdata', 'adposts/' + adId)
                .then(function (data) {
                    notificationHandler.showInfo("You successfully deleted " + name);
                    handleDisplayingAllAd();
                })
                .catch(handleError)
        }

        function handleShowAllInfoForAd(adId) {
            requester.get('appdata', 'adposts/' + adId)
                .then(renderInfoForAd)
                .catch(handleError);

            function renderInfoForAd(data) {
                templateHandler('adAllInfo.html', '#viewAllAd', data).
                    then(function () {
                    $('.edit-btn').on('click', function (e) {
                        let id = $(e.target).closest('.edit-btn').attr('data-id');
                        populateFormToEditAd(id);
                    });
                    $('.delete-btn').on('click', function (e) {
                        let id = $(e.target).closest('.delete-btn').attr('data-id');
                        let name = $(e.target).closest('.delete-btn').attr('data-name');
                        handleDeleteId(id, name);
                    });
                    showView('#viewAllAd');
                })
            }
        }


        // functions that manage the view

        function showView(selector) {
            $('.view section').hide();
            $(selector).show();
        }

        function showViewOnClick(event) {
            let viewName = "#view" + $(event.target).attr('id').slice(4);
            showView(viewName);
        }

        // if using templates this won't be necessary!
        function manageMenu() {
            templateHandler('headerMenu.html', '#menu', {username: sessionHandler.getUsername()})
                .then(function () {
                    let homeTag = $('#linkHome'),
                        loginTag = $('#linkLogin'),
                        registerTag = $('#linkRegister'),
                        listAdsTag = $('#linkListAds'),
                        createAdTag = $('#linkCreateAd'),
                        logoutTag = $('#linkLogout');

                    homeTag.on('click', showViewOnClick);
                    loginTag.on('click', showViewOnClick);
                    registerTag.on('click', showViewOnClick);
                    listAdsTag.on('click', handleDisplayingAllAd);
                    createAdTag.on('click', showViewOnClick);
                    logoutTag.on('click', handleLogout);
                }).catch(handleError);

            //
            // if (sessionHandler.getUsername() == undefined) {
            //     homeTag.show();
            //     loginTag.show();
            //     registerTag.show();
            //     createAdTag.hide();
            //     listAdsTag.hide();
            //     logoutTag.hide();
            // } else {
            //     homeTag.show();
            //     loginTag.hide();
            //     registerTag.hide();
            //     listAdsTag.show();
            //     createAdTag.show();
            //     logoutTag.show();
            // }
        }
    }

    return startApp;
})();