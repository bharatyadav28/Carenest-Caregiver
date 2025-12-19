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
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
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
      <div className="flex w-full justify-between text-3xl font-medium">
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

      <SimpleLine className="my-3" />

      <div className="mt-5 flex flex-col gap-3 mb-2">
        <PasswordInput
          text={currentPassword}
          setText={setCurrentPassword}
          Icon={smallPasswordIcon}
          placeholder="Current Password"
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
          // REMOVED: hideEyeIcon={true}
        />
        <PasswordInput
          text={newPassword}
          setText={setNewPassword}
          Icon={smallPasswordIcon}
          placeholder="New Password"
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
          // REMOVED: hideEyeIcon={true}
        />
        <PasswordInput
          text={confirmPassword}
          setText={setConfirmPassword}
          Icon={smallPasswordIcon}
          placeholder="Confirm Password"
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
          // REMOVED: hideEyeIcon={true}
        />
      </div>
    </div>
  );
}

export default Page;