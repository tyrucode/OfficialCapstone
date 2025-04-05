// spotify dev client id
const CLIENT_ID = '619cbfa18fd846088bc95b31a67816b2';

// Your redirect URI - use the one that's actually working
// const REDIRECT_URI = 'http://localhost:5173/callback'
//ONE IS FOR VERCEL TESTING ONE IS FOR LOCALHOST TESTING, COMMENT OUT WHICHEVER ISNT IN USE
const REDIRECT_URI = 'https://official-capstone.vercel.app/callback'
console.log("using redirect uri:", REDIRECT_URI);


// permissions we are wanting from the user
const SCOPES = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read'
];

// string for verification
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// take user to spotify login page
export const redirectToSpotifyLogin = () => {
    const state = generateRandomString(16);

    // store state in local storage for verification on callback
    localStorage.setItem('spotify_auth_state', state);

    // spotify authentication url
    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize' +
        '?response_type=token' +
        '&client_id=' + encodeURIComponent(CLIENT_ID) +
        '&scope=' + encodeURIComponent(SCOPES.join(' ')) +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&state=' + encodeURIComponent(state);

    // take to spotify login page
    window.location.href = spotifyAuthUrl;
};