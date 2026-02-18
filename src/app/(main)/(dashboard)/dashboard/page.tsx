"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { upgradePlanIcon, noBooking } from "@/lib/svg_icons";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { BookingCard } from "@/components/dashboard/BookingCard";
import statData from "@/lib/dummy_data/dashboard-stats.json";
import { useGetRecentBookingsQuery } from "@/store/api/bookingApi";
import { useGetProfileQuery } from "@/store/api/profileApi";
import { useGetMySubscriptionQuery } from "@/store/api/subscriptionApi"; // Add this import
import ProfileDialog from "@/components/dashboard/ProfileDialog";

function MyDashboardPage() {
  const router = useRouter();
  const data = statData.data;
  const { data: bookingData, isLoading, isError } = useGetRecentBookingsQuery({
    status: "active",
  });
  const { data: profile } = useGetProfileQuery();
  const { data: subscriptionData, isLoading: subscriptionLoading } = useGetMySubscriptionQuery(); // Add subscription query

  const [showProfileDialog, setShowProfileDialog] = useState(false);

  useEffect(() => {
    const hasSeenDialogThisSession = sessionStorage.getItem("hasSeenProfileDialog");
    if (!hasSeenDialogThisSession) {
      setShowProfileDialog(true);
      sessionStorage.setItem("hasSeenProfileDialog", "true");
    }
  }, []);

  const bookings = bookingData?.data.bookings || [];
  const today = new Date();

  // Filter active bookings
  const activeBookings = bookings.filter((b) => new Date(b.startDate) <= today);

  // Sort by bookedOn date (most recent first)
  const sortedActiveBookings = [...activeBookings].sort((a, b) => {
    return new Date(b.bookedOn).getTime() - new Date(a.bookedOn).getTime();
  });

  // Get only the 4 most recently booked active bookings
  const latestActiveBookings = sortedActiveBookings.slice(0, 4);

  // Check if user has active subscription
  const hasActiveSubscription = subscriptionData?.data?.hasActiveSubscription || false;
  const subscription = subscriptionData?.data?.subscription || null;

  // Handle subscription button click
  const handleSubscriptionClick = () => {
    if (hasActiveSubscription) {
      // User already has subscription - show message or navigate to subscription details
  router.push("/subscription");
      // Or you can navigate to subscription details page:
      // router.push("/subscription");
    } else {
      // Navigate to subscription page
      router.push("/subscription");
    }
  };

  // Get subscription button text based on subscription status
  const getSubscriptionButtonText = () => {
    if (subscriptionLoading) return "Loading...";
    if (hasActiveSubscription) return "View Subscription";
    return "Get Subscription Now";
  };

  return (
    <div className="flex flex-col gap-8 w-full card">
      {showProfileDialog && (
        <ProfileDialog
          userName={profile?.name}
        />
      )}

      <div className="text-[#fff] py-6 lg:px-12 px-4 md:px-8 test2 w-full h-max rounded-xl flex lg:flex-row flex-col justify-between lg:items-start items-center gap-4">
        <div className="max-w-[35rem] w-full">
          <div className="lg:text-[1.4rem] md:text-2xl font-semibold">
            {hasActiveSubscription 
              ? "You're Part of Our Trusted Caregiver Network!" 
              : "Join a Trusted Caregiver Network – Start Earning Today"}
          </div>
          <div className="mt-1 !text-xl md:text-base">
            {hasActiveSubscription 
              ? "Your active subscription gives you access to premium job opportunities. Manage your subscription and explore additional features."
              : "Subscribe now to access job opportunities, grow your profile. Whether you're a seasoned professional or just starting out, we make it easy to get noticed and get hired."}
          </div>
          <button 
            className="bg-primary-foreground btn px-4 py-2 rounded-full text-[#fff] text-lg mt-3 hover:bg-primary-foreground/90 transition-colors"
            onClick={handleSubscriptionClick}
            disabled={subscriptionLoading}
          >
            {getSubscriptionButtonText()}
          </button>
          
          {/* Optional: Show subscription status badge */}
          {hasActiveSubscription && subscription && (
            <div className="mt-3 mx-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Active Plan: {subscription.plan?.name || "Premium"}</span>
            </div>
          )}
        </div>
        <div className="lg:mt-0 mt-4">{upgradePlanIcon}</div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {data.map((item, index) => (
          <DashboardStatCard key={index} {...item} index={index} />
        ))}
      </div>

      {/* Active Booking Section */}
      {isLoading ? (
        <div className="text-center mt-8 text-sm font-medium">
          Loading active bookings...
        </div>
      ) : isError || latestActiveBookings.length === 0 ? (
        <div className="m-auto mt-8">
          {noBooking}
          <p className="text-center text-lg font-medium mt-2">
            No active bookings right now
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center">
            <div className="!text-4xl font-semibold text-[#1B2A37]">
              Active Bookings
            </div>
            {sortedActiveBookings.length > 4 && (
              <div className="text-sm text-gray-500">
                Showing {latestActiveBookings.length} most recently booked
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full">
            {latestActiveBookings.map((booking, index: number) => (
              <BookingCard key={index} {...booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDashboardPage;