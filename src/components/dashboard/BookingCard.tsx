"use client";

import React, { useState } from "react";
import { BsCalendar2Event, BsClock } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import BookingDetailsDialog from "@/components/dashboard/BookingDetailsDialog";

interface BookingCardProps {
  id: string;
  careType: string;
  date: string;
  duration: string;
  name: string;
  email: string;
  avatar?: string;

}

export function BookingCard({
  id,
  careType,
  date,
  duration,
  name,
  email,
  avatar,

}: BookingCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl px-4 sm:px-6 py-4 flex flex-wrap justify-between items-start gap-4 shadow-sm border w-full">
        {/* Booking ID and Care Type */}
        <div className="flex flex-col gap-1 text-sm min-w-[150px] w-full sm:w-auto">
          <div className="text-[18px] sm:text-[20px] font-medium text-[#1B2A37]">
            Booking ID: {id}
          </div>
          <div>
            Care Type: <span className="text-[#7A8B9B]">{careType}</span>
          </div>
        </div>

        {/* Date and Duration */}
        <div className="flex flex-col gap-1 text-sm min-w-[120px] w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <BsCalendar2Event />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <BsClock />
            <span>{duration}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 min-w-[180px] w-full sm:w-auto">
          <img
            src={avatar || "/image.svg"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <div className="text-[18px] sm:text-[22px] font-semibold text-[#1B2A37]">
              {name}
            </div>
            <div className="text-sm text-[#7A8B9B] truncate max-w-[150px] sm:max-w-none">
              {email}
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            className="bg-[#1B2A37] text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto"
            onClick={() => setShowDialog(true)}
          >
            View Details
          </Button>
        </div>
      </div>

      {showDialog && (
<BookingDetailsDialog open={showDialog} onClose={() => setShowDialog(false)} />

      )}
    </>
  );
}
