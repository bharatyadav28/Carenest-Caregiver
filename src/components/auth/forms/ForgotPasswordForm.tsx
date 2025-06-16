"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { TextInput } from "@/components/common/CustomInputs";
import { EmailIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    router.push("/otp-verification");
  };

  return (
    <div className="my-8  flex flex-col gap-4">
      <TextInput
        text={email}
        setText={setEmail}
        Icon={EmailIcon}
        type="email"
        placeholder="Enter Email ID"
      />

      <CustomButton className="mt-6" onClick={handleSubmit}>
        Send
      </CustomButton>
    </div>
  );
}

export default ForgotPasswordForm;
