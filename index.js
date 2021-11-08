window.onload = function () {
    document.getElementById("loginButton").addEventListener('click', function () {
        location.href = 'https://accounts.spotify.com/authorize?client_id=790c4a612fdd4460a162bbe664d908d6&response_type=token&scope=user-read-playback-state&redirect_uri=https://oryfox.github.io/lyrics/';
    });
    document.getElementById("reloadButton").addEventListener('click', function () {
        location.reload();
    });
    let message = document.getElementById("message");

    if (window.location.hash) {
        message.innerHTML = "Parsing Access Token";
        const accessToken = window.location.hash.split("&")[0].split("=")[1];
        document.cookie = "spotifyAccessToken=" + accessToken;
        location.href = "https://oryfox.github.io/lyrics/";
    } else {
        if (document.cookie) {
            message.innerHTML = "Fetching information";
            run(document.cookie.split("=")[1]);
        } else {
            document.getElementById("loginButton").className = "btn btn-primary";
            message.innerHTML = "You have to login";
        }
    }
}

function run(spotifyAccessToken) {
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
            "Authorization": "Bearer " + spotifyAccessToken,
            "Content-Type": "application/json",
        },
        method: "GET"
    }).then(response => {
        if (response.status === 200) {
            response.json().then(data => {
                document.getElementById("message").innerHTML = "Found " + data.item.name + " by " + data.item.artists[0].name + ". Looking for URL...";
                fetch("https://api.genius.com/search?q=" + data.item.name + "%20" + data.item.artists[0].name + "&access_token=fmrCKi9UKZ9L7GcvccCe9XOgc_yvZtpN-Dn9LHzLTJSUt9Elyga5IoDbt3GLtsQ5")
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById("message").innerHTML = "Redirecting..";
                        location.href = data.response.hits[0].result.url;
                    })
                    .catch(error => console.log(error));
            });
        } else if (response.status === 204) {
            document.getElementById("message").innerHTML = "Currently no track playing";
            document.getElementById("reloadButton").className = "btn btn-secondary";
        }
    });
}