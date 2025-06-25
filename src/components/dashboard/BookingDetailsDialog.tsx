"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { FiPhone, FiMail } from "react-icons/fi";
import { CustomDialog } from "@/components/common/CustomDialog";
import bookingData from "@/lib/dummy_data/booking-details.json";
import { arrow, message } from "@/lib/svg_icons";
import CancelBookingDialog from "@/components/dashboard/CancelBookingDialog"; // Import

interface BookingDetailsDialogProps {
  onClose: () => void;
  open: boolean;
}

interface BookingData {
  booking: {
    avatar: string;
    name: string;
    address: string;
    id: string;
    bookedOn: string;
    careType: string;
    bookingDate: string;
    duration: string;
    phone: string;
    email: string;
  };
}

export default function BookingDetailsDialog({
  onClose,
  open,
}: BookingDetailsDialogProps) {
  const data: BookingData = bookingData;
  const [showCancelDialog, setShowCancelDialog] = useState(false);
 const router = useRouter();
  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    // TODO: Add actual cancel booking logic here if needed
    onClose(); // optionally close main dialog after cancel
  };
    const handleMessageClick = () => {
    router.push('/inbox');
  };

  return (
    <>
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
              src={data.booking.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-[20px] font-semibold text-[#1B2A37] leading-[24px] mb-2">
                {data.booking.name}
              </h2>
              <p className="text-[16px] leading-[20px] text-[#7A8B9B] flex items-start">
                {arrow} {data.booking.address}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-[#FFA629] hover:bg-[#e2941f] text-black rounded-full text-[14px] py-[10px] flex justify-center gap-2"
              onClick={handleMessageClick}>
              {message} Message
            </button>
            <button
              className="flex-1 border border-[#FF5C5C] text-[#FF5C5C] rounded-full text-[14px] font-medium py-[10px]"
              onClick={() => setShowCancelDialog(true)}
            >
              Request to cancel
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
                <span className="text-[#7A8B9B]">#{data.booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Booked On:</span>
                <span className="text-[#7A8B9B]">{data.booking.bookedOn}</span>
              </div>
              <div className="flex justify-between">
                <span>Care Type:</span>
                <span className="text-[#7A8B9B]">{data.booking.careType}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Date:</span>
                <span className="text-[#7A8B9B]">{data.booking.bookingDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-[#7A8B9B]">{data.booking.duration}</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#1B2A37] mb-3">
              Contact Details
            </h3>

            <div className="bg-white rounded-[16px] px-4 py-3 flex items-center gap-3 text-[14px] text-[#1B2A37] mb-3">
              <FiPhone className="text-white bg-black text-[30px] rounded-full p-2 mt-2" />
              <div>
                <div className="mb-1">Phone number</div>
                <span className="text-[#7A8B9B]">{data.booking.phone}</span>
              </div>
            </div>

            <div className="bg-white rounded-[16px] px-4 py-3 flex items-center gap-3 text-[14px] text-[#1B2A37]">
              <FiMail className="text-white bg-black text-[30px] rounded-full p-2 mt-2" />
              <div>
                <div className="mb-1">Email ID</div>
                <span className="text-[#7A8B9B]">{data.booking.email}</span>
              </div>
            </div>
          </div>
        </div>
      </CustomDialog>

      {/* Cancel Booking Dialog */}
      <CancelBookingDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
}
