import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to Log out the User
export const logoutEmployee = createAsyncThunk('auth/logoutEmployee', async (_, { dispatch, rejectWithValue }) => {
    try {
        // Make a backend request to log out the user and destroy the session (or JWT)
        const response = await axios.post('http://localhost:8081/api/v1/employee/logoutEmployee', {}, { withCredentials: true });

        // Once the backend confirms logout, return success
        console.log(response);
        return response.data;
    } catch (error) {
        return rejectWithValue('Logout failed');
    }
});

// Async Thunk to Initialize Authentication (same as before)
export const  initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { dispatch, rejectWithValue }) => {
    try {
        // Check tokens in cookies (access token should be sent via cookies)
        const response = await axios.post(
            'http://localhost:8081/api/v1/auth/validate',
            {},
            { withCredentials: true }
        );

        // Destructure and get accessString, accessToken, refreshToken from response
        const { accessString, accessToken, refreshToken } = response.data;
        dispatch(loginSuccess({ accessToken, refreshToken, accessString }));
    } catch (error) {
        return rejectWithValue('Token validation failed');
    }
});

// Initial State
const initialState = {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    accessString: null,
    status: 'idle',
    error: null,
};

// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { accessToken, refreshToken, accessString } = action.payload;
            state.isLoggedIn = true;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.accessString = accessString;

            // Store tokens and accessString in localStorage for persistence
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('accessString', accessString);
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.accessString = null;

            // Clear tokens and accessString from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessString');
        },
    },
    extraReducers: (builder) => {
        builder
            // When logoutEmployee is pending, update the state to loading
            .addCase(logoutEmployee.pending, (state) => {
                state.status = 'loading';
            })
            // When logoutEmployee is successful, clear the state and localStorage
            .addCase(logoutEmployee.fulfilled, (state) => {
                state.status = 'idle';
                state.isLoggedIn = false;
                state.accessToken = null;
                state.refreshToken = null;
                state.accessString = null;

                // Clear tokens from localStorage on successful logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessString');
            })
            // Handle errors in logout action
            .addCase(logoutEmployee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Logout failed';
            })
            // Other reducers for initializeAuth as before
            .addCase(initializeAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(initializeAuth.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Initialization failed';
            });
    },
});

export default authSlice.reducer;
export const { loginSuccess, logout } = authSlice.actions;
