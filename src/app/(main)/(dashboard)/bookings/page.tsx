"use client";

import React, { useState } from "react";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { noBooking } from "@/lib/svg_icons";
import { useGetRecentBookingsQuery } from "@/store/api/bookingApi";

// Updated tabs to match the new status values, excluding "rejected"
const tabs = ["All", "ProfilePicks", "hired", "active", "completed"] as const;
type Tab = typeof tabs[number];

function MyBookingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  // Map frontend tab to backend status
  const statusParam = activeTab === "All" ? "" : activeTab==="ProfilePicks"? "shortlisted": activeTab;

  const { data: bookingData, isLoading, isError } = useGetRecentBookingsQuery({
    status: statusParam,
  });

  const bookings = bookingData?.data.bookings || [];


  // Apply frontend filtering if needed (optional based on your API response)
  const filteredBookings = bookings;
  // You can add additional frontend filtering logic here if needed

  const emptyMessageMap: Record<Tab, string> = {
    All: "No bookings right now",
    ProfilePicks: "There are no shortlisted bookings",
    hired: "There are no hired bookings",
    active: "There are no active bookings",
    completed: "There are no completed bookings",

  };

  // Function to capitalize the first letter for display
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex flex-col gap-8 w-full card">
      <div className="text-[#1B2A37] text-[30px] font-medium">Bookings</div>

      {/* Tab Filters */}
      <div className="flex gap-4 flex-wrap ">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-full text-lg font-medium transition ${
              activeTab === tab
                ? "bg-[#1B2A37] text-white"
                : "text-[#1B2A37] border border-[#233D4D]"  
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {capitalizeFirst(tab=="ProfilePicks"?"Profile Picks" :tab)}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {isLoading ? (
        <div className="m-auto mt-10 text-sm font-medium text-center">
          Loading bookings...
        </div>
      ) : isError ? (
        <div className="m-auto mt-10 text-sm font-medium text-center text-red-500">
          Failed to fetch bookings
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="m-auto mt-10 flex flex-col items-center justify-center">
          {noBooking}
          <p className="text-center font-medium text-sm mt-2">
            {emptyMessageMap[activeTab]}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              bookingId={booking.bookingId}
              status={booking.status}
              bookedOn={booking.bookedOn}
              startDate={booking.startDate}
              endDate={booking.endDate}
              zipcode={booking.zipcode}
              requiredBy={booking.requiredBy}
              weeklySchedule={booking.weeklySchedule}
              user={booking.user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookingPage;