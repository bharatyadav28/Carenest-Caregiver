"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { TextInput } from "@/components/common/CustomInputs";
import { EmailIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import Cookies from 'js-cookie';

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await forgotPassword({
        email,
        role: "giver" // or "receiver" based on your application
      }).unwrap();

      if (response.success) {
        setSuccess(true);
        // Store userId in cookie instead of localStorage
        Cookies.set('tempUserId', response.data.userId, { expires: 1/24 }); // Expires in 1 hour
        router.push("/otp-verification");
      } else {
        setError(response.message || "Failed to send OTP");
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

  return (
    <div className="my-8 flex flex-col gap-4">
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 text-sm mb-2 text-center">
          OTP sent successfully to your email!
        </div>
      )}

      <TextInput
        text={email}
        setText={setEmail}
        Icon={EmailIcon}
        type="email"
        placeholder="Enter Email ID"
        onChange={(e) => {
          setEmail(e.target.value);
          setError(null); // Clear error when user types
        }}
      />

      <CustomButton 
        className="mt-6" 
        onClick={handleSubmit}
      //  disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </CustomButton>
    </div>
  );
}

export default ForgotPasswordForm;