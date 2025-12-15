// components/profile/subscription/ReactivateConfirmation.tsx
"use client";
import React from "react";
import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";

interface Props {
  open: boolean;
  handleOpen: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  renewalDate: string;
}

function ReactivateConfirmation({ open, handleOpen, onConfirm, isLoading, renewalDate }: Props) {
  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      className="lg:w-[28rem] w-[calc(100%-2rem)] px-6 py-6"
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="font-medium lg:text-2xl text-lg">
            Reactivate Subscription
          </div>
        </div>

        <div className="my-6 flex flex-col gap-4">
          <div className="text-gray-700">
            Are you sure you want to reactivate your subscription?
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">
              Your subscription will be reactivated and will renew on <strong>{renewalDate}</strong>.
              You'll be charged the regular monthly rate at that time.
            </p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg mt-2">
            <ul className="text-sm text-green-700 list-disc pl-4">
              <li>Verified Badge on your profile build instant trust with families</li>
              <li>See Who Viewed You access full customer details</li>
              <li>Priority Listing  appear at the top in caregiver searches</li>
              <li>First Call Advantage be the first to receive new consultation calls</li>
            </ul>
          </div>
        </div>
  
        <div className="flex w-full gap-2">
          <TransaparentButton 
            onClick={handleOpen} 
            title="Cancel" 
          
          />
          <DialogConfirmButton 
            title={isLoading ? "Reactivating..." : "Confirm Reactivation"} 
            onClick={onConfirm}
          
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default ReactivateConfirmation;