"use client";
import React, { useState } from "react";
import { BsCalendar2Event, BsClock } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import BookingDetailsDialog from "@/components/dashboard/BookingDetailsDialog"; // Import dialog

interface ActiveBookingCardProps {
  id: string;
  careType: string;
  date: string;
  duration: string;
  name: string;
  email: string;
  avatar?: string;

}

export function ActiveBookingCard({
  id,
  careType,
  date,
  duration,
  name,
  email,
  avatar,
 
}: ActiveBookingCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl px-4 sm:px-6 py-4 flex flex-wrap justify-between items-start gap-4 sm:gap-y-4 shadow-sm border w-full">
        {/* Booking ID and Care Type */}
        <div className="flex flex-col gap-1 text-sm min-w-[150px] sm:min-w-[200px] w-full sm:w-auto">
          <div className="flex items-center gap-1 font-medium text-[#1B2A37] text-[18px] sm:text-[20px]">
            Booking ID: {id}
          </div>
          <div>
            Care Type: <span className="text-[#7A8B9B]">{careType}</span>
          </div>
        </div>

        {/* Date and Duration */}
        <div className="flex flex-col items-start text-sm gap-1 min-w-[120px] sm:min-w-[150px] w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <BsCalendar2Event className="text-base" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <BsClock className="text-base" />
            <span>{duration}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 min-w-[180px] sm:min-w-[220px] w-full sm:w-auto">
          <img
            src={avatar }
            alt="avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <div className="font-semibold text-[#1B2A37] text-[18px] sm:text-[22px]">
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

      {/* Dialog Modal */}
      {showDialog && <BookingDetailsDialog onClose={() => setShowDialog(false)} />}
    </>
  );
}
