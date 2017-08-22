let homeController = (function () {
    function getHomePage(context) {
        if (validator.isLoggedIn()) {
            context.redirect('#/allPosts')
        } else {
            context.username = sessionHandler.getUsername();
            this.loadPartials({
                navigation: './templates/common/menuPartial.hbs'
            }).then(function () {
                context.partials = this.partials;
                context.partial('./templates/userAuth/authenticatePage.hbs');
            })
        }
    }

    return {
        getHomePage
    }
})();