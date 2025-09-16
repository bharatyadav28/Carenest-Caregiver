import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';
import { setAccessToken, clearAuth } from '../authSlice';
import type { RootState } from '../store';

const BASE_URL = 'https://carenest-backend-8y2y.onrender.com/api/v1';
export const cdnURL = "https://dev-carenest.s3.ap-south-1.amazonaws.com";

// ================== Types ==================
interface WeeklySchedule {
  weekDay: number;
  startTime: string;
  endTime: string;
}

interface BookingUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  isDeleted: boolean;
  avatar: string | null;
  address: string;
}

export interface Booking {
  bookingId: string;
  status: string;
  bookedOn: string;
  startDate: string;
  endDate: string;
  zipcode: number;
  requiredBy: string;
  weeklySchedule: WeeklySchedule[];
  user: BookingUser;
}

interface BookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: Booking[];
  };
}

// ================== Base Query with Auth ==================
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    return headers;
  },
});

const refreshQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

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

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearAuth());
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
        api.dispatch(clearAuth());
      }
    }

    return result;
  };

// ================== Booking API ==================
export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Get recent bookings
    getRecentBookings: builder.query<BookingsResponse, { status?: string }>({
      query: ({ status }) => ({
        url: `/booking/recent/giver${status ? `?status=${status}` : ''}`,
        method: 'GET',
      }),
      transformResponse: (response: BookingsResponse) => ({
        ...response,
        data: {
          ...response.data,
          bookings: response.data.bookings.map((b) => ({
            ...b,
            user: {
              ...b.user,
              avatar: b.user.avatar && !b.user.avatar.startsWith('http')
                ? `${cdnURL}/${b.user.avatar}`
                : b.user.avatar,
            },
          })),
        },
      }),
    }),

    // Cancel booking
    cancelBooking: builder.mutation<{ success: boolean; message: string }, { bookingId: string }>({
      query: ({ bookingId }) => ({
        url: `/booking/${bookingId}/cancel/giver`,
        method: 'PUT',
      }),
    }),

    // Get booking details
    getBookingDetails: builder.query<
      { success: boolean; message: string; data: Booking },
      { bookingId: string; caregiverId: string; status?: string; bookedOn?: string }
    >({
      query: ({ bookingId, caregiverId, status, bookedOn }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (bookedOn) params.append('bookedOn', bookedOn);

        return {
          url: `/booking/${bookingId}?${params.toString()}`,
          method: 'GET',
          body: { caregiverId },
        };
      },
      transformResponse: (response: { success: boolean; message: string; data: Booking }) => ({
        ...response,
        data: {
          ...response.data,
          user: {
            ...response.data.user,
            avatar: response.data.user.avatar && !response.data.user.avatar.startsWith('http')
              ? `${cdnURL}/${response.data.user.avatar}`
              : response.data.user.avatar,
          },
        },
      }),
    }),
  }),
});

export const {
  useGetRecentBookingsQuery,
  useCancelBookingMutation,
  useGetBookingDetailsQuery,
} = bookingApi;
