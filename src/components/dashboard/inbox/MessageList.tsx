"use client";

import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import data from "@/lib/dummy_data/chats.json";
import NoItems from "@/components/common/NoItems";
import DP from "@/components/common/DP";
import ProfilePic from "@/assets/profilepic1.png";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  handleOpenMessages: () => void;
}

function MessageList({ handleOpenMessages }: Props) {
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  const chatList = data?.chatList;
  const noChats = chatList?.length === 0;

  const handleClick = () => {
    if (isMobile) {
      handleOpenMessages();
    }
  };

  return (
    <div className="w-full overflow-y-auto flex flex-col h-[calc(100vh-8rem)] sm:h-[45rem]">
      <div className="flex items-center rounded-full px-3 sm:px-4 py-1 bg-[var(--light-gray)] mb-2 sticky top-0 z-10">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-0 border-none focus-visible:ring-0 text-sm sm:text-base"
          placeholder="Search here..."
        />
        <SearchIcon size={16} className="sm:w-[18px] sm:h-[18px] text-[var(--cool-gray)]" />
      </div>

      {noChats && <NoItems className="mt-4 sm:mt-8" />}

      {!noChats && (
        <div
          className="flex flex-col h-full flex-grow overflow-y-auto hide-scrollbar gap-1 sm:gap-2"
          onClick={handleClick}
        >
          {chatList?.map((chat) => (
            <div
              className="flex justify-between py-2 sm:py-3 hover:cursor-pointer hover:bg-gray-100 px-2 sm:px-3 rounded-md transition-all"
              key={chat.id}
            >
              <div className="flex gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="relative rounded-full flex w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <DP url={chat?.profilePic || ProfilePic} alt={chat?.name} />
                </div>

                <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate"> {chat?.name}</div>
                  <div className="text-xs sm:text-sm text-[var(--cool-gray)] truncate">
                    {chat?.message?.content}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-0.5 sm:gap-1 flex-shrink-0 ml-2">
                <div className="text-[var(--cool-gray)] text-[0.7rem] sm:text-[0.8rem] whitespace-nowrap">
                  {chat?.message?.time}
                </div>
                {chat?.unread > 0 && (
                  <div className="bg-[var(--golden-yellow)] text-[#fff] px-1.5 sm:px-2 rounded-full text-xs sm:text-sm min-w-[20px] text-center">
                    {chat?.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;