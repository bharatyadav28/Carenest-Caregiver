import React, { useState } from "react";
// import { PiDotsThreeVerticalBold as OptionsIcon } from "react-icons/pi";
import { binIconTheme } from "@/lib/svg_icons";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import ProfilePic from "@/assets/profilepic1.png";
import DP from "@/components/common/DP";
import ActionDialog from "@/components/common/ActionDialog";

function NameHeader() {
  const [openDeleteDialog, setOpenDialog] = useState(false);

  const handleOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  return (
    <>
      <div className="flex justify-between items-center border-b border-dashed border-[#EEEEEE] pb-4">
        <div className="flex gap-3 items-center">
          <DP url={ProfilePic} alt="Me" />
          <div className="text-lg font-medium">Admin</div>
        </div>
        <div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <OptionsIcon size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" !min-w-0 w-max ">
              <DropdownMenuItem>
                <button
                  className="m-0 p-0 hover:cursor-pointer"
                  onClick={handleOpen}
                >
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>

      <ActionDialog
        open={openDeleteDialog}
        handleOpen={handleOpen}
        icon={binIconTheme}
        confirmText="Delete"
        handleConfirm={() => {}}
        heading="Chat Deletion"
        subheading="Are you sure you want to delete your chat?"
      />
    </>
  );
}

export default NameHeader;
