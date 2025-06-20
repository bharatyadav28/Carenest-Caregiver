import React from "react";

import { CustomDialog } from "@/components/common/CustomDialog";
import { plansType } from "./ViewPlans";
import { planDataType } from "@/lib/interface-types";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";

interface Props {
  open: boolean;
  handleOpen: () => void;
  visiblePlan: planDataType;
  handleVisiblePlan: (planPeroid: string) => void;
  setHasSubscription: React.Dispatch<React.SetStateAction<boolean>>;
}

function Checkout({
  open,
  handleOpen,
  visiblePlan,
  handleVisiblePlan,
  setHasSubscription,
}: Props) {
  const planPeroid = visiblePlan?.period;

  const handleConfirm = () => {
    setHasSubscription(true);
    handleOpen();
  };

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      className="lg:w-[28rem] w-[calc(100%-2rem)] px-6 py-6"
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between ">
          <div className="font-medium lg:text-2xl text-lg">
            Subscription Details
          </div>

          <div className="flex  gap-2 w-max items-center h-max rounded-full px-2 py-1 bg-[#233D4D1A] text-sm font-medium ">
            {plansType?.map((plan) => (
              <button
                key={plan.key}
                className={`py-[0.3rem] text-center rounded-full ${
                  planPeroid === plan.value
                    ? "bg-primary-foreground text-[#fff]"
                    : ""
                } btn w-[3.5rem] text-xs `}
                onClick={() => handleVisiblePlan(plan.value)}
              >
                {plan.key}
              </button>
            ))}
          </div>
        </div>

        <div className="my-6 flex flex-col gap-2">
          <div className="flex justify-between text-lg">
            <div>Plan:</div>
            <div className="text-[var(--cool-gray)]">{visiblePlan.name}</div>
          </div>

          <div className="flex justify-between text-lg">
            <div>Amount:</div>
            <div className="text-[var(--cool-gray)]">
              {visiblePlan.price}/{visiblePlan.interval}
            </div>
          </div>
        </div>

        <div className="flex w-full gap-2 ">
          <TransaparentButton onClick={handleOpen} />
          <DialogConfirmButton title="Checkout now" onClick={handleConfirm} />
        </div>
      </div>
    </CustomDialog>
  );
}

export default Checkout;
