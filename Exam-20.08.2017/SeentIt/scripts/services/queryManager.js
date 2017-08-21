let queryManager = (function () {

    function getAllPosts() {
        return requester.get('appdata', 'posts?query={}&sort={"_kmd.ect": -1}');
    }

    function getPostById(id) {
        return requester.get('appdata', 'posts/' + id);
    }

    function getPostsByAuthor(author) {
        return requester.get('appdata', 'posts?query={"author":"' + author + '"}&sort={"_kmd.ect": -1}')
    }

    function getAllCommentsByPostId(postId) {
        return requester.get('appdata', 'comments?query={"postId":"' + postId + '"}&sort={"_kmd.ect": -1}')
    }


    return {
        getAllPosts,
        getPostById,
        getPostsByAuthor,
        getAllCommentsByPostId
    }
})();
