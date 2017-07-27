function loadRepos() {
    let reposLink = "https://api.github.com/users/" + $('#username').val() + "/repos";
    let uList = $('#repos');
    $.ajax({
        method:"GET",
        url: reposLink,
        success: displayRepos,
        error: displayError
    });
    
    function displayRepos(data) {
        for(let repo of data){
            uList.append(
                $('<li>').append(
                    $('<a>').attr('href', repo.html_url).text(repo.full_name)
                )
            )
        }
    }
    function displayError() {
        uList.append(
            $('<li>').text('Not Found')
        );
    }
}