import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BookingDetailsDialog from "@/components/dashboard/BookingDetailsDialog";

interface WeeklySchedule {
  weekDay: number; // 0 = Sunday ... 6 = Saturday
  startTime: string;
  endTime: string;
}

interface BookingCardProps {
  bookingId: string;
  status: string;
  bookedOn: string;
  startDate: string;
  endDate: string;
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
    endDate,
    zipcode,
    requiredBy,
    weeklySchedule,
  };

  return (
    <>
      <div className="bg-white rounded-xl px-4 sm:px-6 py-4 flex flex-wrap justify-between items-start gap-4 shadow-sm border w-full">
        {/* Booking ID and Care Type */}
        <div className="flex flex-col gap-1 text-sm min-w-[150px] w-full sm:w-auto">
          <div className="text-[14px] sm:text-[20px] font-medium text-[#1B2A37]">
            Booking ID: #{bookingId}
          </div>
          <div>
            Care Type: <span className="text-[#7A8B9B]">Home Care</span>
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

        {/* Action Buttons */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-col gap-2">
          <Button
            className="bg-[#1B2A37] text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto"
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
