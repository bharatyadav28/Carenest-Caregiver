// components/profile/subscription/PriceUpdateConfirmation.tsx - UPDATED
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
  oldPrice: string;
  newPrice: string;
  priceDifference?: {
    formatted: string;
    isIncrease: boolean;
  };
  renewalDate: string;
}

function PriceUpdateConfirmation({ 
  open, 
  handleOpen, 
  onConfirm, 
  isLoading, 
  oldPrice, 
  newPrice, 
  priceDifference,
  renewalDate 
}: Props) {
  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      className="lg:w-[32rem] w-[calc(100%-2rem)] px-6 py-6"
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="font-medium mx-auto lg:text-2xl text-lg">
            Confirm Price Update
          </div>
        </div>

        <div className="my-6 flex flex-col gap-4">
          <div className="text-gray-700 text-center">
            Our subscription price has changed. To continue your subscription, you need to accept the new price.
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm text-yellow-800 font-medium mb-3 text-center">
              Price Change Details:
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-600 font-medium">Current Price:</div>
              <div className="font-medium text-right line-through text-gray-500">
                {oldPrice}/month
              </div>
              
              <div className="text-gray-600 font-medium">New Price:</div>
              <div className="font-medium text-right text-green-600">
                {newPrice}/month
              </div>
              
              {priceDifference && (
                <>
                  <div className="text-gray-600 font-medium">Change:</div>
                  <div className={`font-medium text-right ${priceDifference.isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                    {priceDifference.isIncrease ? '+' : '-'}{priceDifference.formatted}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Important:</strong> You will NOT be charged immediately. 
              Your current subscription will continue at the old price until <strong>{renewalDate}</strong>.
              After that, your subscription will renew automatically at the new price of <strong>{newPrice}/month</strong>.
            </p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-700 font-medium mb-2">
              You'll keep all premium benefits:
            </div>
            <ul className="text-sm text-green-700 list-disc pl-4 space-y-1">
              <li>Verified Badge on your profile to build instant trust with families</li>
              <li>See Who Viewed You - access full customer details</li>
              <li>Priority Listing - appear at the top in caregiver searches</li>
              <li>First Call Advantage - be the first to receive new consultation calls</li>
              <li>Unlimited job applications and premium support</li>
            </ul>
          </div>
        </div>
  
        <div className="flex w-full gap-2">
          <TransaparentButton 
            onClick={handleOpen} 
            title="Cancel" 
            className="text-lg"
          />
          <DialogConfirmButton 
            title={isLoading ? "Updating..." : "Accept New Price"} 
            onClick={onConfirm}
            className="text-lg bg-yellow-600 hover:bg-yellow-700"
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default PriceUpdateConfirmation;