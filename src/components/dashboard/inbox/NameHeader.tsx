"use client";
import React, { useState } from "react";
import Image from "next/image";
import { binIconTheme } from "@/lib/svg_icons";
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
          {/* Admin profile image from public folder */}
          <div className="relative w-10 h-10">
            <Image
              src="/admin.png" // Admin image from public folder
              alt="Admin"
              fill
              className="object-cover rounded-full"
              sizes="40px"
              onError={(e) => {
                // Fallback to default image if admin.png doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = "/profile-pic.png";
              }}
            />
          </div>
          <div className="text-lg font-medium">Admin</div>
        </div>
        <div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <OptionsIcon size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="!min-w-0 w-max">
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