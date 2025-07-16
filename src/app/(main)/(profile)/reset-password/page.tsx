"use client";

import React, { useState } from "react";
import { LiaSaveSolid as SaveIcon } from "react-icons/lia";

import { CustomButton } from "@/components/common/CustomButton";
import { SimpleLine } from "@/components/common/HorizontalLines";
import { PasswordInput } from "@/components/common/CustomInputs";
import { smallPasswordIcon } from "@/lib/svg_icons";

function Page() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex flex-col card">
      <div className="flex w-full justify-between text-3xl font-medium">
        <div>Reset Password</div>

        <CustomButton className="py-2" onClick={() => {}}>
          <div className="flex items-center gap-2 ">
            <div>Save</div>
            <div>
              <SaveIcon size={18} />
            </div>
          </div>
        </CustomButton>
      </div>
      <SimpleLine className="my-3" />

      <div className="mt-5 flex flex-col gap-3 mb-2 ">
        <PasswordInput
          text={currentPassword}
          setText={setCurrentPassword}
          Icon={smallPasswordIcon}
          placeholder="Current Password"
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
          hideEyeIcon={true}
        />

        <PasswordInput
          text={newPassword}
          setText={setNewPassword}
          Icon={smallPasswordIcon}
          placeholder="New Password"
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
          hideEyeIcon={true}
        />

        <PasswordInput
          text={confirmPassword}
          setText={setConfirmPassword}
          Icon={smallPasswordIcon}
          placeholder="Confirm Password"
          iconLast={true}
          divClassName="!bg-[#F8F8F8]"
          hideEyeIcon={true}
        />
      </div>
    </div>
  );
}

export default Page;
