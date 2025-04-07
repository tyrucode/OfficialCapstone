// src/services/SpotifyPlayer.js
export class SpotifyPlayer {
    constructor() {
        this.player = null;
        this.deviceId = null;
        this.isReady = false;
        this.currentTrackId = null;
        this.snippetDuration = 5000; // 5 seconds in milliseconds
        this.snippetStartTime = 0;
        this.playbackTimer = null;
    }

    async initializePlayer() {
        return new Promise((resolve, reject) => {
            // Load Spotify Web Playback SDK script if not already loaded
            if (!window.Spotify) {
                const script = document.createElement('script');
                script.src = 'https://sdk.scdn.co/spotify-player.js';
                script.async = true;

                script.onload = () => {
                    // SDK will call window.onSpotifyWebPlaybackSDKReady
                    window.onSpotifyWebPlaybackSDKReady = this.onSpotifyWebPlaybackSDKReady.bind(this, resolve, reject);
                };

                script.onerror = (error) => {
                    reject(new Error('Failed to load Spotify Web Playback SDK'));
                };

                document.body.appendChild(script);
            } else if (this.player) {
                resolve(this.player);
            } else {
                window.onSpotifyWebPlaybackSDKReady = this.onSpotifyWebPlaybackSDKReady.bind(this, resolve, reject);
            }
        });
    }

    onSpotifyWebPlaybackSDKReady(resolve, reject) {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) {
            reject(new Error('No access token found'));
            return;
        }

        this.player = new window.Spotify.Player({
            name: 'Guessify Web Player',
            getOAuthToken: (cb) => { cb(token); },
            volume: 0.7
        });

        // Error handling
        this.player.addListener('initialization_error', ({ message }) => {
            console.error('Initialization error:', message);
            reject(new Error(message));
        });

        this.player.addListener('authentication_error', ({ message }) => {
            console.error('Authentication error:', message);
            reject(new Error(message));
        });

        this.player.addListener('account_error', ({ message }) => {
            console.error('Account error (Premium required):', message);
            reject(new Error('Spotify Premium is required to use this feature'));
        });

        this.player.addListener('playback_error', ({ message }) => {
            console.error('Playback error:', message);
        });

        // Ready
        this.player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            this.deviceId = device_id;
            this.isReady = true;
            resolve(this.player);
        });

        // Not Ready
        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            this.isReady = false;
        });

        // Connect to the player
        this.player.connect();
    }

    async playTrackSnippet(trackUri) {
        if (!this.isReady || !this.deviceId) {
            throw new Error('Player is not ready');
        }

        // Clear any existing timer
        if (this.playbackTimer) {
            clearTimeout(this.playbackTimer);
        }

        // Calculate a random position in the song (in milliseconds)
        // We'll get the track duration later, for now just use a random position
        // between 10-60 seconds to avoid intros
        this.snippetStartTime = Math.floor(Math.random() * 50000) + 10000; // Between 10s and 60s

        try {
            const token = localStorage.getItem('spotify_access_token');

            // Play the track from the random position
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uris: [trackUri],
                    position_ms: this.snippetStartTime
                })
            });

            this.currentTrackId = trackUri;

            // Stop playback after snippet duration
            this.playbackTimer = setTimeout(() => {
                this.pausePlayback();
            }, this.snippetDuration);

            return true;
        } catch (error) {
            console.error('Error playing track snippet:', error);
            throw error;
        }
    }

    async pausePlayback() {
        if (!this.isReady) return;

        try {
            const token = localStorage.getItem('spotify_access_token');
            await fetch('https://api.spotify.com/v1/me/player/pause', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error pausing playback:', error);
        }
    }

    async setVolume(volumePercent) {
        if (!this.isReady || !this.player) return;
        await this.player.setVolume(volumePercent / 100);
    }

    async disconnect() {
        if (this.playbackTimer) {
            clearTimeout(this.playbackTimer);
        }

        if (this.player) {
            await this.pausePlayback();
            this.player.disconnect();
        }
    }
}

// Export a singleton instance
export const spotifyPlayer = new SpotifyPlayer();