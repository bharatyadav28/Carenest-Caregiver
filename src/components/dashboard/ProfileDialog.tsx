"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { CustomDialog, DialogIcon } from "../common/CustomDialog";
import { celebrationIcon } from "@/lib/svg_icons";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "../common/CustomButton";

function ProfileDialog() {
  const [openDialog, setOpenDialog] = useState(true);
  const router = useRouter();

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };
  const handleConfirm = () => {
    handleOpenDialog();
    router.push("/my-profile");
  };

  return (
    <CustomDialog
      open={openDialog}
      handleOpen={handleOpenDialog}
      showCrossButton={false}
      className="!lg:min-w-[25rem] lg:w-[25rem]  pb-4"
    >
      <div className=" flex flex-col items-center w-full ">
        <div>
          <DialogIcon icon={celebrationIcon} />
        </div>
        <div className="text-xl font-semibold">
          Welcome, <span className="text-primary">user name!</span>
        </div>

        <div className=" w-full border-t-2 border-dashed  border-[#33333333] my-2"></div>

        <div className="px-4">
          <div className="text-2xl font-bold text-center mt-1 ">
            Complete Your Profile to Start Getting Jobs
          </div>

          <div className="text-sm text-[#667085] text-center my-2">
            Get noticed by families and start receiving job opportunities. Set
            up your profile to showcase your skills, experience, and
            availability. The more complete your profile, the better your
            chances!
          </div>
        </div>

        <div className="flex gap-2 w-full mt-2">
          <TransaparentButton onClick={handleOpenDialog}/>
          <DialogConfirmButton onClick={handleConfirm} />
        </div>
      </div>
    </CustomDialog>
  );
}

export default ProfileDialog;
