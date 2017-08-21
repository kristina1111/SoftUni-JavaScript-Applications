let queryManager = (function () {
    function getAllProducts() {
        return requester.get('appdata', 'products');
    }

    function getUser(id) {
        return requester.get('user', id);
    }

    function getProduct(id) {
        return requester.get('appdata','products/' + id);
    }


    return {
        getAllProducts,
        getUser,
        getProduct
    }
})();
