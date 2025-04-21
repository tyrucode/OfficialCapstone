// src/pages/GameTimePage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameTimePage from '../pages/GameTimePage'
import { UserProvider } from '../context/UserContext';
import * as router from 'react-router';
import { spotifyPlayer } from '../services/spotifyPlayer';

// Mock router hooks
const navigate = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
jest.spyOn(router, 'useLocation').mockImplementation(() => ({
    state: {
        playlistId: 'playlist123',
        playlistName: 'Test Playlist',
        playlistImage: 'playlist-image.jpg'
    }
}));

// Mock Spotify Player service
jest.mock('../services/spotifyPlayer', () => ({
    spotifyPlayer: {
        initializePlayer: jest.fn().mockResolvedValue(true),
        playTrackSnippet: jest.fn().mockResolvedValue(true),
        pausePlayback: jest.fn().mockResolvedValue(true),
        setVolume: jest.fn(),
        disconnect: jest.fn()
    }
}));

// Mock API service
jest.mock('../services/apiService', () => ({
    saveUserScore: jest.fn().mockResolvedValue({})
}));

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn().mockReturnValue('fake-token'),
    setItem: jest.fn(),
    removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('GameTimePage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('redirects if no playlist ID is provided', () => {
        // Override useLocation mock for this test
        jest.spyOn(router, 'useLocation').mockImplementationOnce(() => ({
            state: null
        }));

        render(
            <UserProvider>
                <GameTimePage />
            </UserProvider>
        );

        expect(navigate).toHaveBeenCalledWith('/game');
    });

    test('shows loading state initially', () => {
        // Mock fetch to delay resolving
        global.fetch.mockImplementation(() => new Promise(() => { }));

        render(
            <UserProvider>
                <GameTimePage />
            </UserProvider>
        );

        expect(screen.getByText('Loading game...')).toBeInTheDocument();
    });

    test('handles guessing gameplay', async () => {
        // Mock premium user
        global.fetch.mockImplementation((url) => {
            if (url === 'https://api.spotify.com/v1/me') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ product: 'premium' })
                });
            } else if (url.includes('/playlists/playlist123')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        name: 'Test Playlist',
                        images: [{ url: 'playlist-image.jpg' }]
                    })
                });
            } else if (url.includes('/playlists/playlist123/tracks')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        items: [
                            {
                                track: {
                                    id: 'track1',
                                    name: 'Test Song',
                                    uri: 'spotify:track:track1',
                                    artists: [{ name: 'Test Artist' }],
                                    is_local: false
                                }
                            }
                        ]
                    })
                });
            }
            return Promise.reject(new Error('Unhandled fetch'));
        });

        render(
            <UserProvider>
                <GameTimePage />
            </UserProvider>
        );

        // Wait for game to load
        await waitFor(() => {
            expect(screen.getByText('Test Playlist')).toBeInTheDocument();
        });

        // Test play button
        const playButton = screen.getByText('Play Snippet');
        fireEvent.click(playButton);
        expect(spotifyPlayer.playTrackSnippet).toHaveBeenCalled();

        // Test making a guess (incorrect)
        const guessInput = screen.getByPlaceholderText('Enter song name...');
        userEvent.type(guessInput, 'Wrong Song');
        fireEvent.submit(screen.getByRole('button', { name: 'Guess' }));

        await waitFor(() => {
            expect(screen.getByText(/Wrong guess/)).toBeInTheDocument();
            expect(screen.getByText('Remaining guesses: 2')).toBeInTheDocument();
        });

        // Test making a correct guess
        userEvent.clear(guessInput);
        userEvent.type(guessInput, 'Test Song');
        fireEvent.submit(screen.getByRole('button', { name: 'Guess' }));

        await waitFor(() => {
            expect(screen.getByText(/Correct!/)).toBeInTheDocument();
            expect(screen.getByText('Play Again')).toBeInTheDocument();
        });
    });
});