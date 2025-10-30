import React, { useState } from "react";
import { Check } from "lucide-react";

import { SimpleLine } from "@/components/common/HorizontalLines";
import data from "@/lib/dummy_data/plans.json";
import { CustomButton } from "@/components/common/CustomButton";
import Checkout from "./Checkout";

export const plansType = [
  { key: "Monthly", value: "monthly" },
  {
    key: "Yearly",
    value: "yearly",
  },
];

interface Props {
  setHasSubscription: React.Dispatch<React.SetStateAction<boolean>>;
}
function ViewPlans({ setHasSubscription }: Props) {
  const plans = data?.plans;
  const [visiblePlan, setVisiblePlan] = useState(plans[0]);
    const [visiblePlans, setVisiblePlans] = useState(plans[1]);
  const [openCheckout, setOpenCheckout] = useState(false);

  const handleVisiblePlan = (planPeroid: string) => {
    const plan = plans?.find((p) => p.period === planPeroid);
    if (plan) setVisiblePlan(plan);
  };
    const handleVisiblePlans = (planPeroid: string) => {
    const plan = plans?.find((p) => p.period === planPeroid);
    if (plan) setVisiblePlans(plan);
  };


  const handleCheckout = () => {
    setOpenCheckout((prev) => !prev);
  };
    const handleCheckouts = () => {
   console.log("current plan clicked");
  };

  const planPeroid = visiblePlan?.period;

  return (
    <>
      <div className="flex flex-col items-center card  ">
        <div className="text-[1.6rem] font-medium mb-2">
          Select the <span className="text-primary">best plan</span> for your
          needs
        </div>

        <SimpleLine />
        <div className="flex flex-row lg:gap-8 gap-4 mt-8 mb-4">

        <div className="lg:w-[25rem] px-6 py-8 bg-background flex flex-col rounded-2xl my-8 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-4xl text-center">
              $0
              <span className="text-2xl">/{visiblePlan.interval}</span>
            </div>
            <div className="text-sm text-[var(--slat-gray)] text-center">
             Free Caregiver Plan but limited features
            </div>
          </div>

          <div className="flex gap-2 w-max mx-auto items-center rounded-full px-2 py-1 bg-[#233D4D1A] text-sm font-medium my-6">
            {plansType?.map((plan) => (
              <button
                key={plan.key}
                className={`py-2 text-center rounded-full ${
                  planPeroid === plan.value
                    ? "bg-primary-foreground text-[#fff]"
                    : ""
                } btn w-[4rem]`}
                onClick={() => handleVisiblePlans(plan.value)}
              >
                {plan.key}
              </button>
            ))}
          </div>

          <SimpleLine />

          <div className="flex flex-col gap-4 my-6">
            {visiblePlans?.benefits.map((benefit) => (
              <div className=" grid cols-12 gap-2" key={benefit}>
                <div
                  className=" col-start-1 pt-1
               col-end-3"
                >
                  {<Check size={17} fontWeight={1000} />}
                </div>
                <div className="col-start-3 col-end-13">{benefit}</div>
              </div>
            ))}
          </div>

          <CustomButton onClick={handleCheckouts} className="text-lg mt-32 bg-[#B9B9B9]">
          Current Plan
          </CustomButton>
        </div>
              <div className="lg:w-[25rem] px-6 py-8 bg-background flex flex-col rounded-2xl my-8 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-4xl text-center">
              {visiblePlan.price}
              <span className="text-2xl">/{visiblePlan.interval}</span>
            </div>
            <div className="text-sm text-[var(--slat-gray)] text-center">
              {visiblePlan.name}
            </div>
          </div>

          <div className="flex gap-2 w-max mx-auto items-center rounded-full px-2 py-1 bg-[#233D4D1A] text-sm font-medium my-6">
            {plansType?.map((plan) => (
              <button
                key={plan.key}
                className={`py-2 text-center rounded-full ${
                  planPeroid === plan.value
                    ? "bg-primary-foreground text-[#fff]"
                    : ""
                } btn w-[4rem]`}
                onClick={() => handleVisiblePlan(plan.value)}
              >
                {plan.key}
              </button>
            ))}
          </div>

          <SimpleLine />

          <div className="flex flex-col gap-4 my-6">
            {visiblePlan?.benefits.map((benefit) => (
              <div className=" grid cols-12 gap-2" key={benefit}>
                <div
                  className=" col-start-1 pt-1
               col-end-3"
                >
                  {<Check size={17} fontWeight={1000} />}
                </div>
                <div className="col-start-3 col-end-13">{benefit}</div>
              </div>
            ))}
          </div>

          <CustomButton onClick={handleCheckout} className="text-lg mt-4">
            Choose Plan
          </CustomButton>
        </div>
        </div>
      </div>

      <Checkout
        open={openCheckout}
        handleOpen={handleCheckout}
        visiblePlan={visiblePlan}
        handleVisiblePlan={handleVisiblePlan}
        setHasSubscription={setHasSubscription}
      />
    </>
  );
}

export default ViewPlans;
