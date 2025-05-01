import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, waitFor } from '@testing-library/react';
import { UserProvider } from '../context/UserContext';
import * as spotifyApi from '../services/spotifyApi';
import { useUser } from '../context/UserContext';
import { act } from 'react-dom/test-utils';

// mock api
jest.mock('../services/spotifyApi', () => ({
    getUserProfile: jest.fn()
}));

// mock local storage
const localStorageMock = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// test component that uses context
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
        // mock a working token but a slow api resposne
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'spotify_access_token') return 'fake-token';
            if (key === 'spotify_token_expiration') return String(new Date().getTime() + 3600000);
            return null;
        });

        spotifyApi.getUserProfile.mockImplementation(() => new Promise(() => { })); // never resolves

        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        expect(screen.getByText('Loading user...')).toBeInTheDocument();
    });

    test('should load user when token is valid', async () => {
        // mock w working token
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'spotify_access_token') return 'fake-token';
            if (key === 'spotify_token_expiration') return String(new Date().getTime() + 3600000);
            return null;
        });

        // mock the profile response
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
        // mocking a valid token
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'spotify_access_token') return 'fake-token';
            if (key === 'spotify_token_expiration') return String(new Date().getTime() + 3600000);
            return null;
        });

        // mocking the users profile response
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

        // waiting for the user to load
        await waitFor(() => {
            expect(screen.getByTestId('username')).toHaveTextContent('Test User');
        });
        //fixing
        // clicking logout  button
        screen.getByText('Logout').click();

        // making sure local storage items have been removed upon logout
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('spotify_access_token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('spotify_token_expiration');

        // make sure ui gets updated as well
        await waitFor(() => {
            expect(screen.getByText('Not logged in')).toBeInTheDocument();
        });
    });
});