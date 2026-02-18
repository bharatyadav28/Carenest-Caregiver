"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ViewDetailsDialog from "@/components/dashboard/ViewDetailsDialog"; 
import { useGetProfileViewsQuery } from "@/store/api/dashboardApi";
import { useGetMySubscriptionQuery } from "@/store/api/subscriptionApi"; // Import subscription hook

interface ProfileView {
  id: string;
  name: string;
  role: string;
  time: string;
  avatar: string;
  phone: string;
  email: string;
  location: string;
  subscribed: boolean;
  createdAt: string;
}

// ✅ Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diffMs = now.getTime() - createdAt.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffHours < 24) {
    if (diffHours < 1) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  }
};

function ViewProfile() {
  const [selectedUser, setSelectedUser] = useState<ProfileView | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Check subscription status
  const { 
    data: subscriptionData, 
    isLoading: subscriptionLoading 
  } = useGetMySubscriptionQuery();

  // ✅ Call API for profile views (only if subscribed)
  const { data, isLoading, isError } = useGetProfileViewsQuery(undefined, {
    skip: !subscriptionData?.data?.hasActiveSubscription, // Skip API call if not subscribed
  });

  const hasActiveSubscription = subscriptionData?.data?.hasActiveSubscription || false;
  const subscriptionLoadingState = subscriptionLoading;
  
  // Process profile views only if user has subscription
  const profileViews: ProfileView[] = hasActiveSubscription 
    ? data?.data.seekers
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: "Care Seeker", 
          time: formatRelativeTime(s.createdAt),
          avatar: s.avatar,
          phone: s.mobile,
          email: s.email,
          location: s.address,
          subscribed: true,
          createdAt: s.createdAt,
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || []
    : [];

  const handleView = (viewer: ProfileView) => {
    setSelectedUser(viewer);
    setOpenDialog(true);
  };

  // Loading states
  if (subscriptionLoadingState) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
        <div className="text-center py-6 sm:py-10 text-[#7A8B9B]">
          Checking subscription status...
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
        <div className="text-center py-6 sm:py-10 text-[#7A8B9B]">
          Loading profile views...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
        <div className="text-center py-6 sm:py-10 text-red-500">
          Failed to load profile views
        </div>
      </div>
    );
  }

  // If user doesn't have a subscription
  if (!hasActiveSubscription) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6 w-full h-full items-center justify-center px-4 py-6 sm:py-10">
        <div className="text-[#233D4D] text-2xl sm:text-[28px] font-medium text-center">
          Profile Views
        </div>
        
        <div className="max-w-md text-center px-2">
          <p className="text-[#7A8B9B] text-base sm:text-lg mb-4 sm:mb-6">
            See who's interested in your profile by subscribing to our premium plan.
            Get insights into potential clients and increase your job opportunities.
          </p>
          
          <Button
            className="bg-[#1B2A37] text-white rounded-full px-5 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium hover:bg-[#1B2A37]/90 transition-colors w-full sm:w-auto"
            onClick={() => window.location.href = "/subscription"}
          >
            Get Subscription to View Profile Visitors
          </Button>
        </div>
      </div>
    );
  }

  // User has subscription, show profile views
  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full h-full px-3 sm:px-0">
      <div className="text-[#233D4D] text-xl sm:text-2xl md:text-[28px] font-medium px-1">
        Who&apos;s Looking at Your Profile
      </div>

      {profileViews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 sm:py-10 px-4">
          <img
            src={"/no-views.png"}
            alt="no views"
            className="object-cover mx-auto w-48 sm:w-64 md:w-auto"
          />
          <p className="text-[#7A8B9B] text-sm sm:text-base md:text-lg text-center mt-4 max-w-sm">
            No one has viewed your profile yet. Complete your profile and stay active to get noticed!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
          {/* Custom scrollbar styling */}
          <style jsx>{`
            .overflow-y-auto::-webkit-scrollbar {
              width: 4px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 10px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: #a8a8a8;
            }
            
            @media (min-width: 640px) {
              .overflow-y-auto::-webkit-scrollbar {
                width: 6px;
              }
            }
          `}</style>
          
          {profileViews.map((viewer) => (
            <div
              key={viewer.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 border border-[#F0F0F0] shadow-sm"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={viewer.avatar || "/image.svg"}
                  alt="avatar"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <span className="text-[#1B2A37] font-semibold text-base sm:text-[18px] truncate">
                      {viewer.name}
                    </span>
                    <span className="text-[#7A8B9B] text-xs sm:text-sm order-last sm:order-none">
                      {viewer.role}
                    </span>
                  </div>
                  <span className="text-[#1B2A37] text-xs sm:text-sm mt-0.5 sm:mt-1">
                    {viewer.time}
                  </span>
                </div>
              </div>
              
              <Button
                className="bg-[#1B2A37] text-white rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm w-full sm:w-auto ml-13 sm:ml-0"
                onClick={() => handleView(viewer)}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* View Details Dialog */}
      {openDialog && selectedUser && (
        <ViewDetailsDialog
          user={selectedUser}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </div>
  );
}

export default ViewProfile;