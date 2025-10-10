// src/store/api/dashboardApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { setAccessToken,clearAuth } from "../authSlice"; //clearauth
import type { RootState } from "../store";

const BASE_URL = "https://carenest-backend-8y2y.onrender.com/api/v1";
// const BASE_URL = 'http://localhost:4000/api/v1';

export const cdnURL = "https://dev-carenest.s3.ap-south-1.amazonaws.com";

// =============================
// Types
// =============================
export interface ProfileViewUser {
  id: string;
  userId: string;
  avatar: string; // relative path
  name: string;
  mobile: string;
  email: string;
  address: string;
  createdAt: string;
}

export interface ProfileViewsResponse {
  success: boolean;
  message: string;
  data: {
    seekers: ProfileViewUser[];
  };
}

// =============================
// Auth-aware base query
// =============================
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
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
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 || result?.error?.status === 403) {
    try {
      const refreshResult = await refreshQuery(
        { url: "/user/new-access-token", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken } = refreshResult.data as { accessToken: string };
        api.dispatch(setAccessToken(accessToken));
        Cookies.set("authToken", accessToken);

        return await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
      api.dispatch(clearAuth());
    }
  }

  return result;
};

// =============================
// Dashboard API
// =============================
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProfileViews: builder.query<ProfileViewsResponse, void>({
      query: () => ({
        url: "/views",
        method: "GET",
      }),
      transformResponse: (response: ProfileViewsResponse) => {
        // Fix avatar URLs
        const seekers = response.data.seekers.map((s) => {
          let avatar = s.avatar;
          if (avatar && !avatar.startsWith("http")) {
            avatar = `${cdnURL}${avatar}`;
          }
          return { ...s, avatar };
        });

        return {
          ...response,
          data: { seekers },
        };
      },
    }),
  }),
});

export const { useGetProfileViewsQuery } = dashboardApi;
