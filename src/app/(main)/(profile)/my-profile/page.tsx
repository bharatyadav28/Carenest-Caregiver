"use client";

import React, { useEffect, useState } from "react";
import { LiaSaveSolid as SaveIcon } from "react-icons/lia";

import { TextInput } from "@/components/common/CustomInputs";
import { addressIcon, EmailIcon, personIcon, phoneIcon } from "@/lib/svg_icons";
import { CustomButton } from "@/components/common/CustomButton";
import data from "@/lib/dummy_data/profile.json";

function MyProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const basicDetails = data?.basicDetails;

  useEffect(() => {
    setName(basicDetails.name);
    setEmail(basicDetails.email);
    setGender(basicDetails.gender);
    setAddress(basicDetails.address);
    setMobile(basicDetails.mobile);
  }, [basicDetails]);

  return (
    <div className="flex flex-col card">
      <div className="flex w-full justify-between text-3xl font-medium">
        <div>Personal Information</div>

        <CustomButton className="py-2" onClick={() => {}}>
          <div className="flex items-center gap-2 ">
            <div>Save</div>
            <div>
              <SaveIcon size={18} />
            </div>
          </div>
        </CustomButton>
      </div>

      <div className=" w-full border-t-1 border-[#33333333] my-3">
        <div className="mt-6 flex flex-col gap-3  ">
          <TextInput
            text={name}
            setText={setName}
            Icon={personIcon}
            placeholder="Enter User Name"
            iconLast={true}
            divClassName="!bg-[#F8F8F8]"
          />

          <TextInput
            text={email}
            setText={setEmail}
            Icon={EmailIcon}
            type="email"
            placeholder="Enter Email ID"
            iconLast={true}
            divClassName="!bg-[#F8F8F8]"
          />

          <TextInput
            text={gender}
            setText={setGender}
            Icon={personIcon}
            placeholder="Enter Gender"
            iconLast={true}
            divClassName="!bg-[#F8F8F8]"
          />

          <TextInput
            text={address}
            setText={setAddress}
            Icon={addressIcon}
            placeholder="Enter Address"
            iconLast={true}
            divClassName="!bg-[#F8F8F8]"
          />

          <TextInput
            text={mobile}
            setText={setMobile}
            Icon={phoneIcon}
            placeholder="Enter Phone Number"
            iconLast={true}
            divClassName="!bg-[#F8F8F8]"
          />
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
