"use client";

import React, { useEffect, useState } from "react";
import { LiaSaveSolid as SaveIcon } from "react-icons/lia";

import { TextInput } from "@/components/common/CustomInputs";
import { addressIcon, EmailIcon, personIcon, phoneIcon } from "@/lib/svg_icons";
import { CustomButton } from "@/components/common/CustomButton";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/profileApi";
import { toast } from "react-toastify";

function MyProfilePage() {
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(""); 
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  // Pre-fill form when profile is loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setAddress(profile.address || "");
      setGender(profile.gender || "");
      setMobile(profile.mobile || "");
    }
  }, [profile]);

  const handleSave = async () => {
    // Validate phone number: must be 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobile)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      await updateProfile({
        name,
        email,
        address,
        gender,
        mobile,
      }).unwrap();

      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col card">
      <div className="flex w-full justify-between text-3xl font-medium">
        <div>Personal Information</div>

        <CustomButton className="py-2" onClick={handleSave}>
          <div className="flex items-center gap-2">
            <div>{isUpdating ? "Saving..." : "Save"}</div>
            <SaveIcon size={18} />
          </div>
        </CustomButton>
      </div>

      <div className="w-full border-t-1 border-[#33333333] my-3">
        <div className="mt-6 flex flex-col gap-3">
          <TextInput
            text={name}
            setText={setName}
            Icon={personIcon}
            placeholder="Enter User Name"
            iconLast={true}
            divClassName="!bg-[#F8F8F8] text-[#667085] font-medium"
          />

          <TextInput
            text={email}
            setText={setEmail}
            Icon={EmailIcon}
            type="email"
            disabled={true} // Email field disabled
            placeholder="Enter Email ID"
            iconLast={true}
            divClassName="!bg-[#F8F8F8] text-[#667085] font-medium"
          />

          <TextInput
            text={gender}
            setText={setGender}
            Icon={personIcon}
            placeholder="Enter Gender"
            iconLast={true}
            divClassName="!bg-[#F8F8F8] text-[#667085] font-medium"
          />

          <TextInput
            text={address}
            setText={setAddress}
            Icon={addressIcon}
            placeholder="Enter Address"
            iconLast={true}
            divClassName="!bg-[#F8F8F8] text-[#667085] font-medium"
          />
<TextInput
  text={mobile}
  setText={(value) => {
    // Determine the actual string, whether value is string or function
    const newValue = typeof value === "function" ? value(mobile) : value;
    // Keep only digits and max 10 characters
    const digitsOnly = newValue.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
  }}
  Icon={phoneIcon}
  placeholder="Enter Phone Number"
  iconLast={true}
  divClassName="!bg-[#F8F8F8] text-[#667085] font-medium"
/>

        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
