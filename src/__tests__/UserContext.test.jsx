import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, waitFor } from '@testing-library/react';
import { UserProvider } from '../context/UserContext';
import * as spotifyApi from '../services/spotifyApi';
import { useUser } from '../context/UserContext';
import { act } from 'react-dom/test-utils';

// Mock the API service
jest.mock('../services/spotifyApi', () => ({
    getUserProfile: jest.fn()
}));

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test component that uses the context
const TestComponent = () => {
    const { user, loading, logout } = useUser();

    return (
        <div>
            {loading ? (
                <div>Loading user...</div>
            ) : user ? (
                <div>
                    <div data-testid="username">{user.display_name}</div>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <div>Not logged in</div>
            )}
        </div>
    );
};

describe('UserContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should show loading state initially', () => {
        // Mock valid token but slow API response
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'spotify_access_token') return 'fake-token';
            if (key === 'spotify_token_expiration') return String(new Date().getTime() + 3600000);
            return null;
        });

        spotifyApi.getUserProfile.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        expect(screen.getByText('Loading user...')).toBeInTheDocument();
    });

    test('should load user when token is valid', async () => {
        // Mock valid token
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'spotify_access_token') return 'fake-token';
            if (key === 'spotify_token_expiration') return String(new Date().getTime() + 3600000);
            return null;
        });

        // Mock user profile response
        spotifyApi.getUserProfile.mockResolvedValue({
            id: '123',
            display_name: 'Test User',
            images: [{ url: 'profile.jpg' }]
        });

        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('username')).toHaveTextContent('Test User');
        });
    });

    test('should handle logout', async () => {
        // Mock valid token
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'spotify_access_token') return 'fake-token';
            if (key === 'spotify_token_expiration') return String(new Date().getTime() + 3600000);
            return null;
        });

        // Mock user profile response
        spotifyApi.getUserProfile.mockResolvedValue({
            id: '123',
            display_name: 'Test User',
            images: [{ url: 'profile.jpg' }]
        });

        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        // Wait for user to load
        await waitFor(() => {
            expect(screen.getByTestId('username')).toHaveTextContent('Test User');
        });

        // Click logout button
        screen.getByText('Logout').click();

        // Check localStorage items were removed
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('spotify_access_token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('spotify_token_expiration');

        // Check UI updated
        await waitFor(() => {
            expect(screen.getByText('Not logged in')).toBeInTheDocument();
        });
    });
});