// for Judge

// function attachEvents() {
//     // HTML elements
//     let loadPostsBtn = $('#btnLoadPosts');
//     let viewCommentsBtn = $('#btnViewPost');
//     loadPostsBtn.on('click', loadPosts);
//     viewCommentsBtn.on('click', loadPostAndComments)
//     let selectTab = $('#posts');
//
//     let postTitleTag = $('#post-title');
//     let postBodyTag = $('#post-body');
//
//     let listComments = $('#post-comments');
//
// //    for test purposes only
//     const username = 'testBlog';
//     const pass = 'testBlog';
//
//     const url = "https://baas.kinvey.com/appddata/kid_HJILja28W/";
//
//     // this function returns promise
//     function request(endPoint) {
//         return $.ajax({
//             method:"GET",
//             url: url + endPoint,
//             headers: {
//                 'Authorization': 'Basic ' + btoa(username + ":" + pass)
//             }
//         });
//     }
//
//
//     function loadPostAndComments() {
//         let idPost = selectTab.find('option:selected').val();
//
//         let postPromise = request("posts/" + idPost);
//         let commentsPromise = request('comments/?query={"postId":"' + idPost + '"}');
//         Promise.all([postPromise, commentsPromise])
//             .then(renderPostAndComments)
//             .catch(handleError);
//
//         function renderPostAndComments([dataPost, dataComments]) {
//
//             postTitleTag.text(dataPost.title);
//             postBodyTag.text(dataPost.body);
//
//             listComments.empty();
//             if(dataComments.length>0)
//             for(let comment of dataComments){
//                 listComments.append(
//                     $('<li>').text(comment.text)
//                 );
//             }else{
//                 listComments.append(
//                     $('<li>').text("There are no comments for this post yet!")
//                 );
//             }
//             // console.dir(dataPost);
//             // console.dir(dataComments);
//         }
//     }
//
//
//     function loadPosts(){
//
//         request("posts")
//             .then(fillSelectTab, handleError);
//
//         function fillSelectTab(data){
//             selectTab.empty();
//             for(let post of data){
//                 selectTab.append(
//                     $('<option>').val(post._id).text(post.title)
//                 )
//             }
//             // console.dir(data);
//         }
//     }
//
//     function handleError(err) {
//         let errorDiv = $("<div>").text("Error: " + err.status + ' (' + err.statusText + ')');
//         $(document.body).prepend(errorDiv);
//
//         setTimeout(function() {
//             $(errorDiv).fadeOut(function() {
//                 $(errorDiv).remove();
//             });
//         }, 3000);
//     }
// }


function attachEvents() {
    // HTML elements
    let loadPostsBtn = $('#btnLoadPosts');
    let viewCommentsBtn = $('#btnViewPost');
    // loadPostsBtn.on('click', loadPosts);
    // viewCommentsBtn.on('click', loadPostAndComments);
    let selectTab = $('#posts');
    selectTab.on('change', loadPostAndComments);

    let postTitleTag = $('#post-title');
    let postBodyTag = $('#post-body');

    let listComments = $('#post-comments');

    // for test purposes only
    const username = 'testBlog';
    const pass = 'testBlog';

    const url = "https://baas.kinvey.com/appdata/kid_HJILja28W/";

    loadPosts();

    // this function returns promise
    function request(endPoint) {
        return $.ajax({
            method: "GET",
            url: url + endPoint,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ":" + pass)
            }
        });
    }


    function loadPostAndComments() {
        selectTab.attr('disabled', true);
        let idPost = selectTab.find('option:selected').val();

        let postPromise = request("posts/" + idPost);
        let commentsPromise = request('comments/?query={"postId":"' + idPost + '"}');
        Promise.all([postPromise, commentsPromise])
            .then(renderPostAndComments)
            .catch(handleError);

        function renderPostAndComments([dataPost, dataComments]) {

            postTitleTag.text(dataPost.title);
            postBodyTag.text(dataPost.body);

            listComments.empty();
            if (dataComments.length > 0)
                for (let comment of dataComments) {
                    listComments.append(
                        $('<li>').text(comment.text)
                    );
                } else {
                listComments.append(
                    $('<li>').text("There are no comments for this post yet!")
                );
            }

            selectTab.attr('disabled', false)
            // console.dir(dataPost);
            // console.dir(dataComments);
        }
    }


    function loadPosts() {

        request("posts")
            .then(fillSelectTab, handleError);

        function fillSelectTab(data) {
            selectTab.empty();
            selectTab.append(
                $('<option>').text("--Select post--")
            );
            for (let post of data) {
                selectTab.append(
                    $('<option>').val(post._id).text(post.title)
                )
            }
            // console.dir(data);
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
