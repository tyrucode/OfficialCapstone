// spotify dev client id
const CLIENT_ID = '619cbfa18fd846088bc95b31a67816b2';

// development url
// const REDIRECT_URI = 'http://localhost:5173/callback'
// production url
const REDIRECT_URI = 'https://official-capstone.vercel.app/callback'
// checking what uri ur using
console.log("using redirect uri:", REDIRECT_URI);


// permissions that we are wanting from the users spotify account
const SCOPES = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state'
];

// string for verification
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; //possible characters
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length)); //add random characters
    }
    return text; //return random string
};

// take user to spotify login page
export const redirectToSpotifyLogin = () => {
    const state = generateRandomString(16); //generate random state for security

    // store state in local storage for verification on callback
    localStorage.setItem('spotify_auth_state', state);

    // make a spotify authentication url with all required parameters
    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize' +
        '?response_type=token' +
        '&client_id=' + encodeURIComponent(CLIENT_ID) +
        '&scope=' + encodeURIComponent(SCOPES.join(' ')) +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&state=' + encodeURIComponent(state);

    // take user to the spotify login page
    window.location.href = spotifyAuthUrl;
};