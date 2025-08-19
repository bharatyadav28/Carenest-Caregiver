"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { PasswordInput } from "@/components/common/CustomInputs";
import { passwordIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import Cookies from 'js-cookie';

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    // Check if reset token exists on component mount
    if (!Cookies.get('resetToken')) {
      router.push('/forgot-password');
    }
  }, [router]);

  const handleSubmit = async () => {
    // Basic validation
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await resetPassword({
        password,
        role: "giver" // or "receiver" based on your application
      }).unwrap();

      if (response.success) {
        setSuccess(true);
        // Clear temporary token
        Cookies.remove('resetToken');
    router.push("/signin")
        } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // Use error.message in your UI
  } else {
    console.error("An unknown error occurred");
    // Fallback error message
  }
} finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6 flex flex-col gap-4 max-w-md mx-auto">
      {/* <h2 className="text-2xl font-bold text-center">Reset Your Password</h2> */}
      
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 text-sm mb-2 text-center">
          Password reset successfully! Redirecting to login...
        </div>
      )}

      <PasswordInput
        text={password}
        setText={(value) => {
          setPassword(value);
          setError(null);
        }}
        Icon={passwordIcon}
        placeholder="Enter New Password"
      />

      <PasswordInput
        text={confirmPassword}
        setText={(value) => {
          setConfirmPassword(value);
          setError(null);
        }}
        Icon={passwordIcon}
        placeholder="Confirm New Password"
      />

      <CustomButton 
        className="mt-4 mb-3 w-full" 
        onClick={handleSubmit}
       // disabled={isLoading}
      >
        {isLoading ? "Resetting Password..." : "Save & Continue"}
      </CustomButton>
    </div>
  );
}

export default ResetPasswordForm;