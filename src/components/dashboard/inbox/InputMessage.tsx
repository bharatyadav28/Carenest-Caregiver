"use client";
import React, { useState } from "react";
import { LuSend as SendIcon } from "react-icons/lu";
import { IoIosAttach as AttachmentIcon } from "react-icons/io";
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
    <div className="flex items-center rounded-lg px-4 py-2 bg-[#F7F7F3] gap-2">
      <button>
        <AttachmentIcon size={21} className="text-gray-400" />
      </button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
        className="border-none focus-visible:ring-0 flex-grow"
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <button onClick={handleSendMessage}>
        <SendIcon size={18} className="text-blue-500" />
      </button>
    </div>
  );
};

export default InputMessage;
