"use client";

import React, { useState } from "react";
import { LiaSaveSolid as SaveIcon } from "react-icons/lia";
import { CustomButton } from "@/components/common/CustomButton";
import { SimpleLine } from "@/components/common/HorizontalLines";
import { PasswordInput } from "@/components/common/CustomInputs";
import { smallPasswordIcon } from "@/lib/svg_icons";
import { useChangePasswordMutation } from "@/store/api/profileApi";
import { toast } from "react-toastify";

function Page() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async () => {
    // Check for empty fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    // Check new password length
    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters");
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(newPassword)) {
      return toast.error("Password must contain at least one uppercase letter");
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(newPassword)) {
      return toast.error("Password must contain at least one lowercase letter");
    }

    // Check for number
    if (!/\d/.test(newPassword)) {
      return toast.error("Password must contain at least one number");
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      return toast.error("Password must contain at least one special character");
    }

    // Check if old and new passwords are the same
    if (currentPassword === newPassword) {
      return toast.error("New password cannot be the same as the old password");
    }

    // Check confirm password match
    if (newPassword !== confirmPassword) {
      return toast.error("New and Confirm passwords do not match");
    }

    try {
      const res = await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success(res.message || "Password updated successfully");

      // Reset fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = "Old password is incorrect";
      toast.error(message);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col card">
      <div className="hidden lg:flex w-full justify-between text-lg xl:text-3xl font-medium">
        <div>Reset Password</div>
        <CustomButton
          className="py-2"
          onClick={handleChangePassword}
          disabled={isLoading}
        >
          <div className="flex items-center gap-2 text-lg">
            <div>Save</div>
            <div>
              <SaveIcon size={18} />
            </div>
          </div>
        </CustomButton>
      </div>
         {/* Header - Mobile */}
      <div className="lg:hidden w-full text-center mb-6">
        <h1 className="text-2xl font-semibold text-[#233D4D]">Reset Password</h1>
      </div>

      <SimpleLine className="my-3" />

      <div className="mt-5 flex flex-col gap-3 mb-2">
        <PasswordInput
          text={currentPassword}
          setText={setCurrentPassword}
          Icon={smallPasswordIcon}
          placeholder="Current Password"
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
        />
        <PasswordInput
          text={newPassword}
          setText={setNewPassword}
          Icon={smallPasswordIcon}
          placeholder="New Password "
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
        />
      
        <PasswordInput
          text={confirmPassword}
          setText={setConfirmPassword}
          Icon={smallPasswordIcon}
          placeholder="Confirm Password"
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
        />
          <span className="text-sm">(min 8 chars with A-Z, a-z, 0-9, special)</span>
          <div className="lg:hidden pt-4">
                <CustomButton 
                  className="w-full py-3 text-lg" 
                onClick={handleChangePassword}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div>Save</div>
                    <SaveIcon size={20} />
                  </div>
                </CustomButton>
              </div>
      </div>
      
    </div>
  );
}

export default Page;