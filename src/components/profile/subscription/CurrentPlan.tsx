// components/profile/subscription/CurrentPlan.tsx - UPDATED
"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { 
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useRenewSubscriptionMutation
} from "@/store/api/subscriptionApi";
import { binIconTheme } from "@/lib/svg_icons";
import { upgradePlanIcon } from "@/lib/svg_icons";
import { SimpleLine } from "@/components/common/HorizontalLines";
import ActionDialog from "@/components/common/ActionDialog";
import ReactivateConfirmation from "./ReactivateConfirmation";
import PriceUpdateConfirmation from "./PriceUpdateConfirmation"; 
import { toast } from "react-toastify";

interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan?: {
    name: string;
    displayAmount: string;
    isCurrentPrice?: boolean;
  };
  pricingInfo?: {
    isOnOldPrice: boolean;
    currentPrice: string | null;
    requiresPriceUpdate?: boolean;
    priceDifference?: {
      formatted: string;
      isIncrease: boolean;
    };
  };
}

interface Props {
  subscription: Subscription | null;
  refetch: () => void;
}

function CurrentPlan({ subscription, refetch }: Props) {
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const [reactivateSubscription, { isLoading: isReactivating }] = useReactivateSubscriptionMutation();
  const [renewSubscription, { isLoading: isRenewing }] = useRenewSubscriptionMutation();
  const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPriceUpdateConfirm, setShowPriceUpdateConfirm] = useState(false);
  const [priceUpdateInfo, setPriceUpdateInfo] = useState<{
    oldPrice?: string; 
    newPrice?: string;
    priceDifference?: {
      formatted: string;
      isIncrease: boolean;
    };
  }>({});

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription().unwrap();
      refetch();
      setShowCancelConfirm(false);
      
      toast.success("Subscription scheduled for cancellation. You'll keep access until the end of your billing period.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
      
      toast.error(
        error?.data?.message || 
        "Failed to cancel subscription. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const result = await reactivateSubscription().unwrap();
      
      if (result.data?.requiresPriceUpdate) {
        // Show price update confirmation instead
        setPriceUpdateInfo({
          oldPrice: result.data.oldPrice,
          newPrice: result.data.newPrice
        });
        setShowPriceUpdateConfirm(true);
      } else {
        refetch();
        setShowReactivateConfirm(false);
        
        toast.success("Subscription reactivated! It will now renew on the next billing date.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error: any) {
      if (error?.data?.requiresPriceUpdate) {
        setPriceUpdateInfo({
          oldPrice: error.data.oldPrice,
          newPrice: error.data.newPrice
        });
        setShowPriceUpdateConfirm(true);
      } else {
        console.error("Failed to reactivate subscription:", error);
        
        toast.error(
          error?.data?.message || 
          "Failed to reactivate subscription. Please try again.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    }
  };

  const handlePriceUpdateConfirm = async () => {
    try {
      const result = await renewSubscription().unwrap();
      
      toast.success(result.message || "Subscription price updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setShowPriceUpdateConfirm(false);
      refetch();
      
    } catch (error: any) {
      console.error("Failed to update subscription price:", error);
      toast.error(
        error?.data?.message || 
        "Failed to update subscription price. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  if (!subscription) {
    return (
      <div className="space-y-8">
        <div className="text-[#fff] py-6 lg:px-12 px-8 test w-full h-max rounded-xl flex lg:flex-row flex-col justify-between lg:items-start items-center gap-4">
          <div className="max-w-[35rem]">
            <div className="text-2xl font-semibold">
              No Active Subscription
            </div>
            <div className="mt-1">
              You don't have an active subscription. Please choose a plan to get started.
            </div>
          </div>
          <div>{upgradePlanIcon}</div>
        </div>
      </div>
    );
  }

  const isOnOldPrice = subscription.pricingInfo?.isOnOldPrice;
  const requiresPriceUpdate = subscription.pricingInfo?.requiresPriceUpdate;
  const isCancellingPlan = subscription.cancelAtPeriodEnd && subscription.status === 'active';
  const isActive = subscription.status === 'active' && !subscription.cancelAtPeriodEnd;
  const isCanceled = subscription.status === 'canceled';
  const isPastDue = subscription.status === 'past_due';

  const showCancelButton = isActive;
  const showReactivateButton = isCancellingPlan && !requiresPriceUpdate;
  const showUpdatePriceButton = isCancellingPlan && requiresPriceUpdate;
  const showResubscribeButton = isCanceled || isPastDue;

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <div className={`py-6 lg:px-12 px-8 w-full h-max rounded-xl flex lg:flex-row flex-col justify-between lg:items-start items-center gap-4 ${
        isOnOldPrice ? 'bg-yellow-500' :
        isCancellingPlan ? 'bg-yellow-500' : 
        isCanceled ? 'bg-red-100 text-red-800' :
        isPastDue ? 'bg-orange-100 text-orange-800' :
        'text-[#fff] test'
      }`}>
        <div className="max-w-[35rem]">
          {isOnOldPrice && isCancellingPlan ? (
            <>
              <div className="text-2xl font-semibold">
                Price Update Required
              </div>
              <div className="mt-1 text-lg">
                Our subscription price has changed from <strong>{subscription.plan?.displayAmount}</strong> to <strong>{subscription.pricingInfo?.currentPrice}</strong>.
              </div>
              <div className="mt-2 text-lg">
                Your current subscription will end on <strong>{formatDate(subscription.currentPeriodEnd)}</strong>.
                To continue, you need to accept the new price.
              </div>
            </>
          ) : isCancellingPlan ? (
            <>
              <div className="text-2xl font-semibold">
                Subscription Ending Soon
              </div>
              <div className="mt-1 text-lg">
                Your subscription is scheduled to end on <strong>{formatDate(subscription.currentPeriodEnd)}</strong>.
                You'll keep full access until then.
              </div>
              <div className="mt-2 text-lg">
                Want to continue? You can reactivate your subscription to keep your benefits.
              </div>
            </>
          ) : isCanceled ? (
            <>
              <div className="text-2xl font-semibold">
                Subscription Cancelled
              </div>
              <div className="mt-1">
                Your subscription has ended. To regain premium benefits, please choose a new plan.
              </div>
            </>
          ) : isPastDue ? (
            <>
              <div className="text-2xl font-semibold">
                Payment Required
              </div>
              <div className="mt-1">
                Your subscription payment failed. Please update your payment method to restore premium benefits.
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-semibold">
                Premium Caregiver Benefits
              </div>
              <div className="mt-1">
                You're currently on the {subscription.plan?.name || "Premium Plan"}. 
                Enjoy all premium features including unlimited job applications, 
                priority visibility, direct messaging, and premium support.
              </div>
            </>
          )}
        </div>
        <div>{upgradePlanIcon}</div>
      </div>

      {/* Subscription Details */}
      <div className="card border border-[#E5ECEB] rounded-xl p-6">
        <div className="text-3xl font-semibold mb-2">Subscription Details</div>
        <SimpleLine />
        
        <div className="border border-[#E5ECEB] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-9 grid lg:grid-cols-3 gap-y-6">
            <div className="subscription-details">
              <div className="font-medium text-gray-600">Plan:</div>
              <div className="text-lg font-medium">
                {subscription.plan?.name || "Premium Plan"}
                {isOnOldPrice && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Previous Price
                  </span>
                )}
              </div>
            </div>

            <div className="subscription-details">
              <div className="font-medium text-gray-600">Amount:</div>
              <div className="text-lg font-medium">
                {subscription.plan?.displayAmount || "$0.00"}/month
                {isOnOldPrice && subscription.pricingInfo?.currentPrice && (
                  <div className="text-sm text-gray-500 mt-1">
                    New price: {subscription.pricingInfo.currentPrice}/month
                    {subscription.pricingInfo.priceDifference && (
                      <span className={`ml-2 ${subscription.pricingInfo.priceDifference.isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                        ({subscription.pricingInfo.priceDifference.isIncrease ? '+' : '-'}{subscription.pricingInfo.priceDifference.formatted})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="subscription-details">
              <div className="font-medium text-gray-600">Status:</div>
              <div className={`text-lg font-medium ${
                isOnOldPrice ? 'text-yellow-600' :
                isCancellingPlan ? 'text-yellow-600' :
                subscription.status === 'active' ? 'text-green-600' : 
                subscription.status === 'canceled' ? 'text-red-600' : 
                subscription.status === 'past_due' ? 'text-orange-600' :
                'text-yellow-600'
              }`}>
                {isOnOldPrice ? "Price Update Required" :
                 isCancellingPlan ? "Cancelling at period end" : 
                 subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </div>
            </div>

            <div className="subscription-details">
              <div className="font-medium text-gray-600">
                {isCancellingPlan ? "Ends On:" : "Next Billing:"}
              </div>
              <div className="text-lg font-medium">
                {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : "N/A"}
              </div>
            </div>

            <div className="subscription-details">
              <div className="font-medium text-gray-600">Auto Renew:</div>
              <div className="text-lg font-medium">
                {isCancellingPlan ? "No" : subscription.status === 'active' ? "Yes" : "No"}
              </div>
            </div>

            <div className="subscription-details">
              <div className="font-medium text-gray-600">Price Status:</div>
              <div className="text-lg font-medium">
                {isOnOldPrice ? (
                  <span className="text-yellow-600">Previous Price</span>
                ) : subscription.plan?.isCurrentPrice ? (
                  <span className="text-green-600">Current Price</span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-3 items-center justify-center">
            {showCancelButton && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={isCancelling}
                className="bg-red-50 text-red-600 hover:bg-red-100 btn px-4 py-2 rounded-full text-sm transition-colors disabled:opacity-50 w-full"
              >
                {isCancelling ? "Processing..." : "Cancel Subscription"}
              </button>
            )}

            {showReactivateButton && (
              <button
                onClick={() => setShowReactivateConfirm(true)}
                disabled={isReactivating}
                className="bg-green-200 text-green-600 hover:bg-green-300 btn px-4 py-2 border-2 border-green-500 rounded-full text-sm transition-colors disabled:opacity-50 w-full"
              >
                {isReactivating ? "Processing..." : "Reactivate Subscription"}
              </button>
            )}

            {showUpdatePriceButton && (
              <button
                onClick={() => {
                  setPriceUpdateInfo({
                    oldPrice: subscription.plan?.displayAmount,
                    newPrice: subscription.pricingInfo?.currentPrice || undefined,
                    priceDifference: subscription.pricingInfo?.priceDifference
                  });
                  setShowPriceUpdateConfirm(true);
                }}
                disabled={isRenewing}
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 btn px-4 py-2 border-2 border-yellow-500 rounded-full text-sm transition-colors disabled:opacity-50 w-full"
              >
                {isRenewing ? "Processing..." : "Accept New Price"}
              </button>
            )}

            {showResubscribeButton && (
              <button
                onClick={() => window.location.href = "/subscription"}
                className="bg-primary-foreground text-white hover:bg-primary btn px-4 py-2 rounded-full text-sm transition-colors w-full"
              >
                Choose New Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ActionDialog
        open={showCancelConfirm}
        handleOpen={() => setShowCancelConfirm(false)}
        heading="Cancel Subscription"
        subheading={`Are you sure you want to cancel your subscription? You'll keep full access until the end of your billing period on ${formatDate(subscription.currentPeriodEnd)}.`}
        handleConfirm={handleCancelSubscription}
        confirmText={isCancelling ? "Processing..." : "Cancel Subscription"}
        icon={binIconTheme}
      />

      {/* Reactivate Confirmation Dialog */}
      {subscription.currentPeriodEnd && !isOnOldPrice && (
        <ReactivateConfirmation
          open={showReactivateConfirm}
          handleOpen={() => setShowReactivateConfirm(false)}
          onConfirm={handleReactivateSubscription}
          isLoading={isReactivating}
          renewalDate={formatDate(subscription.currentPeriodEnd)}
        />
      )}

      {/* Price Update Confirmation Dialog */}
      {isOnOldPrice && (
        <PriceUpdateConfirmation
          open={showPriceUpdateConfirm}
          handleOpen={() => setShowPriceUpdateConfirm(false)}
          onConfirm={handlePriceUpdateConfirm}
          isLoading={isRenewing}
          oldPrice={subscription.plan?.displayAmount || ""}
          newPrice={subscription.pricingInfo?.currentPrice || ""}
          priceDifference={subscription.pricingInfo?.priceDifference}
          renewalDate={formatDate(subscription.currentPeriodEnd)}
        />
      )}
    </div>
  );
}

export default CurrentPlan;