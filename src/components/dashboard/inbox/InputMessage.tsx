"use client";

import React, { useState } from "react";
import { LuSend as SendIcon } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { chatMessageType } from "@/lib/interface-types";

interface Props {
  userId: string;
  addMessage: (msg: chatMessageType) => void;
  sendMessage: (toUserId: string, message: string) => void;
}

const InputMessage = ({ userId, addMessage, sendMessage }: Props) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg: chatMessageType = {
      id: Date.now().toString(),
      conversationId: "",
      isOtherUserMessage: false,
      message,
      createdAt: new Date().toISOString(),
      hasRead: true,
    };

    addMessage(newMsg);
    sendMessage(userId, message); // send via socket
    setMessage("");
  };

  return (
    <div className="flex items-center rounded-lg px-2 sm:px-4 py-1 sm:py-2 bg-[#F7F7F3] gap-1 sm:gap-2 sticky bottom-0">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
        className="border-none focus-visible:ring-0 flex-grow text-sm sm:text-base h-8 sm:h-10"
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <button 
        onClick={handleSendMessage}
        className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors"
      >
        <SendIcon size={16} className="sm:w-[18px] sm:h-[18px] text-[#233D4D]" />
      </button>
    </div>
  );
};

export default InputMessage;