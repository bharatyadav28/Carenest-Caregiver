"use client";

import React, { useState } from "react";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { noBooking } from "@/lib/svg_icons";
import { useGetRecentBookingsQuery } from "@/store/api/bookingApi";

// Show "Requested" in frontend, but send "interested" to backend
const tabs = ["All", "Requested", "Hired", "Active", "Completed"] as const;
type Tab = typeof tabs[number];

function MyBookingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  // Map frontend tab to backend status
  const statusParam =
    activeTab === "All"
      ? ""
      : activeTab === "Requested"
      ? "interested"
      : activeTab === "Hired" || activeTab === "Active"
      ? "active" // both use same backend status
      : activeTab.toLowerCase();

  const { data: bookingData, isLoading, isError } = useGetRecentBookingsQuery({
    status: statusParam,
  });

  // Backend response
  const bookings = bookingData?.data.bookings || [];
  const today = new Date();

  // Apply frontend filtering
  let filteredBookings = bookings;
  if (activeTab === "Hired") {
    filteredBookings = bookings.filter(
      (b) => new Date(b.appointmentDate) > today
    );
  } else if (activeTab === "Active") {
    filteredBookings = bookings.filter(
      (b) => new Date(b.appointmentDate) <= today
    );
  }

  const emptyMessageMap: Record<Tab, string> = {
    All: "No bookings right now",
    Requested: "There are no requested bookings",
    Hired: "There are no hired bookings",
    Active: "There are no active bookings",
    Completed: "There are no complete bookings",
  };

  return (
    <div className="flex flex-col gap-8 w-full card">
      <div className="text-[#1B2A37] text-[30px] font-medium">Bookings</div>

      {/* Tab Filters */}
      <div className="flex gap-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-[#1B2A37] text-white"
                : "bg-[#F4F4F4] text-[#1B2A37]"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
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
              appointmentDate={booking.appointmentDate}
              duration={booking.duration}
              service={booking.service}
              user={booking.user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookingPage;
