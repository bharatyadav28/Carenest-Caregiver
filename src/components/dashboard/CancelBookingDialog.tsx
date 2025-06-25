"use client";
import { crossIcon } from "@/lib/svg_icons";
import React from "react";
import { CustomDialog } from "@/components/common/CustomDialog";
interface CancelBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelBookingDialog({
  open,
  onClose,
  onConfirm,
}: CancelBookingDialogProps) {
  return (
    <CustomDialog
      open={open}
      handleOpen={onClose}
      showCrossButton={false}
      className="!w-[346px] !rounded-[16px] !p-6"  
    >
      <div className="flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#FFECCC] flex items-center justify-center ">  
          <div>{crossIcon}</div>
        </div>

        {/* Title */}
        <div className="text-[18px] font-semibold text-[#1B2A37]">
          Request to cancel booking
        </div>

        {/* Description */}
        <div className="text-sm text-[#7A8B9B]">
          You’re about to cancel your booking. Any ongoing or scheduled services
          will be discontinued.
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-2 w-full">
          <button
            onClick={onClose}
            className="flex-1 bg-[#F4F4F4] text-[#1B2A37] rounded-full py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#F2A307] hover:bg-[#e18b35] text-black rounded-full py-2 text-sm font-medium"
          >
            Confirm  
          </button>
        </div>
      </div>
    </CustomDialog>
  );
}
