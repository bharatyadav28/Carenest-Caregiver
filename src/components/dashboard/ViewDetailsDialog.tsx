"use client";

import React from "react";
import { FiPhone, FiMail, FiMapPin, FiInfo } from "react-icons/fi";
import { CustomDialog } from "@/components/common/CustomDialog";

interface ViewDetailsDialogProps {
  user: {
    id: string;
    name: string;
    role: string;
    time: string;
    avatar: string;
    phone: string;
    email: string;
    location: string;
    subscribed: boolean;
  };
  onClose: () => void;
}

export default function ViewDetailsDialog({ user, onClose }: ViewDetailsDialogProps) {
  const obfuscate = (text: string) => "X".repeat(text.length);

  return (
    <CustomDialog
      open={true}
      handleOpen={onClose}
      showCrossButton={true}
      className="!w-[90%] !max-w-[430px] !rounded-[24px] !p-6"
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user.avatar || "/image.svg"}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="text-xl font-medium text-[#233D4D]">{user.name}</div>
            <div className="text-sm text-[#7A8B9B]">{user.role}</div>
            <div className="text-sm text-[#233D4D]">{user.time}</div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="text-[#1B2A37] font-semibold mb-3">Contact Details</div>
        <div className="flex flex-col gap-3 mb-6 text-sm text-[#1B2A37]">
          <div className="flex gap-2">
            <FiPhone className="text-white bg-[#233D4D] text-[30px] rounded-full p-2 mt-2" />
            <div>
              <div>Phone number</div>
              <span className="text-xs text-[#7A8B9B]">
                {user.subscribed ? user.phone : obfuscate(user.phone)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <FiMail className="text-white bg-[#233D4D] text-[30px] rounded-full p-2 mt-2" />
            <div>
              <div>Email</div>
              <span className="text-xs text-[#7A8B9B]">
                {user.subscribed ? user.email : obfuscate(user.email)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <FiMapPin className="text-white bg-[#233D4D] text-[30px] rounded-full p-2 mt-2" />
            <div>
              <div>Location</div>
              <span className="text-xs text-[#7A8B9B]">
                {user.subscribed ? user.location : obfuscate(user.location)}
              </span>
            </div>
          </div>
        </div>

        {/* Not Subscribed Warning */}
        {!user.subscribed && (
          <>
            <div className="bg-[#F1F5F9] text-sm text-[#1B2A37] px-4 py-3 rounded-full flex items-center gap-2 mb-4">
              <FiInfo className="text-[#7A8B9B]" />
              <span>
                Want to view contact details? Subscribe now to unlock full access.
              </span>
            </div>
            <button className="w-full bg-[#FFA629] hover:bg-[#e39324] text-[#233D4D] text-sm font-semibold py-3 rounded-full transition-colors">
              Get Subscription Now
            </button>
          </>
        )}
      </div>
    </CustomDialog>
  );
}
