import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';
import { setAccessToken, clearAuth } from '../authSlice';
import type { RootState } from '../store';

const BASE_URL = 'https://carenest-backend-8y2y.onrender.com/api/v1';
export const cdnURL = "https://dev-carenest.s3.ap-south-1.amazonaws.com";

interface RecentBookingUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  avatar: string; // URL to the user's avatar
  isDeleted: boolean;
}

interface RecentBooking {
  bookingId: string;
  bookedOn: string;
  appointmentDate: string;
  duration: number;
  status: string;
  service: string;
  user: RecentBookingUser;
}

interface RecentBookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: RecentBooking[];
  };
}

// Auth-aware base query
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const refreshQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 || result?.error?.status === 403) {
    try {
      const refreshResult = await refreshQuery(
        { url: '/user/new-access-token', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken } = refreshResult.data as { accessToken: string };
        api.dispatch(setAccessToken(accessToken));
        Cookies.set('authToken', accessToken);

        return await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
      }
    } catch (err) {
      console.error('Failed to refresh token:', err);
      api.dispatch(clearAuth());
    }
  }

  return result;
};

// Booking API
export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getRecentBookings: builder.query<RecentBookingsResponse, { status?: string }>({
      query: ({ status }) => ({
        url: `/booking/recent/giver${status ? `?status=${status}` : ''}`,
        method: 'GET',
      }),
      transformResponse: (response: RecentBookingsResponse) => {
        // Append CDN URL to avatar if needed
        const bookings = response.data.bookings.map((booking) => {
          let avatar = booking.user.avatar;
          if (avatar && !avatar.startsWith("http")) {
            avatar = `${cdnURL}/${avatar}`;
          }
          return {
            ...booking,
            user: {
              ...booking.user,
              avatar,
            },
          };
        });
        return {
          ...response,
          data: {
            ...response.data,
            bookings,
          },
        };
      },
    }),
//cancel booking
    cancelBooking: builder.mutation<
  { success: boolean; message: string },
  { bookingId: string }
>({
  query: ({ bookingId }) => ({
    url: `/booking/${bookingId}/cancel/giver`,
    method: 'PUT',
  }),
}),

//Get booking details
    getBookingDetails: builder.query<
      {
        success: boolean;
        message: string;
        data: unknown;
      },
      {
        bookingId: string;
        caregiverId: string;
        status?: string;
        bookedOn?: string;
        appointmentDate?: string;
      }
    >({
      query: ({ bookingId, caregiverId, status, bookedOn, appointmentDate }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (bookedOn) params.append('bookedOn', bookedOn);
        if (appointmentDate) params.append('appointmentDate', appointmentDate);

        return {
          url: `/booking/${bookingId}?${params.toString()}`,
          method: 'GET',
          body: { caregiverId },
        };
      },
    }),
  }),
});

export const {
  useGetRecentBookingsQuery,
  useCancelBookingMutation,
  useGetBookingDetailsQuery,
} = bookingApi;

