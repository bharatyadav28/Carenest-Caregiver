

import React, { useState } from "react";
import { BsCalendar2Event, BsClock } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import BookingDetailsDialog from "@/components/dashboard/BookingDetailsDialog";
// import CancelBookingDialog from "@/components/dashboard/CancelBookingDialog"; // Commented out

interface BookingCardProps {
  bookingId: string;
  status: string;
  bookedOn: string;
  appointmentDate: string;
  duration: number;
  service: string;
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
    avatar: string; // URL to the user's avatar
    mobile: string;
    isDeleted: boolean;
  };
}

export function BookingCard({
  bookingId,
  service,
  bookedOn,
  duration,
  appointmentDate,
  user: { name, email, mobile,address,avatar },
}: BookingCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  // const [showCancelDialog, setShowCancelDialog] = useState(false); // Commented out

  function formatDuration(duration: number): string {
    if (duration >= 30) {
      const months = Math.floor(duration / 30);
      const remainingDays = duration % 30;
      return `${months} month${months > 1 ? "s" : ""}${
        remainingDays > 0
          ? ` ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
          : ""
      }`;
    }
    return `${duration} day${duration > 1 ? "s" : ""}`;
  }
  const bookingDetails = {
    avatar: avatar, // use actual avatar if available
    name,
    address: address, // replace with real address if available
    id: bookingId,
    bookedOn: new Date(bookedOn).toLocaleDateString(),
    careType: service,
    bookingDate: new Date(appointmentDate).toLocaleDateString(), // replace with real appointmentDate if needed
    duration: formatDuration(duration),
    phone: mobile, // replace with actual if available
    email,
  };
  return (
    <>
      <div className="bg-white rounded-xl px-4 sm:px-6 py-4 flex flex-wrap justify-between items-start gap-4 shadow-sm border w-full">
        {/* Booking ID and Care Type */}
        <div className="flex flex-col gap-1 text-sm min-w-[150px] w-full sm:w-auto">
          <div className="text-[14px] sm:text-[20px] font-medium text-[#1B2A37]">
            Booking ID: #{bookingId}
            {/* Booking ID: #123495 */}
          </div>
          <div>
            Care Type: <span className="text-[#7A8B9B]">{service}</span>
          </div>
        </div>

        {/* Date and Duration */}
        <div className="flex flex-col gap-1 text-sm min-w-[120px] w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <BsCalendar2Event />
            <span>{new Date(bookedOn).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <BsClock />
            <span>{formatDuration(duration)} </span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 min-w-[180px] w-full sm:w-auto">
          <img
            src={avatar || "/profile-pic.png"}
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
          {/* 
          <Button
            className="border border-[#FF5C5C] text-[#FF5C5C] rounded-full text-sm w-full sm:w-auto mt-2"
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel Booking
          </Button>
          */}
        </div>
      </div>

      {showDialog && (
        <BookingDetailsDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          booking={bookingDetails}
        />
      )}

      {/* 
      {showCancelDialog && (
        <CancelBookingDialog
          open={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          bookingId={bookingId}
        />
      )}
      */}
    </>
  );
}