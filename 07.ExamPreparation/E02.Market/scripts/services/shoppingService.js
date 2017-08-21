let shoppingService = (function () {
    function prepareAddInCart(productId) {
        let userPromise = queryManager.getUser(sessionHandler.getUserId());
        let productPromise = queryManager.getProduct(productId);
        return Promise.all([userPromise, productPromise]);
    }

    function addInCart(user, product) {
        if(user.cart.hasOwnProperty(product._id)){
            user.cart[product._id].quantity += 1;
        }else{
            user.cart[product._id] = {
                quantity: 1,
                product: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    imageUrl: product.imageUrl
                }
            }
        }
        return user;
    }

    function successAddInCart(productName) {
        notificationHandler.showInfo('Product "' + productName + '" purchased.');
    }

    function handleAddInCart(productId) {
        prepareAddInCart(productId)
            .then(function ([userInfo, productInfo]) {
                let userNewData = addInCart(userInfo, productInfo);
                requester.update('user', sessionHandler.getUserId(), userNewData)
                    .then(function () {
                        successAddInCart(productInfo.name)
                    })
                    .catch(notificationHandler.handleError);
            })
            .catch(notificationHandler.handleError)
    }

    function handleRemoveFromCart(idProduct) {
        queryManager.getUser(sessionHandler.getUserId())
            .then(function (userInfo) {
                delete userInfo.cart[idProduct];
                 return requester.update('user', sessionHandler.getUserId(), userInfo)
            })
            .catch(notificationHandler.handleError)
    }


    return {
        handleAddInCart,
        handleRemoveFromCart
    }
})();