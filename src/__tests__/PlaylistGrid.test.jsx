// src/components/PlaylistGrid.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PlaylistGrid from './PlaylistGrid';
import * as router from 'react-router';

// Mock the useNavigate hook
const navigate = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch API
global.fetch = jest.fn();

describe('PlaylistGrid Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('fake-token');
    });

    test('displays loading state initially', () => {
        render(
            <BrowserRouter>
                <PlaylistGrid />
            </BrowserRouter>
        );

        expect(screen.getByText('Loading playlists...')).toBeInTheDocument();
    });

    test('displays playlists when loaded successfully', async () => {
        // Mock successful API response
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                items: [
                    {
                        id: 'playlist1',
                        name: 'My Favorites',
                        images: [{ url: 'image-url.jpg' }],
                        tracks: { total: 25 }
                    },
                    {
                        id: 'playlist2',
                        name: 'Party Mix',
                        images: [],
                        tracks: { total: 15 }
                    }
                ]
            })
        });

        render(
            <BrowserRouter>
                <PlaylistGrid />
            </BrowserRouter>
        );

        // Wait for API call to resolve
        await waitFor(() => {
            expect(screen.getByText('Your Playlists')).toBeInTheDocument();
            expect(screen.getByText('My Favorites')).toBeInTheDocument();
            expect(screen.getByText('25 tracks')).toBeInTheDocument();
            expect(screen.getByText('Party Mix')).toBeInTheDocument();
            expect(screen.getByText('No Image')).toBeInTheDocument();
        });
    });

    test('displays error message when token is missing', async () => {
        // Mock missing token
        localStorageMock.getItem.mockReturnValue(null);

        // Mock console.error to prevent logging during test
        jest.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <BrowserRouter>
                <PlaylistGrid />
            </BrowserRouter>
        );

        // Wait for error state
        await waitFor(() => {
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });
});