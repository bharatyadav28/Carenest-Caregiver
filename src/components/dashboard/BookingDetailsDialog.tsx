// BookingDetailsDialog.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { CustomDialog } from "@/components/common/CustomDialog";
import { arrow, message } from "@/lib/svg_icons";

interface WeeklySchedule {
  weekDay: number; // 0 = Sunday ... 6 = Saturday
  startTime: string;
  endTime: string;
}

interface CareType {
  id: string;
  name: string;
}

interface BookingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  booking: {
    avatar: string | null;
    name: string;
    address: string;
    id: string;
    bookedOn: string;
    careType: string;
    careTypes?: CareType[]; // Added optional careTypes array
    startDate: string;
    endDate: string;
    meetingDate: string;
    zipcode: number;
    requiredBy: string;
    weeklySchedule: WeeklySchedule[];
    phone: string;
    email: string;
    status?: string;
  };
}

// Helper function to check if date is default (1970-01-01)
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

// Helper function to format date or show hyphen
const formatDateOrHyphen = (dateString: string): string => {
  // Check if date is null, undefined, empty, or default
  if (!dateString || isDefaultDate(dateString)) {
    return '----';
  }
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '----';
    }
    
    // Format as DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return '----';
  }
};

export default function BookingDetailsDialog({
  onClose,
  open,
  booking,
}: BookingDetailsDialogProps) {
  const data = booking;
  const router = useRouter();

  const handleMessageClick = () => {
    router.push("/inbox");
  };

  // Map weekDay numbers to day names
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Format time from "HH:MM:SS" to "HH:MM AM/PM"
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  // Format dates using the helper function
  const formattedMeetingDate = formatDateOrHyphen(data.meetingDate);
  const formattedStartDate = formatDateOrHyphen(data.startDate);
  const formattedEndDate = formatDateOrHyphen(data.endDate);
  const formattedBookedOn = formatDateOrHyphen(data.bookedOn);

  // Get care types for display
  const careTypes = data.careTypes && data.careTypes.length > 0
    ? data.careTypes
    : data.careType 
      ? [{ id: '1', name: data.careType }]
      : [{ id: '1', name: 'Home Care' }];

  return (
    <CustomDialog
      open={open}
      handleOpen={onClose}
      showCrossButton={true}
      className="max-w-[496px] w-full rounded-[24px] bg-[#F9FAFB] p-6 overflow-auto"
    >
      <div className="flex flex-col gap-6 h-full">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <img
              src={data.avatar || "/image.svg"}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          
          <div className="min-w-0 flex-1">
            <h2 className="text-[24px] p-2 font-semibold text-[#1B2A37] leading-[24px] mb-2 ">
              {data.name}
            </h2>
            
            {/* Address with icon - fixed layout */}
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                {arrow}
              </div>
              <p className="text-[18px] leading-[20px] text-[#7A8B9B] break-words flex-1 min-w-0">
                {data.address || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            className="flex-1 min-w-[200px] bg-[#FFA629] hover:bg-[#e2941f] text-black rounded-full text-[14px] py-[10px] flex justify-center items-center gap-2"
            onClick={handleMessageClick}
          >
            {message} Message
          </button>
        </div>

        {/* Booking Details */}
        <div>
          <h3 className="text-[20px] font-semibold text-[#1B2A37] mb-3">
            Booking Details
          </h3>
          <div className="text-[16px] leading-[20px] text-[#1B2A37] space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Booking ID:</span>
              <span className="text-[#7A8B9B] break-all text-right pl-2">#{data.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Booked On:</span>
              <span className="text-[#7A8B9B]">{formattedBookedOn}</span>
            </div>
            <div className="flex justify-between flex-wrap gap-y-1">
              <span className="font-medium">Care Type:</span>
              <div className="text-[#7A8B9B] text-right max-w-[60%]">
                <div className="flex flex-wrap gap-1 justify-end">
                  {careTypes.map((careType, index) => (
                    <span 
                      key={careType.id || index}
                      className="inline-block bg-[#EDF2F7] px-2 py-1 rounded-md text-[14px] whitespace-nowrap"
                    >
                      {careType.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Meeting Date:</span>
              <span className="text-[#7A8B9B]">{formattedMeetingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Service Start Date:</span>
              <span className="text-[#7A8B9B]">{formattedStartDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Service End Date:</span>
              <span className="text-[#7A8B9B]">{formattedEndDate}</span>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Section */}
        <div>
          <h3 className="text-[20px] font-semibold text-[#1B2A37] mb-3">
            Weekly Schedule  
            <span className="text-[16px] font-medium text-gray-600">  (This Schedule may vary)</span>
          </h3>
          <div className="bg-white rounded-[16px] p-4">
            <div className="space-y-3">
              {data.weeklySchedule && data.weeklySchedule.length > 0 ? (
                [...data.weeklySchedule]
                  .sort((a, b) => a.weekDay - b.weekDay)
                  .map((schedule, index) => (
                    <div key={index} className="flex justify-between flex-wrap gap-y-1">
                      <span className="font-medium text-[#1B2A37]">
                        {dayNames[schedule.weekDay]}
                      </span>
                      <span className="text-[#7A8B9B]">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-[#7A8B9B] text-center">No schedule available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
}