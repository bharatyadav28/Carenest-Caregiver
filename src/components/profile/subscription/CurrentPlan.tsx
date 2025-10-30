import React from "react";

import { upgradePlanIcon } from "@/lib/svg_icons";
import data from "@/lib/dummy_data/plans.json";
import { SimpleLine } from "@/components/common/HorizontalLines";

function CurrentPlan() {
  const subscriptionDetails = data.subscriptionDetails;

  return (
    <div className="">
      <div className="text-[#fff] py-6 lg:px-12 px-8 test w-full h-max rounded-xl flex lg:flex-row flex-col justify-between lg:items-start items-center gap-4">
        <div className="max-w-[35rem]">
          <div className="text-2xl font-semibold">
            Upgrade to Yearly & Save More!
          </div>
          <div className="mt-1">
            Unlock all premium features for a full year and enjoy uninterrupted
            access to top caregiver benefits. With the yearly plan, you’ll save
            money, stay visible, and get priority access to care requests — all
            without monthly renewals.
          </div>
            <button className="bg-primary-foreground btn px-4 py-2 rounded-full text-[#fff] text-sm mt-3  ">
              Upgrade to Yearly
            </button>
        </div>
        <div>{upgradePlanIcon}</div>

      </div>

      <div className="card border  border-[#E5ECEB] rounded-xl mt-8 p-6 ">
        <div className="text-3xl font-semibold mb-2">Pro Caregiver Plantion Details</div>
        <SimpleLine />
        <div className="border  border-[#E5ECEB] rounded-xl p-6 grid grid-cols-12  gap-x-2 gap-y-8 mt-6">
          <div className="col-start-1 lg:col-end-10 col-end-13 grid lg:grid-cols-3 gap-y-3 ">
            <div className="subscription-details">
              <div>Plan:</div>
              <div>{subscriptionDetails.plan}</div>
            </div>

            <div className="subscription-details ">
              <div>Payment ID:</div>
              <div>{subscriptionDetails.paymentId}</div>
            </div>

            <div className="subscription-details ">
              <div>Status:</div>
              <div className="!text-[#5FC009]">
                {subscriptionDetails.status}
              </div>
            </div>

            <div className="subscription-details ">
              <div>Amount:</div>
              <div>{subscriptionDetails.amount}</div>
            </div>

            <div className="subscription-details ">
              <div>Payment Date:</div>
              <div>{subscriptionDetails.paymentDate}</div>
            </div>

            <div className="subscription-details ">
              <div>Expiring On:</div>
              <div>{subscriptionDetails.ExpiringOn}</div>
            </div>
          </div>

          <div className="lg:col-start-10 col-start-1 col-end-13 flex items-center ">
            <button className="bg-primary-foreground btn px-3 py-2 rounded-full text-[#fff] text-sm ">
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentPlan;
