// spotify class to handle the web playback aspect and everything it does
export class SpotifyPlayer {
    constructor() {
        this.player = null; //this instance
        this.deviceId = null; //the devices id
        this.isReady = false; //check if its ready
        this.currentTrackId = null; //id of current tracj
        this.snippetDuration = 5000; // 5 seconds in milliseconds
        this.snippetStartTime = 0; //start position for the snippet
        this.playbackTimer = null; //stop playback after the snippets duration is up
    }
    //function to start the game
    async initializePlayer() {
        return new Promise((resolve, reject) => {
            // promise that will resolve when the player is ready or reject
            window.onSpotifyWebPlaybackSDKReady = () => {
                // when the player loads it will do this function
                this.createPlayer(resolve, reject);
            };

            // check if the player is loaded
            if (!window.Spotify) {
                // if not add the script tag for the player
                const script = document.createElement('script');
                script.src = 'https://sdk.scdn.co/spotify-player.js';
                script.async = true;
                // error handling
                script.onerror = (error) => {
                    reject(new Error('failed to load spotify web playback'));
                };
                // add this to the body
                document.body.appendChild(script);
            } else if (this.player) {
                // resolve if the sdk is loaded but the player already exists
                resolve(this.player);
            } else {
                // add the player if the sdk is loaded but player isnt 
                this.createPlayer(resolve, reject);
            }
        });
    }
    // function to create the  player and connect
    createPlayer(resolve, reject) {
        // find local storage token
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
            // if not then error
            reject(new Error('no access token was found'));
            return;
        }

        //A LOT OF ERROR HANDLING 
        //fun


        this.player = new window.Spotify.Player({
            name: 'Guessify Web Player',   //for the spotify connect devices
            getOAuthToken: (cb) => { cb(token); }, //function that provides auth token for the player
            volume: 0.7 //default audio level
        });
        // initialization error
        this.player.addListener('initialization_error', ({ message }) => {
            console.error('error for initialization:', message);
            reject(new Error(message));
        });
        // authentication error
        this.player.addListener('authentication_error', ({ message }) => {
            console.error('auth error:', message);
            reject(new Error(message));
        });
        //error for no premium
        this.player.addListener('account_error', ({ message }) => {
            console.error('account error, premium required:', message);
            reject(new Error('spotify premium is required to use this app'));
        });
        //playback error
        this.player.addListener('playback_error', ({ message }) => {
            console.error('playback error:', message);
        });

        //event listener for when the player is initialized and ready
        this.player.addListener('ready', ({ device_id }) => {
            console.log('ready with device id', device_id);
            this.deviceId = device_id; //device id for api calls
            this.isReady = true; //set the game as ready
            resolve(this.player); //resolve
        });
        //event for when the player isnt available
        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('device id has gone offline', device_id);
            this.isReady = false;
        });
        //connect to spotify api
        this.player.connect();
    }
    // function to play a snippet of the song track
    async playTrackSnippet(trackUri) {
        // error handling
        if (!this.isReady || !this.deviceId) {
            throw new Error('the player isnt ready');
        }

        // clear any existing playback timers
        if (this.playbackTimer) {
            clearTimeout(this.playbackTimer);
        }

        // calc a random spot in the song which will be used for the snippet
        this.snippetStartTime = Math.floor(Math.random() * 50000) + 10000; // Between 10s and 60s

        try {
            // get the token first
            const token = localStorage.getItem('spotify_access_token');

            // play random part of the song based on above
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                // request the api to play the song from the position we got
                body: JSON.stringify({
                    uris: [trackUri],
                    position_ms: this.snippetStartTime
                })
            });
            // store the current track we are going to use
            this.currentTrackId = trackUri;
            // after the snippet is done pause the song
            this.playbackTimer = setTimeout(() => {
                this.pausePlayback();
            }, this.snippetDuration);
            return true;
            //error handling
        } catch (error) {
            console.error('error playing the track snippet:', error);
            throw error;
        }
    }
    // pause song 
    async pausePlayback() {
        // if not ready return
        if (!this.isReady) return;
        // get token and use spotify api to pause the playback
        try {
            const token = localStorage.getItem('spotify_access_token');
            await fetch('https://api.spotify.com/v1/me/player/pause', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // error handling
        } catch (error) {
            console.error('error pausing the song:', error);
        }
    }
    // function to interact with the songs volume via spotify api 
    async setVolume(volumePercent) {
        if (!this.isReady || !this.player) return;
        // convert the percentange into 0-1 so it can be used with spotify api
        await this.player.setVolume(volumePercent / 100);
    }
    // clean and disconnect the player when needed
    async disconnect() {
        if (this.playbackTimer) {
            clearTimeout(this.playbackTimer);
        }
        // if player exists, pause and disconnect it
        if (this.player) {
            await this.pausePlayback();
            this.player.disconnect();
        }
    }
}

// export the instance to make sure the same player instance is used 
export const spotifyPlayer = new SpotifyPlayer();