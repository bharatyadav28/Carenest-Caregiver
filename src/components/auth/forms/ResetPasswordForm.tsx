"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { PasswordInput } from "@/components/common/CustomInputs";
import { passwordIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    // Redirect if reset token is missing
    if (!Cookies.get("resetToken")) {
      router.push("/forgot-password");
    }
  }, [router]);

  const handleSubmit = async () => {
    // Validation
    if (!password || !confirmPassword) {
      return toast.error("Please fill in both password fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords don't match");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({
        password,
        role: "giver", // or "receiver" based on your application
      }).unwrap();

      if (response.success) {
        toast.success("Password reset successfully! Redirecting to login...");
        Cookies.remove("resetToken");
        router.push("/signin");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      const message =  "An unknown error occurred";
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6 flex flex-col gap-4 max-w-md mx-auto">
      <PasswordInput
        text={password}
        setText={(value) => setPassword(value)}
        Icon={passwordIcon}
        placeholder="Enter New Password"
          className="!text-lg"
      />

      <PasswordInput
        text={confirmPassword}
        setText={(value) => setConfirmPassword(value)}
        Icon={passwordIcon}
        placeholder="Confirm New Password"
          className="!text-lg"
      />

      <CustomButton 
        className="mt-4 mb-3 w-full text-lg" 
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Resetting Password..." : "Save & Continue"}
      </CustomButton>
    </div>
  );
}

export default ResetPasswordForm;
