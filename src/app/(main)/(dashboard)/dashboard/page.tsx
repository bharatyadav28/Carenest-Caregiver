"use client";

import React from "react";
import { upgradePlanIcon, noBooking } from "@/lib/svg_icons";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { BookingCard } from "@/components/dashboard/BookingCard";

import statData from "@/lib/dummy_data/dashboard-stats.json";
import bookingData from "@/lib/dummy_data/active-booking.json";
import ProfileDialog from "@/components/dashboard/ProfileDialog";

function MyDashboardPage() {
  const data = statData.data;

 
  const activeBookings = bookingData.filter(
    (b) => b.status?.toLowerCase() === "active"
  );

  return (
    <div className="flex flex-col gap-8 w-full card ">
      <ProfileDialog/>
      <div className="text-[#fff] py-6 lg:px-12 px-4 md:px-8 test2 w-full h-max rounded-xl flex lg:flex-row flex-col justify-between lg:items-start items-center gap-4">
        <div className="max-w-[35rem] w-full">
          <div className="lg:text-xl md:text-2xl font-semibold">
          Join a Trusted Caregiver Network – Start Earning Today
          </div>
          <div className="mt-1 text-sm md:text-base">
       Subscribe now to access job opportunities, grow your profile. Whether you &apos;re a seasoned professional or 
       just starting out, we make it easy to get noticed and get hired.
          </div>
              <button className="bg-primary-foreground btn px-4 py-2 rounded-full text-[#fff] text-sm mt-3  ">
             Get Subscription Now
            </button>
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
      {activeBookings.length === 0 ? (
        <div className="m-auto mt-8">
          {noBooking}
          <p className="text-center text-sm font-medium mt-2">
            No bookings right now
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <div className="text-lg md:text-xl font-semibold text-[#1B2A37]">
            Active Booking
          </div>
          <div className="flex flex-col gap-4 w-full">
            {activeBookings.map((booking, index) => (
              <BookingCard key={index} {...booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDashboardPage;
