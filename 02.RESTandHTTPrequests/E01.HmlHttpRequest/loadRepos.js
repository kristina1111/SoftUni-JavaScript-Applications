function loadRepos() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if(req.readyState === 4){
            let uList = $('<ul>');
            let repos = JSON.parse(req.responseText);
            for(let repo of repos){
                uList.append(
                    $('<li>').text(repo.name)
                )
            }
            $('#res').append(uList);

            // for Judge
            // $('#res').text(req.responseText);
        }
    };
    req.open("GET", "https://api.github.com/users/kristina1111/repos", true);
    req.send();

}