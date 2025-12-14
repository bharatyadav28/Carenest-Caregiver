// api/notificationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  NotificationsResponse,
  UnreadCountResponse,
} from '../../lib/types/notification';

const BASE_URL = 'https://carenest-backend-8y2y.onrender.com/api/v1';
// const BASE_URL = 'http://localhost:4000/api/v1';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notifications', 'UnreadCount'],
  endpoints: (builder) => ({
    // Get notifications with pagination
    getNotifications: builder.query<
      NotificationsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: '/notifications',
        params: { page, limit },
      }),
      providesTags: ['Notifications'],
    }),

    // Get unread count
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/notifications/count',
      providesTags: ['UnreadCount'],
    }),

    // Mark notification as read
    markAsRead: builder.mutation<
      { success: boolean; message: string; data: { notification: Notification } },
      string
    >({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
    }),

    // Mark all as read (optional - you need to add this endpoint in backend)
    markAllAsRead: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useLazyGetNotificationsQuery,
} = notificationApi;