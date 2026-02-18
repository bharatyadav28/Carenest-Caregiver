"use client";

import React, { useState } from "react";
import Image from "next/image";
import { binIconTheme } from "@/lib/svg_icons";
import ActionDialog from "@/components/common/ActionDialog";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function NameHeader() {
  const [openDeleteDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div className="flex justify-between items-center border-b border-dashed border-[#EEEEEE] pb-2 sm:pb-4 px-2 sm:px-0">
        <div className="flex gap-2 sm:gap-3 items-center">
     

          {/* Admin profile image from public folder */}
          <div className="relative w-8 h-8 sm:w-10 sm:h-10">
            <Image
              src="/admin.png" // Admin image from public folder
              alt="Admin"
              fill
              className="object-cover rounded-full"
              sizes="(max-width: 640px) 32px, 40px"
              onError={(e) => {
                // Fallback to default image if admin.png doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = "/profile-pic.png";
              }}
            />
          </div>
          <div className="text-base sm:text-lg font-medium">Admin</div>
        </div>
        <div>
          {/* Dropdown menu commented out as in original */}
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