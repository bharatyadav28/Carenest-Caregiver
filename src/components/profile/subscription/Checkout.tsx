// components/profile/subscription/Checkout.tsx
"use client";
import React from "react";
import { useCreateCheckoutMutation } from "@/store/api/subscriptionApi";

import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";

interface Plan {
  id: string;
  name: string;
  displayAmount: string;
  interval: string;
}

interface Props {
  open: boolean;
  handleOpen: () => void;
  plan: Plan;
}

function Checkout({ open, handleOpen, plan }: Props) {
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  const handleConfirm = async () => {
    try {
      const result = await createCheckout().unwrap();
      if (result.data.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      }
    } catch (error) {
      console.error("Failed to create checkout:", error);
      // You might want to show an error toast here
    }
  };

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      className="lg:w-[28rem] w-[calc(100%-2rem)] px-6 py-6"
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="font-medium lg:text-2xl text-lg">
            Subscription Details
          </div>
        </div>

        <div className="my-6 flex flex-col gap-4">
          <div className="flex justify-between text-lg">
            <div className="font-medium">Plan:</div>
            <div className="text-[var(--cool-gray)]">{plan.name}</div>
          </div>

          <div className="flex justify-between text-lg">
            <div className="font-medium">Amount:</div>
            <div className="text-[var(--cool-gray)]">
              {plan.displayAmount}/{plan.interval}
            </div>
          </div>

          <div className="flex justify-between text-lg">
            <div className="font-medium">Billing:</div>
            <div className="text-[var(--cool-gray)]">Monthly</div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              You will be redirected to Stripe to complete your payment securely.
              Your subscription will renew automatically each month until cancelled.
            </p>
          </div>
        </div>

        <div className="flex w-full gap-2">
          <TransaparentButton onClick={handleOpen} title="Cancel"  className="text-lg"/>
          <DialogConfirmButton 
            title={isLoading ? "Processing..." : "Checkout Now"} 
            onClick={handleConfirm}
            className="text-lg"
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default Checkout;