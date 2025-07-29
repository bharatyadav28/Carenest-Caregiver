import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout, clearAuth, setAccessToken } from '../authSlice';
import Cookies from 'js-cookie';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../store'; // Adjust import path as needed

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  mobile: string;
  role: 'giver' | 'receiver';
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId?: string;
    token?: string;
  };
}

interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
  };
}

interface RefreshTokenResponse {
  accessToken: string;
}

const baseAddr = 'https://carenest-backend-8y2y.onrender.com/api/v1/user';

// Typed base queries
const baseQuery = fetchBaseQuery({
  baseUrl: baseAddr,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const refreshQuery = fetchBaseQuery({
  baseUrl: baseAddr,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// Typed base query with reauth
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  const { refreshToken } = state.auth;

  if (!refreshToken) {
    api.dispatch(clearAuth());
    return await baseQuery(args, api, extraOptions);
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403 || result?.error?.status === 401) {
    try {
      const refreshResult = await refreshQuery(
        { url: '/new-access-token', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult?.error?.status === 401 || refreshResult?.error?.status === 404) {
        api.dispatch(clearAuth());
        return result;
      }

      if (refreshResult?.data) {
        const { accessToken } = refreshResult.data as RefreshTokenResponse;
        api.dispatch(setAccessToken(accessToken));
        Cookies.set('authToken', accessToken);
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      api.dispatch(clearAuth());
      return result;
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, {
      name: string;
      email: string;
      address: string;
      mobile: string;
      password: string;
      role: 'giver' | 'receiver';
    }>({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),

    verifyEmail: builder.mutation<AuthResponse, {
      userId: string;
      code: string;
      type: 'account_verification' | 'password_reset';
    }>({
      query: (verificationData) => ({
        url: '/verify-email',
        method: 'POST',
        body: verificationData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data.accessToken) {
            Cookies.set('authToken', data.data.accessToken, { expires: 1 });
            Cookies.set('refreshToken', data.data.refreshToken, { expires: 7 });
            dispatch(setCredentials({ 
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken
            }));
          } else if (data.data.token) {
            Cookies.set('resetToken', data.data.token, { expires: 1/24 });
          }
        } catch (error) {
          console.error('Verification failed:', error);
        }
      },
    }),

    signin: builder.mutation<AuthResponse, {
      email: string;
      password: string;
      role: 'giver' | 'receiver';
      rememberMe?: boolean;
    }>({
      query: (credentials) => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const expires = arg.rememberMe ? 7 : undefined;
          Cookies.set('authToken', data.data.accessToken, { expires });
          Cookies.set('refreshToken', data.data.refreshToken, { expires: 7 });
          dispatch(setCredentials({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken
          }));
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),

    resendOtp: builder.mutation<{
      success: boolean;
      message: string;
    }, {
      userId: string;
      type: 'account_verification' | 'password_reset';
    }>({
      query: (data) => ({
        url: '/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<SignupResponse, {
      email: string;
      role: 'giver' | 'receiver';
    }>({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{
      success: boolean;
      message: string;
    }, {
      password: string;
      role: 'giver' | 'receiver';
    }>({
      query: (data) => ({
        url: '/reset-password',
        method: 'PUT',
        body: data,
        headers: {
          'Authorization': `Bearer ${Cookies.get('resetToken') || ''}`
        }
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            Cookies.remove('resetToken');
          }
        } catch (error) {
          console.error('Password reset failed:', error);
        }
      },
    }),

    getMe: builder.query<User, void>({
      query: () => '/me',
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          Cookies.remove('authToken');
          Cookies.remove('refreshToken');
          dispatch(logout());
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyEmailMutation,
  useSigninMutation,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;