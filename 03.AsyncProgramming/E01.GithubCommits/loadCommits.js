function loadCommits() {
    let list = $('#commits');
    function getUrl(username, repository) {
        return "https://api.github.com/repos/" + username + "/" + repository + "/" + "commits";
    }

    let username = $('#username').val();
    let repository = $('#repo').val();
    if(username!=='' && repository!==''){
        $.get(getUrl(username, repository))
            .then(successBack, failBack)
    }
    function successBack(data){
        // console.dir(data);
        for(let obj in data){
            list.append(
                $('<li>').text(data[obj].commit.author.name + ": " + data[obj].commit.message)
            );
        }
    }
    
    function failBack(error) {
        list.append(
            $('<li>').text("Error: " + error.status + " (" + error.statusText + ")")
        )
    }
}

// console.log("Before promise");
// let p = new Promise(function (resolve, reject) {
//     setTimeout(()=>resolve("Success"), 1000)
// });
//
// p.then((data)=>console.log(data));
// console.log("After promise");