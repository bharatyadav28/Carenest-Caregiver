"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { TextInput } from "@/components/common/CustomInputs";
import { EmailIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const [forgotPassword] = useForgotPasswordMutation();

  // Simple email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async () => {
    // Reset previous errors
    setEmailError("");

    // Validate email
    if (!email) {
      setEmailError("Please enter your email");
      toast.error("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotPassword({
        email,
        role: "giver", // or "receiver" based on your application
      }).unwrap();

      if (response.success) {
        toast.success(`OTP sent successfully to your ${email}`);
        Cookies.set("tempUserId", response.data.userId, { expires: 1/24 }); // 1 hour
        router.push("/otp-verification");
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-8 flex flex-col gap-4">
      <div className="relative">
        <TextInput
          text={email}
          setText={setEmail}
          Icon={EmailIcon}
          type="email"
          placeholder="Enter Email ID"
          onChange={handleEmailChange}
          className="!text-lg"
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1 ml-1">{emailError}</p>
        )}
      </div>

      <CustomButton
        className="mt-6 text-lg"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </CustomButton>
    </div>
  );
}

export default ForgotPasswordForm;