import React from "react";
import { useRouter } from "next/navigation";
import { CustomDialog } from "@/components/common/CustomDialog";
import { arrow, message } from "@/lib/svg_icons";
interface WeeklySchedule {
  weekDay: number; // 0 = Sunday ... 6 = Saturday
  startTime: string;
  endTime: string;
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
    startDate: string;
    endDate: string;
    zipcode: number;
    requiredBy: string;
    weeklySchedule:WeeklySchedule[] ; 
    phone: string;
    email: string;
    status?: string;
  };
}

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

 

  return (
    <CustomDialog
      open={open}
      handleOpen={onClose}
      showCrossButton={true}
      className="max-w-[496px] w-full rounded-[24px] bg-[#F9FAFB] p-6"
    >
      <div className="flex flex-col gap-6 h-full">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <img
            src={data.avatar || "/profile-pic.png"}
            alt="avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-[20px] font-semibold text-[#1B2A37] leading-[24px] mb-2">
              {data.name}
            </h2>
            <p className="text-[16px] leading-[20px] text-[#7A8B9B] flex items-start">
              {arrow} {data.address}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            className="flex-1 bg-[#FFA629] hover:bg-[#e2941f] text-black rounded-full text-[14px] py-[10px] flex justify-center gap-2"
            onClick={handleMessageClick}
          >
            {message} Message
          </button>

    
        </div>

        {/* Booking Details */}
        <div>
          <h3 className="text-[16px] font-semibold text-[#1B2A37] mb-3">
            Booking Details
          </h3>
          <div className="text-[14px] leading-[20px] text-[#1B2A37] space-y-3">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span className="text-[#7A8B9B]">#{data.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Booked On:</span>
              <span className="text-[#7A8B9B]">{data.bookedOn}</span>
            </div>
            <div className="flex justify-between">
              <span>Care Type:</span>
              <span className="text-[#7A8B9B]">{data.careType}</span>
            </div>
            <div className="flex justify-between">
              <span>Meeting Date:</span>
              <span className="text-[#7A8B9B]">
                {new Date(data.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service End Date:</span>
              <span className="text-[#7A8B9B]">
                {new Date(data.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

   {/* Weekly Schedule Section */}
        <div>
          <h3 className="text-[16px] font-semibold text-[#1B2A37] mb-3">
            Weekly Schedule (This Schedule may vary)
          </h3>
          <div className="bg-white rounded-[16px] p-4">
            <div className="space-y-3">
              {data.weeklySchedule && data.weeklySchedule.length > 0 ? (
                // Create a copy of the array before sorting to avoid mutating props
                [...data.weeklySchedule]
                  .sort((a, b) => a.weekDay - b.weekDay) // Sort by day of week
                  .map((schedule, index) => (
                    <div key={index} className="flex justify-between">
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
    
        {/* Divider */}
        <div className="border-t border-[#E5E7EB] my-2"></div>

        {/* Contact Details */}
      
      </div>
    </CustomDialog>
  );
}