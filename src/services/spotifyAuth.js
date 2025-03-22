// Client ID from your Spotify Developer Dashboard
const CLIENT_ID = '619cbfa18fd846088bc95b31a67816b2';

// Your redirect URI - use the one that's actually working
const REDIRECT_URI = window.location.hostname === 'localhost'
    ? 'http://localhost:5173/signin'
    : 'https://your-vercel-app-domain.vercel.app/signin';

// The permissions we're requesting from the user
const SCOPES = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read'
];

// Generates a random string for state verification
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Redirects to Spotify login page
export const redirectToSpotifyLogin = () => {
    const state = generateRandomString(16);

    // Store state in localStorage to verify when callback returns
    localStorage.setItem('spotify_auth_state', state);

    // Build the Spotify authorization URL
    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize' +
        '?response_type=token' +
        '&client_id=' + encodeURIComponent(CLIENT_ID) +
        '&scope=' + encodeURIComponent(SCOPES.join(' ')) +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&state=' + encodeURIComponent(state);

    // Redirect to Spotify authorization page
    window.location.href = spotifyAuthUrl;
};