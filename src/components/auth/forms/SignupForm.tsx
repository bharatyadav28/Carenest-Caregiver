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
  cityIcon,
  zipcodeIcon,
// You may need to add this icon or use an existing one
} from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import GoogleButton from "../GoogleButton";
import TextWithLines from "../../common/HorizontalLines";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(""); // New city field
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

    // Updated country code validation to allow + sign
    const countryCodeRegex = /^\+\d{1,4}$/;
    if (!countryCode.trim()) {
      toast.error("Country code is required");
      return false;
    }
    if (!countryCodeRegex.test(countryCode)) {
      toast.error("Country code must start with + followed by 1-4 digits");
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

    // City validation
    const cityRegex = /^[A-Za-z\s\-']+$/;
    if (!city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!cityRegex.test(city)) {
      toast.error("City can only contain letters, spaces, hyphens and apostrophes");
      return false;
    }

    const zipRegex = /^\d{5}$/;
    if (!zipcode.trim()) {
      toast.error("Zipcode is required");
      return false;
    }
    if (!zipRegex.test(zipcode)) {
      toast.error("Zipcode must be 5 digits");
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
        city, 
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
    } catch (error: any) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  // Function to handle country code input
  const handleCountryCodeChange: React.Dispatch<React.SetStateAction<string>> = (val) => {
    // Handle both string and function types
    const inputValue = typeof val === 'function' ? val(countryCode) : val;
    
    let input = inputValue;
    
    // If user types just numbers, prepend +
    if (/^\d+$/.test(input)) {
      input = `+${input}`;
    }
    
    // Remove any non-digit characters except the leading +
    input = input.replace(/[^\d+]/g, '');
    
    // Ensure only one + at the beginning
    if (input.startsWith('++')) {
      input = `+${input.slice(2)}`;
    }
    
    // If it doesn't start with +, add it
    if (!input.startsWith('+')) {
      input = `+${input}`;
    }
    
    // Limit to 1-4 digits after +
    const match = input.match(/^\+(\d{0,4})/);
    if (match) {
      setCountryCode(`+${match[1]}`);
    }
  };

  // Function to handle phone number input
  const handlePhoneChange: React.Dispatch<React.SetStateAction<string>> = (val) => {
    // Handle both string and function types
    const inputValue = typeof val === 'function' ? val(phone) : val;
    
    const cleaned = inputValue.replace(/\D/g, "").slice(0, 10);
    setPhone(cleaned);
  };

  return (
    <div className="my-6 flex flex-col gap-y-4 ">
      <TextInput
        text={name}
        setText={setName}
        Icon={personIcon}
        placeholder="Enter User Name"
        className="!text-lg"
      />

      <TextInput
        text={email}
        setText={setEmail}
        Icon={EmailIcon}
        type="email"
        placeholder="Enter Email ID"
        className="!text-lg"
      />

      <div className="flex gap-2">
        {/* Country Code */}
        <div className="w-30 !text-lg">
          <TextInput
            text={countryCode}
            setText={handleCountryCodeChange}
            placeholder="+1"
            Icon={phoneIcon}
            className="!text-lg"
          />
        </div>

        {/* Phone Number */}
        <div className="flex-1">
          <TextInput
            text={phone}
            setText={handlePhoneChange}
            placeholder="Enter Phone Number"
            className="!text-lg"
          />
        </div>
      </div>

      <TextInput
        text={address}
        setText={setAddress}
        Icon={addressIcon}
        placeholder="Enter Address"
        className="!text-lg"
      />

      <TextInput
        text={city}
        setText={setCity}
        Icon={cityIcon} 
        placeholder="Enter City"
        className="!text-lg"
      />

      <TextInput
        text={zipcode}
        setText={setZipcode}
        Icon={zipcodeIcon}
        placeholder="Enter Zip Code"
        className="!text-lg"
      />

      <PasswordInput
        text={password}
        setText={setPassword}
        Icon={passwordIcon}
        placeholder="Enter Password"
        className="!text-lg"
      />

      <PasswordInput
        text={confirmPassword}
        setText={setConfirmPassword}
        Icon={passwordIcon}
        placeholder="Enter Confirm Password"
        className="!text-lg"
      />

      <CustomButton onClick={handleSubmit} className="mt-1 text-lg">
        {isLoading ? "Signing Up..." : "Sign Up"}
      </CustomButton>

      <TextWithLines text="or" />
      <GoogleButton />
    </div>
  );
}

export default SignupForm;