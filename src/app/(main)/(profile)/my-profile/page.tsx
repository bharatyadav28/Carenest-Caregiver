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
  const [city, setCity] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [countryCode, setCountryCode] = useState("+1"); // Default country code

  // ✅ Pre-fill form with normalized gender
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setGender(profile.gender || "");
      
      // Extract country code and phone number from profile.mobile
      const mobileFromProfile = profile.mobile || "";
      
      // Check for country codes +1 or +91
      if (mobileFromProfile.startsWith("+1")) {
        setCountryCode("+1");
        // Remove +1 and any spaces/dashes, keep only digits
        const phoneWithoutCode = mobileFromProfile.replace(/^\+1\s*/, "").replace(/\D/g, "");
        setMobile(formatPhoneNumber(phoneWithoutCode));
      } else if (mobileFromProfile.startsWith("+91")) {
        setCountryCode("+91");
        // Remove +91 and any spaces/dashes, keep only digits
        const phoneWithoutCode = mobileFromProfile.replace(/^\+91\s*/, "").replace(/\D/g, "");
        setMobile(formatPhoneNumber(phoneWithoutCode));
      } else {
        // No country code, assume +1 as default
        setCountryCode("+1");
        const phoneDigits = mobileFromProfile.replace(/\D/g, "");
        setMobile(formatPhoneNumber(phoneDigits));
      }
      
      setMobileError("");
    }
  }, [profile]);

  // Validate phone number format (10 digits)
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Format phone number as user types (XXX-XXX-XXXX)
  const formatPhoneNumber = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    
    if (digitsOnly.length <= 3) {
      return digitsOnly;
    } else if (digitsOnly.length <= 6) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    } else {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    }
  };

  // Remove country code from phone number
  const removeCountryCode = (phone: string): string => {
    // Remove +1 or +91 prefixes and any following spaces/dashes
    return phone
      .replace(/^(\+1|\+91)\s*/, "") // Remove country codes
      .replace(/\D/g, ""); // Remove all non-digits
  };

  // Get full phone number with country code for display/backend
  const getFullPhoneNumber = (): string => {
    const digitsOnly = mobile.replace(/\D/g, "");
    return countryCode + digitsOnly;
  };

  const handleSave = async () => {
    // Reset error
    setMobileError("");

    // Basic validation
    if (!name.trim()) return toast.error("Name is required");
    if (!gender.trim()) return toast.error("Gender is required");
    if (!address.trim()) return toast.error("Address is required");
    if (!city.trim()) return toast.error("City is required");
    
    // Phone validation
    const digitsOnly = mobile.replace(/\D/g, "");
    if (!mobile.trim()) {
      setMobileError("Phone number is required");
      return toast.error("Phone number is required");
    }
    
    if (!validatePhoneNumber(digitsOnly)) {
      setMobileError("Please enter a valid 10-digit phone number");
      return toast.error("Please enter a valid 10-digit phone number");
    }

    try {
      // Send full phone number with country code to backend
      await updateProfile({
        name,
        email,
        address,
        city,
        gender,
        mobile: getFullPhoneNumber(), // Send with country code
      }).unwrap();

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  // Handle phone input change
  const handlePhoneChange = (value: any) => {
    // Remove any country code if user tries to type it
    const withoutCountryCode = removeCountryCode(value);
    const formatted = formatPhoneNumber(withoutCountryCode);
    setMobile(formatted);
    
    // Clear error when user starts typing
    if (mobileError) {
      const digitsOnly = formatted.replace(/\D/g, "");
      if (digitsOnly.length === 10) {
        setMobileError("");
      }
    }
  };

  return (
    <div className="flex flex-col card">
      <div className="flex w-full justify-between text-3xl font-medium">
        <div>Personal Information</div>
        <CustomButton className="py-2" onClick={handleSave} disabled={isUpdating}>
          <div className="flex items-center gap-2 text-xl">
            <div>{isUpdating ? "Saving..." : "Save"}</div>
            <SaveIcon size={22} />
          </div>
        </CustomButton>
      </div>

      <div className="w-full border-t-1 border-[#33333333] my-3">
        <div className="mt-6 flex flex-col gap-3">
          <TextInput
            text={name}
            setText={setName}
            Icon={personIcons}
            placeholder="Enter User Name"
            iconLast={true}
            divClassName="!bg-[#F8F8F8] !text-[#667085] !text-lg font-medium"
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

          {/* ✅ Gender Dropdown */}
          <div className="flex items-center gap-2 !bg-[#F8F8F8] text-lg py-3 rounded-full font-normal ps-4 ms-1 pe-3 text-[#667085]">
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
            text={city}
            setText={setCity}
            Icon={addressIcons}
            placeholder="Enter City"
            iconLast={true}
            divClassName="!bg-[#F8F8F8] text-[#667085] font-medium"
          />

          {/* Phone Input with Country Code Selector */}
          <div className="relative">
            <div className="flex items-center gap-2">
              {/* Country Code Selector */}
              <div className="flex items-center gap-2 !bg-[#F8F8F8] text-lg py-3 rounded-full font-normal ps-4 ms-1 pe-3 text-[#667085] min-w-[100px]">
                <select
                  className="flex-1 bg-transparent outline-none w-full"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+1">+1</option>
                  <option value="+91">+91</option>
                </select>
              </div>
              
              {/* Phone Number Input */}
              <div className="flex-1 relative">
                <TextInput
                  text={mobile}
                  setText={handlePhoneChange}
                  Icon={phoneIcons}
                  type="tel"
                  placeholder="Phone Number (e.g., 123-456-7890)"
                  iconLast={true}
                  divClassName={`!bg-[#F8F8F8] text-[#667085] !text-lg ${
                    mobileError ? "!border-red-500 !border-2" : ""
                  }`}
                />
              
              </div>
            </div>
            
            {mobileError && (
              <p className="text-red-500 text-sm mt-1 ml-4">{mobileError}</p>
            )}
          </div>
          
      
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;