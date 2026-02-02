// store/api/subscriptionApi.ts - UPDATED
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; 

const BASE_URL = 'https://api.careworks.biz/api/v1';
// const BASE_URL = 'http://localhost:4000/api/v1';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  interval: string;
  displayAmount: string;
  isCurrentPrice?: boolean;
}

export interface PricingInfo {
  isOnOldPrice: boolean;
  currentPrice: string | null;
  priceDifference: {
    amount: number;
    formatted: string;
    isIncrease: boolean;
    percentage: number;
  } | null;
  needsRenewal: boolean;
  canRenewAtCurrentPrice: boolean;
  requiresPriceUpdate?: boolean;
}

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
  plan?: SubscriptionPlan;
  pricingInfo?: PricingInfo;
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
    currentPlan?: Plan;
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

export interface ReactivateResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string;
    requiresPriceUpdate?: boolean;
    checkoutUrl?: string;
    oldPrice?: string;
    newPrice?: string;
  };
}

export interface RenewResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string;
    oldPrice?: string;
    newPrice?: string;
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
    getMySubscription: builder.query<SubscriptionResponse, void>({
      query: () => '/subscriptions/my',
      providesTags: ['Subscription'],
    }),

    getPlans: builder.query<PlansResponse, void>({
      query: () => '/plans',
      providesTags: ['Plans'],
    }),

    createCheckout: builder.mutation<CheckoutResponse, void>({
      query: () => ({
        url: '/subscriptions/checkout',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    cancelSubscription: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/subscriptions/cancel',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    reactivateSubscription: builder.mutation<ReactivateResponse, void>({
      query: () => ({
        url: '/subscriptions/reactivate',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),

    checkSubscriptionStatus: builder.query<{ success: boolean; data: { status: any } }, void>({
      query: () => '/subscriptions/check',
    }),

    renewSubscription: builder.mutation<RenewResponse, void>({
      query: () => ({
        url: '/subscriptions/renew',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useGetMySubscriptionQuery,
  useGetPlansQuery,
  useCreateCheckoutMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useCheckSubscriptionStatusQuery,
  useRenewSubscriptionMutation,
} = subscriptionApi;