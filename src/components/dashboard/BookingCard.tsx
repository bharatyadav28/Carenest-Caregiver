import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BookingDetailsDialog from "@/components/dashboard/BookingDetailsDialog";
import {
  calendar
} from "@/lib/svg_icons";
interface WeeklySchedule {
  weekDay: number; // 0 = Sunday ... 6 = Saturday
  startTime: string;
  endTime: string;
}
export const cdnURL = "https://dev-carenest.s3.ap-south-1.amazonaws.com";

interface BookingCardProps {
  bookingId: string;
  status: string;
  bookedOn: string;
  startDate: string;
  endDate: string;
  meetingDate: string;
  zipcode: number;
  requiredBy: string;
  weeklySchedule: WeeklySchedule[];
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
    avatar: string | null;
    mobile: string;
    isDeleted: boolean;
  };
}

export function BookingCard({
  bookingId,

  bookedOn,
  startDate,
  meetingDate,
  endDate,
  zipcode,
  requiredBy,
  weeklySchedule,
  user: { name, email, mobile, address, avatar },
}: BookingCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  

  const bookingDetails = {
    id: bookingId,
    name,
    email,
    phone: mobile,
    address,
    avatar,
    bookedOn: new Date(bookedOn).toLocaleDateString(),
    careType: "Home care",
    startDate,
    meetingDate,
    endDate,
    zipcode,
    requiredBy,
    weeklySchedule,
  };

  return (
    <>
<div className="bg-white rounded-xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row flex-wrap justify-between items-start gap-4 sm:gap-6 shadow-sm border w-full">
  {/* Booking ID and Care Type */}
  <div className="flex flex-col gap-1 text-sm w-[270]  ">
    <div className="text-[12px] sm:text-[20px] font-medium text-[#1B2A37]">
      Booking ID: #{bookingId?.toString().slice(0,10).toUpperCase()}
    </div>
    <div>
      Care Type: <span className="text-[#7A8B9B]">Home Care</span>
    </div>
  </div>

  {/* User Info with Calendar */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:flex-1 sm:min-w-0 max-w-full">
    {/* Avatar and User Details */}
    <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto sm:flex-1 sm:min-w-0">
      <img
        src={avatar || "/profile-pic.png"}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1 sm:mt-0"
      />
      <div className="flex flex-col min-w-0 flex-1">
        <div className="text-[16px] sm:text-[18px] font-semibold text-[#1B2A37] truncate">
          {name}
        </div>
        <div className="text-sm text-[#7A8B9B] truncate ">
          {email}
        </div>
      </div>
    </div>

    {/* Calendar and Date */}
    <div className="flex items-center gap-2 flex-shrink-0 ml-0 sm:ml-4 mt-2 sm:mt-0">
      <div className="flex-shrink-0">{calendar}</div>
      <div className="text-[14px] sm:text-[16px] text-[#1B2A37] whitespace-nowrap">
        {startDate}
      </div>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end sm:justify-start flex-shrink-0">
    <Button
      className="bg-[#1B2A37] text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto min-w-[120px]"
      onClick={() => setShowDialog(true)}
    >
      View Details
    </Button>
  </div>
</div>  
      {showDialog && (
        <BookingDetailsDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          booking={bookingDetails}
        />
      )}
    </>
  );
}
