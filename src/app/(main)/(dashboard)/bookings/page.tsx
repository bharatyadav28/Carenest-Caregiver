"use client";

import React, { useState } from "react";
import { BookingCard } from "@/components/dashboard/BookingCard";
import bookingData from "@/lib/dummy_data/active-booking.json";
import { noBooking } from "@/lib/svg_icons";

const tabs = ["All", "Active", "Hired", "Rejected"] as const;
type Tab = typeof tabs[number];

function MyBookingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filteredBookings =
    activeTab === "All"
      ? bookingData
      : bookingData.filter(
          (b) => b.status?.toLowerCase() === activeTab.toLowerCase()
        );

  // Dynamic message based on tab
  const emptyMessageMap: Record<Tab, string> = {
    All: "No bookings right now",
    Active: "There are no active bookings",
    Hired: "There are no hired bookings",
    Rejected: "There are no rejected bookings",
  };

  return (
    <div className="flex flex-col gap-8 w-full card">
      <div className="text-[#1B2A37] text-[28px] font-medium">My Bookings</div>

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
      {filteredBookings.length === 0 ? (
        <div className="m-auto mt-10 flex flex-col items-center justify-center">
          {noBooking}
          <p className="text-center font-medium text-sm mt-2">
            {emptyMessageMap[activeTab]}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {filteredBookings.map((booking, index) => (
            <BookingCard key={index} {...booking} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookingPage;
