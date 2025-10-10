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
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!nameRegex.test(name)) {
      toast.error("Name can only contain letters and spaces");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    const countryCodeRegex = /^\d{1,4}$/;
    if (!countryCodeRegex.test(countryCode)) {
      toast.error("Country code must be 1 to 4 digits ");
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    if (!address.trim()) {
      toast.error("Address is required");
      return false;
    }

    const zipRegex = /^\d{7}$/; // exactly 7 digits
    if (!zipcode.trim()) {
      toast.error("Zipcode is required");
      return false;
    }
    if (!zipRegex.test(zipcode)) {
      toast.error("Zipcode must be  7 digits");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const fullPhone = `${countryCode}${phone}`;
      const response = await signup({
        name,
        email,
        address,
        zipcode: Number(zipcode),
        mobile: fullPhone,
        password,
        role: "giver",
      }).unwrap();

      if (response.success) {
        toast.success("Signup successful! Please verify your email.");
        Cookies.set("tempUserId", response.data.userId, { expires: 1 / 24 });
        router.push("/email-verification");
      } else {
        toast.error(response.message || "Signup failed");
      }
    } catch (error:any) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  return (
    <div className="my-6 flex flex-col gap-2">
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

      <div className="flex gap-2">
        {/* Country Code */}
        <div className="w-30">
 <TextInput
  text={countryCode}
  setText={(val) => {
    if (typeof val === "string") {
      const cleaned = val.replace(/\D/g, "").slice(0, 4);
      setCountryCode(cleaned ? `${cleaned}` : "");
    }
  }}
  placeholder="+91"
  Icon={phoneIcon}
/>
        </div>

        {/* Phone Number */}
        <div className="flex-1">
 <TextInput
  text={phone}
  setText={(val) => {
    if (typeof val === "string") {
      const cleaned = val.replace(/\D/g, "").slice(0, 10);
      setPhone(cleaned);
    }
  }}
  placeholder="Enter Phone Number"
/>
        </div>
      </div>

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

      <CustomButton onClick={handleSubmit}>
        {isLoading ? "Signing Up..." : "Sign Up"}
      </CustomButton>

      <TextWithLines text="or" />
      <GoogleButton />
    </div>
  );
}

export default SignupForm;
