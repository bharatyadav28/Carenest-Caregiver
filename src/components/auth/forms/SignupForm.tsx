"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { PasswordInput, TextInput } from "../../common/CustomInputs";
import {
  addressIcon,
  EmailIcon,
  passwordIcon,
  personIcon,
  phoneIcon,
} from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import GoogleButton from "../GoogleButton";
import TextWithLines from "../../common/HorizontalLines";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    router.push("/email-verification");
  };

  return (
    <div className="my-6 flex flex-col gap-4 ">
      <TextInput
        text={name}
        setText={setName}
        Icon={personIcon}
        placeholder="Enter User Name"
      />

      <TextInput
        text={email}
        setText={setEmail}
        Icon={EmailIcon}
        type="email"
        placeholder="Enter Email ID"
      />

      <TextInput
        text={phone}
        setText={setPhone}
        Icon={phoneIcon}
        placeholder="Enter Phone Number"
      />

      <TextInput
        text={address}
        setText={setAddress}
        Icon={addressIcon}
        placeholder="Enter Address"
      />

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

      <CustomButton onClick={handleSubmit}>Sign Up</CustomButton>
      <TextWithLines text="or" />
      <GoogleButton />
    </div>
  );
}

export default SignupForm;
