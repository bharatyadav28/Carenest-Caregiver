"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { useGetPlansQuery } from "@/store/api/subscriptionApi";

import { SimpleLine } from "@/components/common/HorizontalLines";
import { CustomButton } from "@/components/common/CustomButton";
import Checkout from "./Checkout";

interface Plan {
  id: string;
  name: string;
  description: string;
  amount: number; // in cents
  interval: string;
  displayAmount: string;
}

function ViewPlans() {
  const { data: plansData, isLoading } = useGetPlansQuery();
  const [openCheckout, setOpenCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading plans...</div>
      </div>
    );
  }

  const plans = plansData?.data?.plans || [];
  const paidPlan = plans.find(plan => plan.amount > 0);

  const handleCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
    setOpenCheckout(true);
  };

  // Free plan benefits (hardcoded)
  const freePlanBenefits = [
    "View and manage care schedules and profiles",
    "Secure in-app messaging with Admin",
    "Get booking reminders & Alerts ",
    "Basic customer support",
  ];

  const paidPlanBenefits = [
    "Verified Badge on your profile build instant trust with families",
    "See Who Viewed You access full customer details",
    "Priority Listing  appear at the top in caregiver searches",
    "First Call Advantage be the first to receive new consultation calls",
  ];

  return (
    <>
      <div className="flex flex-col items-center card">
        <div className="text-[1.6rem] font-medium mb-2">
          Select The <span className="text-primary">Best Plan</span> For Your Needs
        </div>
        <SimpleLine />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-4 w-full max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col h-full">
            <div className="px-6 py-8 bg-background flex flex-col rounded-2xl shadow-sm h-full">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-4xl text-center">
                  $0
                  <span className="text-2xl">/month</span>
                </div>
                <div className="text-sm text-[var(--slat-gray)] text-center">
                  Free Caregiver Plan
                </div>
                <div className="text-xs text-[var(--slat-gray)] text-center mt-1">
                  Limited features
                </div>
              </div>

              <SimpleLine />

              <div className="flex flex-col gap-4 my-6 flex-grow">
                {freePlanBenefits.map((benefit) => (
                  <div className="grid grid-cols-12 gap-2" key={benefit}>
                    <div className="col-start-1 col-end-3 pt-1">
                      <Check size={17} fontWeight={1000} />
                    </div>
                    <div className="col-start-3 col-end-13">{benefit}</div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4">
                <CustomButton 
                  className="text-lg w-full bg-[#B9B9B9] hover:bg-[#a8a8a8]"
                  disabled
                  onClick={() => console.log("hello")}
                >
                  Current Plan
                </CustomButton>
              </div>
            </div>
          </div>

          {/* Paid Plan */}
          {paidPlan && (
            <div className="flex flex-col h-full">
              <div className="px-6 py-8 bg-background flex flex-col rounded-2xl shadow-sm border-2 border-primary h-full">
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-4xl text-center">
                    {paidPlan.displayAmount}
                    <span className="text-2xl">/month</span>
                  </div>
                  <div className="text-sm text-[var(--slat-gray)] text-center">
                    {paidPlan.name}
                  </div>
                  <div className="text-xs text-primary text-center mt-1 font-medium">
                    Most Popular
                  </div>
                </div>

                <SimpleLine />

                <div className="flex flex-col gap-4 my-6 flex-grow">
                  {paidPlanBenefits.map((benefit) => (
                    <div className="grid grid-cols-12 gap-2" key={benefit}>
                      <div className="col-start-1 col-end-3 pt-1">
                        <Check size={17} fontWeight={1000} />
                      </div>
                      <div className="col-start-3 col-end-13">{benefit}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <CustomButton 
                    onClick={() => handleCheckout(paidPlan)}
                    className="text-lg w-full"
                  >
                    Choose Plan
                  </CustomButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedPlan && (
        <Checkout
          open={openCheckout}
          handleOpen={() => setOpenCheckout(false)}
          plan={selectedPlan}
        />
      )}
    </>
  );
}

export default ViewPlans;