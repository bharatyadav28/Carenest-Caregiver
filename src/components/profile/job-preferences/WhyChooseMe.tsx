import React, { useState } from "react";
import { MdOutlineEdit as EditIcon } from "react-icons/md";

import { AddButton } from "@/components/common/CustomButton";
import { SimpleLine } from "@/components/common/HorizontalLines";
import { BinIcon, binIconTheme } from "@/lib/svg_icons";
import WhyChooseMeDialog from "./WhyChooseMeDialog";
import ActionDialog from "@/components/common/ActionDialog";

function WhyChooseMe() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">Why Choose Me?</div>

          <AddButton onClick={handleOpenDialog} />
        </div>

        <div className="text-[var(--slat-gray)]">
          {"Add why care seekers should choose you."}
        </div>

        <SimpleLine />

        <div className="flex flex-col gap-6 mt-2">
          <div className="flex justify-between">
            <div className="text-sm flex flex-col gap-1">
              <div className="font-medium">
                Certified and background-checked
              </div>
              <div className="text-[var(--slat-gray)] ">
                Certified and background-checked. Flexible scheduling and
                availability. Personalized and compassionate care.
              </div>
            </div>

            <div className="flex gap-4 ">
              <button
                className="hover:cursor-pointer hover:opacity-90 transition"
                onClick={handleOpenDialog}
              >
                <EditIcon />
              </button>
              <button
                className="hover:cursor-pointer hover:opacity-90 transition"
                onClick={handleOpenDeleteDialog}
              >
                {BinIcon}
              </button>
            </div>
          </div>
        </div>
      </div>

      <WhyChooseMeDialog open={openDialog} handleOpen={handleOpenDialog} />

      <ActionDialog
        icon={binIconTheme}
        open={openDeleteDialog}
        handleOpen={handleOpenDeleteDialog}
        handleConfirm={handleOpenDeleteDialog}
        heading="Deletion"
        subheading="Are you sure you want to delete this content?"
      />
    </>
  );
}

export default WhyChooseMe;
