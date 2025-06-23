"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import profileViews from "@/lib/dummy_data/profile-views.json";
import ViewDetailsDialog from "@/components/dashboard/ViewDetailsDialog"; // adjust import as per your folder

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

function ViewProfile() {
  const [selectedUser, setSelectedUser] = useState<ProfileView | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleView = (viewer: ProfileView) => {
    setSelectedUser(viewer);
    setOpenDialog(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="text-[#233D4D] text-[28px] font-medium">
        Who is Looking Your Profile
      </div >
{profileViews.length === 0 ? <div className="m-auto">    <img
                src={ "/no-views.png"}
                alt="avatar"
                className="object-cover"
              /></div>:
      <div className="flex flex-col gap-4">
        {profileViews.map((viewer: ProfileView) => (
          <div
            key={viewer.id}
            className="flex justify-between items-center bg-white rounded-2xl px-6 py-4 border border-[#F0F0F0] shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={ "/image.svg"}
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
}
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
