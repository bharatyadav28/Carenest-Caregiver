import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { setAccessToken, clearAuth } from '../authSlice';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../store'; // Adjust import path as needed

// --------- Interfaces ---------
interface Profile {
  id: string;
  name: string;
  email: string;
  address: string;
  mobile: string;
  avatar: string | null;
  gender: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: Profile;
  };
}

interface UpdateProfilePayload {
  name: string;
  email: string;
  address: string;
  mobile: string;
  gender: string;
}

// interface AvatarPayload {
//   avatar: string;
// }

// For About Section
interface AboutData {
  about: string;
}

interface AboutResponse {
  success: boolean;
  message: string;
  data: AboutData;
}

interface ServiceItem {
  id: string;
  name: string;
}

interface ServiceNamesResponse {
  success: boolean;
  messages: string;
  data: {
    services: ServiceItem[];
  };
}

interface MyServicesResponse {
  success: boolean;
  message: string;
  data: {
    myServiceIds: string[];
  };
}

interface SaveMyServicesRequest {
  serviceIds: string[];
}

// --------- Job Profile Interfaces ---------
export interface JobProfile {
  id: string;
  userId: string;
  caregivingType: string;
  minPrice: number;
  maxPrice: number;
  locationRange: string;
  experienceMin: number;
  experienceMax: number;
  certified: boolean;
  languages: string[];
  prnMin: number;
  prnMax: number;
  isPrn: boolean;
  createdAt: string;
  updatedAt: string;
}

interface JobProfileResponse {
  success: boolean;
  message: string;
  data: {
    jobProfileData: JobProfile;
  };
}

interface UpdateJobProfilePayload {
  caregivingType: string;
  minPrice: number;
  maxPrice: number;
  locationRange: string;
  experienceMin: number;
  experienceMax: number;
  certified: boolean;
  languages: string[];
  prnMin: number;
  prnMax: number;
}

// --------- Why Choose Me Interfaces ---------
export interface WhyChooseMeEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface WhyChooseMeResponse {
  success: boolean;
  message?: string;
  data?: {
    whyChooseMeEntries: WhyChooseMeEntry[];
  };
}

interface CreateWhyChooseMePayload {
  title: string;
  description: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

// --------- Base URLs ---------
const baseUrl = 'https://carenest-backend-8y2y.onrender.com';

// --------- Base Queries ---------
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const refreshQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/api/v1/user`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.refreshToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
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
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 || result?.error?.status === 403) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;
    
    if (!refreshToken) {
      api.dispatch(clearAuth());
      return result;
    }

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

// --------- API Slice ---------
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['About', 'Profile', 'WhyChooseMe'],
  endpoints: (builder) => ({
    // 🔹 Get Profile
    getProfile: builder.query<Profile, void>({
      query: () => `/api/v1/giver/my-profile`,
      transformResponse: (res: ProfileResponse) => res.data.user,
      providesTags: ['Profile'],
    }),

    // 🔹 Update Profile
    updateProfile: builder.mutation<Profile, UpdateProfilePayload>({
      query: (data) => ({
        url: `/api/v1/giver/my-profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

// In profileApi.ts
updateAvatar: builder.mutation<
  { success: boolean; message: string },
  FormData
>({
  query: (formData) => ({
    url: `/api/v1/giver/avatar`,
    method: 'PUT',
    body: formData,
  }),
}),

    // 🔹 Delete Account
    deleteAccount: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: `/api/v1/giver`,
        method: 'DELETE',
      }),
    }),

    // 🔹 Change Password
    changePassword: builder.mutation<
      { success: boolean; message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: `/api/v1/giver/change-password`,
        method: 'PUT',
        body: data,
      }),
    }),

    // 🔹 Get About
    getAbout: builder.query<AboutData, void>({
      query: () => ({
        url: `/api/v1/about`,
        method: 'GET',
      }),
      transformResponse: (res: AboutResponse) => res.data,
      providesTags: ['About'],
    }),

    // 🔹 Update About
    updateAbout: builder.mutation<
      { success: boolean; message: string },
      { content: string }
    >({
      query: (body) => ({
        url: `/api/v1/about`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['About'],
    }),

    // 🔹 Get Job Profile
    getJobProfile: builder.query<JobProfile, void>({
      query: () => `/api/v1/job-profile`,
      transformResponse: (res: JobProfileResponse) => res.data.jobProfileData,
      providesTags: ['Profile'],
    }),

    // 🔹 Update Job Profile
    updateJobProfile: builder.mutation<
      { success: boolean; message: string },
      UpdateJobProfilePayload
    >({
      query: (data) => ({
        url: `/api/v1/job-profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    // 🔹 Get All Service Names
    getAllServiceNames: builder.query<ServiceItem[], void>({
      query: () => `/api/v1/service/names`,
      transformResponse: (res: ServiceNamesResponse) => res.data.services,
      providesTags: ['Profile'],
    }),

    // 🔹 Get My Selected Services
    getMyServices: builder.query<string[], void>({
      query: () => `/api/v1/my-service`,
      transformResponse: (res: MyServicesResponse) => res.data.myServiceIds,
      providesTags: ['Profile'],
    }),

    // 🔹 Update My Services
    updateMyServices: builder.mutation<
      { success: boolean; message: string },
      SaveMyServicesRequest
    >({
      query: (body) => ({
        url: `/api/v1/my-service`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    // 🔹 Get Why Choose Me Entries
    getWhyChooseMe: builder.query<WhyChooseMeEntry[], void>({
      query: () => `/api/v1/why-choose-me`,
      transformResponse: (res: WhyChooseMeResponse) => {
        if (!res.success || !res.data?.whyChooseMeEntries) {
          return [];
        }
        return res.data.whyChooseMeEntries;
      },
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: 'WhyChooseMe' as const, id })),
              { type: 'WhyChooseMe', id: 'LIST' },
            ]
          : [{ type: 'WhyChooseMe', id: 'LIST' }],
    }),

    // 🔹 Create Why Choose Me Entry
    createWhyChooseMe: builder.mutation<
      { success: boolean; message: string },
      CreateWhyChooseMePayload
    >({
      query: (body) => ({
        url: `/api/v1/why-choose-me`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'WhyChooseMe', id: 'LIST' }],
    }),

    // 🔹 Update Why Choose Me Entry
    updateWhyChooseMe: builder.mutation<
      { success: boolean; message: string },
      { id: string; title: string; description: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/v1/why-choose-me/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'WhyChooseMe', id }],
    }),

    // 🔹 Delete Why Choose Me Entry
    deleteWhyChooseMe: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/api/v1/why-choose-me/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'WhyChooseMe', id },
        { type: 'WhyChooseMe', id: 'LIST' },
      ],
    }),
  }),
});

// --------- Export Hooks ---------
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useDeleteAccountMutation,
  useChangePasswordMutation,
  useGetAboutQuery,
  useUpdateAboutMutation,
  useGetJobProfileQuery,
  useUpdateJobProfileMutation,
  useGetAllServiceNamesQuery,
  useGetMyServicesQuery,
  useUpdateMyServicesMutation,
  useGetWhyChooseMeQuery,
  useCreateWhyChooseMeMutation,
  useUpdateWhyChooseMeMutation,
  useDeleteWhyChooseMeMutation,
} = profileApi;