"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { PasswordInput, TextInput } from "@/components/common/CustomInputs";
import { EmailIcon, passwordIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import GoogleButton from "../GoogleButton";
import TextWithLines from "../../common/TextWithLine";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState("false");

  const router = useRouter();

  const handleSubmit = () => {
    const token = "Mai_Hu_Pankaj";
    Cookies.set("care_giver_token", token);
    router.push("/dashboard");
  };

  return (
    <div className="my-6  flex flex-col gap-4">
      <TextInput
        text={email}
        setText={setEmail}
        Icon={EmailIcon}
        type="email"
        placeholder="Enter Email ID"
      />

      <PasswordInput
        text={password}
        setText={setPassword}
        Icon={passwordIcon}
        placeholder="Enter Password"
      />

      <RadioGroup
        defaultValue={rememberMe}
        onValueChange={setRememberMe}
        className="gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="option-one" />
          <Label htmlFor="option-one">Remember me</Label>
        </div>
      </RadioGroup>

      <CustomButton className="mt-4 mb-3" onClick={handleSubmit}>
        Sign In
      </CustomButton>

      <div className="text-center">
        <Link href="/forgot-password" className="text-[#667085]">
          Forgot your password?
        </Link>
      </div>

      <TextWithLines text="or" />
      <GoogleButton />
    </div>
  );
}

export default SigninForm;
