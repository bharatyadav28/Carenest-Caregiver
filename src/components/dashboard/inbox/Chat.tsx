"use client";
import React, { useEffect, useRef } from "react";
import DP from "@/components/common/DP";
import user1ProfilePic from "@/assets/profilepic1.png";
import { chatMessageType } from "@/lib/interface-types";
import ProfilePic from "@/assets/profilepic1.png";


interface Props {
  messages: chatMessageType[];
  otherUserDetails?: { name: string; avatar: string | null };
}

const Chat = ({ messages, otherUserDetails }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div
      className="flex flex-col flex-grow h-full overflow-y-auto hide-scrollbar gap-4 p-4"
      ref={containerRef}
    >
      {messages.length === 0 && (
        <div className="self-center text-gray-400">No messages yet</div>
      )}

      {messages.map((msg) => {
        const isOther = msg.isOtherUserMessage;
        return (
          <div
            key={msg.id}
            className={`flex gap-2 items-end ${
              isOther ? "self-start" : "self-end flex-row-reverse"
            }`}
          >
            <DP
              url={
                isOther && otherUserDetails?.avatar
                  ? ProfilePic
                  : isOther
                  ? user1ProfilePic
                  :ProfilePic
              }
              alt={isOther ? otherUserDetails?.name || "User" : "You"}
              className="!w-10 !h-10 rounded-full"
            />
            <div className="flex flex-col text-sm text-[#667085] max-w-[21rem]">
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isOther ? "bg-[#F8F9FA]" : "bg-[#233D4D33] text-black"
                }`}
              >
                {msg.message}
              </div>
              <div className={isOther ? "ms-1" : "self-end mr-1"}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chat;
