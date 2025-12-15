// store/api/subscriptionApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const BASE_URL = 'https://carenest-backend-8y2y.onrender.com/api/v1';
const BASE_URL = 'http://localhost:4000/api/v1';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'none';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  plan?: {
    id: string;
    name: string;
    description: string;
    amount: number;
    interval: string;
    displayAmount: string;
  };
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  amount: number;
  interval: string;
  displayAmount: string;
}

export interface SubscriptionResponse {
  success: boolean;
  data: {
    subscription: Subscription | null; 
    hasActiveSubscription: boolean;
  };
}

export interface PlansResponse {
  success: boolean;
  data: {
    plans: Plan[];
  };
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string;
  };
}

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
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
  tagTypes: ['Subscription', 'Plans'],
  endpoints: (builder) => ({
    // Get user's subscription
    getMySubscription: builder.query<SubscriptionResponse, void>({
      query: () => '/subscriptions/my',
      providesTags: ['Subscription'],
    }),

    // Get all plans
    getPlans: builder.query<PlansResponse, void>({
      query: () => '/plans',
      providesTags: ['Plans'],
    }),

    // Create checkout session
    createCheckout: builder.mutation<CheckoutResponse, void>({
      query: () => ({
        url: '/subscriptions/checkout',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/subscriptions/cancel',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

       // Reactivate subscription
    reactivateSubscription: builder.mutation<{
      success: boolean;
      message: string;
      data: any;
    }, void>({
      query: () => ({
        url: '/subscriptions/reactivate',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Check subscription status
    checkSubscriptionStatus: builder.query<{ success: boolean; data: { status: any } }, void>({
      query: () => '/subscriptions/check',
    }),
  }),
});

export const {
  useGetMySubscriptionQuery,
  useGetPlansQuery,
  useCreateCheckoutMutation,
  useCancelSubscriptionMutation,
  useCheckSubscriptionStatusQuery,
   useReactivateSubscriptionMutation,
} = subscriptionApi;