"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/store/api/authApi";
import { CustomButton } from "../../common/CustomButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { formatTime } from "@/lib/resuable_funs";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  isEmailVerify?: boolean;
}

function OTPForm({ isEmailVerify }: Props) {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();

  const handleSubmit = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    setIsLoading(true);
    try {
      const userId = Cookies.get("tempUserId");
      if (!userId) {
        toast.error("Session expired. Please try again.");
        router.push(isEmailVerify ? "/signup" : "/forgot-password");
        return;
      }

      const response = await verifyEmail({
        userId,
        code: otp,
        type: isEmailVerify ? "account_verification" : "password_reset"
      }).unwrap();

      if (response.success) {
        toast.success("OTP verified successfully!");
        
        if (isEmailVerify) {
          Cookies.set("authToken", response.data.accessToken, { expires: 1 });
          Cookies.set("refreshToken", response.data.refreshToken, { expires: 7 });
          Cookies.remove("tempUserId");
          router.push("/signup/documents");
        } else {
          Cookies.set("resetToken", response.data.token || "", { expires: 1/24 });
          router.push("/resets-password");
        }
      }
    } catch (error: any) {
      console.error("OTP Error:", error);
      
      // Clear OTP field
      setOtp("");
      
      // Simple error message
      if (error?.data?.message?.toLowerCase().includes("invalid") || 
          error?.data?.message?.toLowerCase().includes("incorrect") ||
          error?.status === 400) {
        toast.error("Incorrect OTP. Please try again.");
      } else if (error?.data?.message?.toLowerCase().includes("expired")) {
        toast.error("OTP has expired. Please request a new one.");
      } else if (error?.message?.includes("Session expired")) {
        toast.error("Session expired. Please start again.");
        router.push(isEmailVerify ? "/signup" : "/forgot-password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (time > 0) return;

    try {
      const userId = Cookies.get("tempUserId");
      if (!userId) {
        toast.error("Session expired. Please start again.");
        router.push(isEmailVerify ? "/signup" : "/forgot-password");
        return;
      }

      const response = await resendOtp({
        userId,
        type: isEmailVerify ? "account_verification" : "password_reset"
      }).unwrap();

      if (response.success) {
        toast.success("New OTP sent!");
        setTime(60);
        setError(null);
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("Resend Error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  useEffect(() => {
    if (!Cookies.get("tempUserId")) {
      router.push(isEmailVerify ? "/signup" : "/forgot-password");
    }

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEmailVerify, router]);

  return (
    <div className="xl:mt-[8rem] lg:mt-[5rem] sm:mt-[2rem]">
      <div className="font-semibold text-2xl">OTP Verification</div>
      <div className="mt-3">
        We&apos;ve sent a one-time password to your email — please enter it
        below.
      </div>

      <div className="my-8 flex flex-col gap-4">
        <div className="space-y-2 mx-2 self-center">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError(null);
            }}
          >
            <InputOTPGroup className="flex gap-4">
              {[0, 1, 2, 3].map((_, index) => (
                <div key={index} className="bg-[#fff] rounded-3xl">
                  <InputOTPSlot
                    index={index}
                    className="focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent !ring-0 !shadow-none !outline-none !border-none px-8 py-7 text-lg"
                  />
                </div>
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <CustomButton 
          className="mt-6 text-xl" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify and continue"}
        </CustomButton>

        <div className="text-center text-[1.1rem] font-medium mt-2">
          {formatTime(time)} secs
        </div>
      </div>

      <div className="flex justify-center items-center gap-1 mt-5">
        <div>Didn't receive OTP yet?</div>
        <button
          className={`p-0 m-0 font-medium ${
            time > 0 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-[var(--primary)] hover:cursor-pointer"
          }`}
          onClick={handleResend}
          disabled={time > 0}
        >
          Resend
        </button>
      </div>
    </div>
  );
}

export default OTPForm;