"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { PasswordInput } from "@/components/common/CustomInputs";
import { passwordIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    router.push("/");
  };

  return (
    <div className="my-6  flex flex-col gap-4">
      <PasswordInput
        text={password}
        setText={setPassword}
        Icon={passwordIcon}
        placeholder="Enter Password"
      />

      <PasswordInput
        text={confirmPassword}
        setText={setConfirmPassword}
        Icon={passwordIcon}
        placeholder="Enter Confirm Password"
      />

      <CustomButton className="mt-4 mb-3" onClick={handleSubmit}>
        Save & Continue
      </CustomButton>
    </div>
  );
}

export default ResetPasswordForm;
