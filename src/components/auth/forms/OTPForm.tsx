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
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const userId = Cookies.get("tempUserId");
      if (!userId) {
        throw new Error("Session expired. Please sign up again.");
      }

      const response = await verifyEmail({
        userId,
        code: otp,
        type: isEmailVerify ? "account_verification" : "password_reset"
      }).unwrap();

      if (response.success) {
        if (isEmailVerify) {
          // Store tokens in cookies for email verification flow
          Cookies.set("authToken", response.data.accessToken, { expires: 1 }); // 1 day
          Cookies.set("refreshToken", response.data.refreshToken, { expires: 7 }); // 7 days
          Cookies.remove("tempUserId");
          router.push("/signup/documents");
        } else {
          // For password reset flow
          Cookies.set("resetToken", response.data.token || "", { expires: 1/24 }); // 1 hour
          router.push("/resets-password");
        }
      } else {
        setError(response.message || "Verification failed");
      }
    }  catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // Use error.message in your UI
  } else {
    console.error("An unknown error occurred");
    // Fallback error message
  }
}finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (time > 0) return;

    try {
      const userId = Cookies.get("tempUserId");
      if (!userId) {
        throw new Error("Session expired. Please start the process again.");
      }

      const response = await resendOtp({
        userId,
        type: isEmailVerify ? "account_verification" : "password_reset"
      }).unwrap();

      if (response.success) {
             toast.success(`OTP is sent Successfully`);
        setTime(60); // Reset timer
        setError(null);
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    }  catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // Use error.message in your UI
  } else {
    console.error("An unknown error occurred");
    // Fallback error message
  }
}
  };

  useEffect(() => {
    // Check if tempUserId exists on component mount
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
    <div className="mt-[8rem]">
      <div className="font-semibold text-2xl">OTP Verification</div>
      <div className="mt-3">
        We&apos;ve sent a one-time password to your email — please enter it
        below.
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">
          {error}
        </div>
      )}

      <div className="my-8 flex flex-col gap-4">
        <div className="space-y-2 mx-2 self-center">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError(null); // Clear error when user types
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
          className="mt-6" 
          onClick={handleSubmit}
          //disabled={isLoading || otp.length !== 4}
        >
          {isLoading ? "Verifying..." : "Verify and continue"}
        </CustomButton>

        <div className="text-center text-[1.1rem] font-medium mt-2">
          {formatTime(time)} secs
        </div>
      </div>

      <div className="flex justify-center items-center gap-1 mt-5">
        <div>Didnt receive OTP yet?</div>
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