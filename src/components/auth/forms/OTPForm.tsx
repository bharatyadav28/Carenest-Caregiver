"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CustomButton } from "../../common/CustomButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { formatTime } from "@/lib/resuable_funs";

interface Props {
  isEmailVerify?: boolean;
}
function OTPForm({ isEmailVerify }: Props) {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(30);

  const router = useRouter();

  const handleSubmit = () => {
    console.log(isEmailVerify)
    const redirectUrl = isEmailVerify ? "/signup/documents" : "/resets-password";
    console.log(redirectUrl)
    router.push(redirectUrl);
  };

  const handleResend = () => {
    if (time <= 0) {
    }
  };

  useEffect(() => {
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
  }, []);

  return (
    <div className="mt-[8rem]">
      <div className=" font-semibold text-2xl">OTP Verification</div>
      <div className=" mt-3">
        We&apos;ve sent a one-time password to your email — please enter it
        below.
      </div>

      <div className="my-8  flex flex-col  gap-4">
        <div className="space-y-2 mx-2 self-center">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(value) => setOtp(value)}
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

        <CustomButton className="mt-6" onClick={handleSubmit}>
          Verify and continue
        </CustomButton>

        <div className="text-center text-[1.1rem] font-medium mt-2">
          {formatTime(time)} secs
        </div>
      </div>

      <div className="flex justify-center items-center gap-1 mt-5">
        <div>Didn’t receive OTP yet?</div>
        <button
          className="p-0 m-0 text-[var(--primary)] font-medium hover:cursor-pointer"
          onClick={handleResend}
        >
          Resend
        </button>
      </div>
    </div>
  );
}

export default OTPForm;
