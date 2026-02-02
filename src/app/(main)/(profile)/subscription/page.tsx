// app/subscription/page.tsx
"use client";
import React, { useEffect } from "react";
import { useGetMySubscriptionQuery } from "@/store/api/subscriptionApi";

import CurrentPlan from "@/components/profile/subscription/CurrentPlan";
import ViewPlans from "@/components/profile/subscription/ViewPlans";

function SubscriptionPage() {
  const { data: subscriptionData, isLoading, refetch } = useGetMySubscriptionQuery();

  const hasSubscription = subscriptionData?.data?.hasActiveSubscription || false;
  const subscription = subscriptionData?.data?.subscription || null;

  const normalizedSubscription = subscription ? {
    ...subscription,
    pricingInfo: subscription.pricingInfo ? {
      ...subscription.pricingInfo,
      priceDifference: subscription.pricingInfo.priceDifference || undefined,
    } : undefined,
  } : null;

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading subscription information...</div>
      </div>
    );
  }

  return (
    <div>
      {!hasSubscription ? (
        <ViewPlans />
      ) : (
        <CurrentPlan subscription={normalizedSubscription} refetch={refetch} />
      )}
    </div>
  );
}

export default SubscriptionPage;