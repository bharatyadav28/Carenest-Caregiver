// BookingCard.tsx
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

interface CareType {
  id: string;
  name: string;
}

export const cdnURL = "https://creative-story.s3.us-east-1.amazonaws.com";

interface BookingCardProps {
  bookingId: string;
  status: string;
  bookedOn: string;
  startDate: string;
  endDate: string;
  meetingDate: string;
  zipcode: number;
  requiredBy: string;
  careTypes: CareType[]; // Added careTypes
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

// Utility function to check if date is default/invalid (1970-01-01)
const isDefaultDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return date.getFullYear() === 1970 && 
           date.getMonth() === 0 && 
           date.getDate() === 1;
  } catch (error) {
    return true;
  }
};

// Utility function to format date or return hyphen for default/invalid dates
const formatDateOrHyphen = (dateString: string): string => {
  try {
    // Check if date is null, undefined, or default (1970-01-01)
    if (!dateString || isDefaultDate(dateString)) {
      return '-';
    }
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

// Helper function to format care types into a comma-separated string
const formatCareTypes = (careTypes: CareType[]): string => {
  if (!careTypes || careTypes.length === 0) {
    return 'Home Care'; // Default fallback
  }
  
  // Join all service names with commas
  return careTypes.map(service => service.name).join(', ');
};

export function BookingCard({
  bookingId,
  bookedOn,
  startDate,
  meetingDate,
  endDate,
  zipcode,
  requiredBy,
  careTypes,
  weeklySchedule,
  user: { name, email, mobile, address, avatar },
}: BookingCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  // Format all dates
  const formattedBookedOn = formatDateOrHyphen(bookedOn);
  const formattedStartDate = formatDateOrHyphen(startDate);
  const formattedMeetingDate = formatDateOrHyphen(meetingDate);
  const formattedEndDate = formatDateOrHyphen(endDate);
  
  // Format care types
  const formattedCareType = formatCareTypes(careTypes);

  const bookingDetails = {
    id: bookingId,
    name,
    email,
    phone: mobile,
    address,
    avatar,
    bookedOn: formattedBookedOn,
    careType: formattedCareType, // Single string for display
    careTypes: careTypes, // Full array for details dialog
    startDate: formattedStartDate,
    meetingDate: formattedMeetingDate,
    endDate: formattedEndDate,
    zipcode,
    requiredBy,
    weeklySchedule,
  };

  return (
    <>
      <div className="bg-white rounded-xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row flex-wrap justify-between items-start gap-4 sm:gap-6 shadow-sm border w-full">
        {/* Booking ID and Care Type */}
        <div className="flex flex-col gap-1 text-sm w-[270]">
          <div className="text-[12px] sm:text-[20px] font-medium text-[#1B2A37]">
            Booking ID: #{bookingId?.toString().slice(0,10).toUpperCase()}
          </div>
          <div>
            Care Type: <span className="text-[#7A8B9B]">{formattedCareType}</span>
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
              <div className="text-sm text-[#7A8B9B] truncate">
                {email}
              </div>
            </div>
          </div>

          {/* Calendar and Date */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-0 sm:ml-4 mt-2 sm:mt-0">
            <div className="flex-shrink-0">{calendar}</div>
            <div className="text-[14px] sm:text-[16px] text-[#1B2A37] whitespace-nowrap">
              {formattedStartDate} {/* Display formatted date */}
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