"use client";
import React, { useState } from "react";
import Messages from "./Messages";
import CustomSheet from "@/components/common/CustomSheet";
import { Menu } from "lucide-react"; // For mobile menu toggle

function InboxBlock() {
  const [openMessages, setOpenMessages] = useState(false);

  const myMessages = <Messages />;

  const handleOpenMessages = () => {
    setOpenMessages((prev) => !prev);
  };

  return (
    <div className="w-full h-full px-2 sm:px-4 md:px-6 lg:px-10">
      {/* Desktop View - Full width chat */}
      <div className="hidden md:flex card flex-grow overflow-y-auto h-[calc(100vh-8rem)]">
        <div className="w-full h-full p-3 sm:p-4 md:p-6">
          {myMessages}
        </div>
      </div>

      {/* Mobile View - Direct Chat with Scrollbar */}
      <div className="md:hidden flex flex-col h-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-3 px-1 sticky top-0 bg-white z-10 py-2">
          <h1 className="text-xl font-semibold text-[#233D4D]">Chat with Admin</h1>
        </div>

        {/* Direct Chat Display with Scrollbar */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
          {/* Messages Container with Scrollbar */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {myMessages}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}

export default InboxBlock;