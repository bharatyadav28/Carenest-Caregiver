"use client";

import React, { useEffect, useState } from "react";
import { LiaSaveSolid as SaveIcon } from "react-icons/lia";
import { TextInput } from "@/components/common/CustomInputs";
import { addressIcons, EmailIcons, personIcons, phoneIcons } from "@/lib/svg_icons";
import { CustomButton } from "@/components/common/CustomButton";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/profileApi";
import { toast } from "react-toastify";

function MyProfilePage() {
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(""); 
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  // ✅ Pre-fill form with normalized gender
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setAddress(profile.address || "");
      setGender(profile.gender || ""); // normalize to lowercase
      setMobile(profile.mobile || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (!gender.trim()) return toast.error("Gender is required");
    if (!address.trim()) return toast.error("Address is required");
    if (!mobile.trim()) return toast.error("Please enter phone number");

    try {
      // ✅ send gender in same lowercase format or capitalize if backend expects that
      await updateProfile({
        name,
        email,
        address,
        gender, // or gender.charAt(0).toUpperCase() + gender.slice(1)
        mobile,
      }).unwrap();

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col card">
      <div className="flex w-full justify-between text-3xl font-medium">
        <div>Personal Information</div>
        <CustomButton className="py-2" onClick={handleSave} disabled={isUpdating}>
          <div className="flex items-center gap-2">
            <div>{isUpdating ? "Saving..." : "Save"}</div>
            <SaveIcon size={18} />
          </div>
        </CustomButton>
      </div>

      <div className="w-full border-t-1 border-[#33333333] my-3">
        <div className="mt-6 flex flex-col  gap-3">
          <TextInput
            text={name}
            setText={setName}
            Icon={personIcons}
            placeholder="Enter User Name"
            iconLast={true}
            divClassName="!bg-[#F8F8F8] !text-[#667085] font-medium"
          />

          <TextInput
            text={email}
            setText={setEmail}
            Icon={EmailIcons}
            type="email"
            disabled={true}
            placeholder="Enter Email ID"
            iconLast={true}
            divClassName="text-[#667085] font-medium"
          />

          {/* ✅ Gender Dropdown (lowercase values) */}
          <div className="flex items-center gap-2 !bg-[#F8F8F8] py-3 rounded-full font-normal ps-4 ms-1 pe-3 text-[#667085]">
            <select
              className="flex-1 bg-transparent outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className="w-6">{personIcons}</div>
          </div>

          <TextInput
            text={address}
            setText={setAddress}
            Icon={addressIcons}
            placeholder="Enter Address"
            iconLast={true}
            divClassName="!bg-[#F8F8F8] text-[#667085] font-medium"
          />

          <TextInput
            text={mobile}
            setText={(value) => {
              const newValue = typeof value === "function" ? value(mobile) : value;
              const digitsOnly = newValue.replace(/\D/g, "").slice(0, 10);
              setMobile(digitsOnly);
            }}
            Icon={phoneIcons}
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
