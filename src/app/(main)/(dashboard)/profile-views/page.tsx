"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ViewDetailsDialog from "@/components/dashboard/ViewDetailsDialog"; 
import { useGetProfileViewsQuery } from "@/store/api/dashboardApi"; // ✅ import API hook

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

  // ✅ Call API
  const { data, isLoading, isError } = useGetProfileViewsQuery();

  // ✅ Map backend seekers -> frontend ProfileView[]
  const profileViews: ProfileView[] =
    data?.data.seekers.map((s) => ({
      id: s.id,
      name: s.name,
      role: "Care Seeker", 
      time: formatRelativeTime(s.createdAt),
      avatar: s.avatar,
      phone: s.mobile,
      email: s.email,
      location: s.address,
      subscribed: true, // not available in backend response
    })) || [];

  const handleView = (viewer: ProfileView) => {
    setSelectedUser(viewer);
    setOpenDialog(true);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading profile views...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load profile views</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="text-[#233D4D] text-[28px] font-medium">
        Who&apos;s Looking  Your Profile
      </div>

      {profileViews.length === 0 ? (
        <div className="m-auto">
          <img
            src={"/no-views.png"}
            alt="no views"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {profileViews.map((viewer) => (
            <div
              key={viewer.id}
              className="flex justify-between items-center bg-white rounded-2xl px-6 py-4 border border-[#F0F0F0] shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={viewer.avatar || "/image.svg"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-[#1B2A37] font-semibold text-[18px]">
                    {viewer.name}
                  </span>
                  <span className="text-[#7A8B9B] text-sm">{viewer.role}</span>
                  <span className="text-[#1B2A37] text-sm mt-1">{viewer.time}</span>
                </div>
              </div>
              <Button
                className="bg-[#1B2A37] text-white rounded-full px-5 py-2 text-sm"
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
