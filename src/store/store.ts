import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './authSlice';
import { authApi } from './api/authApi';
import { profileApi } from './api/profileApi';
import { notificationApi } from './api/notificationApi';
import { bookingApi } from './api/bookingApi';
import {dashboardApi} from './api/dashboardApi';
import profileReducer from './profileSlice';
import {subscriptionApi} from './api/subscriptionApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    [authApi.reducerPath]: authApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, profileApi.middleware,bookingApi.middleware,dashboardApi.middleware,notificationApi.middleware,subscriptionApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
