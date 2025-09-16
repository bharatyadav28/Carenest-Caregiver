"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/store/api/authApi";
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
import Cookies from 'js-cookie';

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const handleSubmit = async () => {
    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!name || !email || !phone || !address || !password) {
      setError("Please fill all fields");
      return;
    }
      // Convert zipcode into number
  const numericZip = Number(zipcode);
  if (isNaN(numericZip)) {
    setError("Zipcode must be a number");
    return;
  }

    try {
      const response = await signup({
        name,
        email,
        address,
        zipcode: numericZip,
        mobile: phone,
        password,
        role: "giver" // or "receiver" based on your UI
      }).unwrap();

      if (response.success) {
        // Store userId in cookie for verification step (expires in 1 hour)
        Cookies.set('tempUserId', response.data.userId, { expires: 1/24 });
        router.push("/email-verification");
      } else {
        setError(response.message || "Signup failed");
      }
    }  catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // Use error.message in your UI
  } else {
    console.error("An unknown error occurred");
    // Fallback error message
  }
}
  };

  return (
    <div className="my-6 flex flex-col gap-4">
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}

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
            <TextInput
          text={zipcode}
          setText={setZipcode}
          Icon={addressIcon}
          placeholder="Enter Zip Code"
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

      <CustomButton onClick={handleSubmit} >
        {isLoading ? "Signing Up..." : "Sign Up"}
      </CustomButton>
      
      <TextWithLines text="or" />
      <GoogleButton />
    </div>
  );
}

export default SignupForm;