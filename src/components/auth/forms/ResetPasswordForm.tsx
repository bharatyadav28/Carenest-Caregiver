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
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    // Redirect if reset token is missing
    if (!Cookies.get("resetToken")) {
      router.push("/forgot-password");
    }
  }, [router]);

  // Password validation function similar to email validation pattern
  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter (A-Z)";
    }
    
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter (a-z)";
    }
    
    if (!/\d/.test(password)) {
      return "Password must contain at least one number (0-9)";
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&* etc.)";
    }
    
    return "";
  };

  const handlePasswordChange = (value: any) => {
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);
    
    // Also validate confirm password if it exists
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value: any) => {
    setConfirmPassword(value);
    
    if (password && value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error(passwordValidationError);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
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
    } catch (error: any) {
      const message = error?.data?.message || "An unknown error occurred";
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6 flex flex-col gap-4 max-w-md mx-auto">
      <div className="space-y-2">
        <PasswordInput
          text={password}
          setText={handlePasswordChange}
          Icon={passwordIcon}
          placeholder="Enter New Password"
          className="!text-lg"
        />
     
      </div>

      <div className="space-y-2">
        <PasswordInput
          text={confirmPassword}
          setText={handleConfirmPasswordChange}
          Icon={passwordIcon}
          placeholder="Confirm New Password"
          className="!text-lg"
        />
    
      </div>

      {/* Password requirements info */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">Password must contain:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>At least 8 characters</li>
          <li>At least one uppercase letter (A-Z)</li>
          <li>At least one lowercase letter (a-z)</li>
          <li>At least one number (0-9)</li>
          <li>At least one special character (!@#$%^&* etc.)</li>
        </ul>
      </div>

      <CustomButton 
        className="mt-2 mb-3 w-full text-lg" 
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Resetting Password..." : "Save & Continue"}
      </CustomButton>
    </div>
  );
}

export default ResetPasswordForm;