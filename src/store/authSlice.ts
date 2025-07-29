import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: Cookies.get('authToken') || null,
  refreshToken: Cookies.get('refreshToken') || null,
  isAuthenticated: !!Cookies.get('authToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ 
      accessToken: string; 
      refreshToken: string 
    }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      
      // Set cookies with appropriate expiration
      Cookies.set('authToken', action.payload.accessToken);
      Cookies.set('refreshToken', action.payload.refreshToken, { expires: 7 }); // 7 days for refresh token
    },
    
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      Cookies.set('authToken', action.payload);
    },
    
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      Cookies.remove('authToken');
      Cookies.remove('refreshToken');
    },
    
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      Cookies.remove('authToken');
      Cookies.remove('refreshToken');
    },
  },
});

export const { setCredentials, setAccessToken, clearAuth, logout } = authSlice.actions;
export default authSlice.reducer;