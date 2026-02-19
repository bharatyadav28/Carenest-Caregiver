"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { chatMessageType } from "@/lib/interface-types";
import { useGetProfileQuery } from "@/store/api/profileApi";
import { cdnURL } from "@/lib/utils";



interface Props {
  messages: chatMessageType[];
  otherUserDetails?: { 
    name: string; 
    avatar: string | null;
    role?: string;
  };
}

const Chat = ({ messages, otherUserDetails }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get current user's profile data including avatar
  const { data: currentUserProfile, isLoading: isLoadingProfile } = useGetProfileQuery();

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  // Function to group messages by date
  const groupMessagesByDate = (messages: chatMessageType[]) => {
    const grouped: { [key: string]: chatMessageType[] } = {};
    
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const dateKey = messageDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    
    return grouped;
  };

  // Function to format date header
  const formatDateHeader = (dateString: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(dateString);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return dateString;
    }
  };

  // Function to get avatar URL
  const getAvatarUrl = (isOther: boolean) => {
    if (isOther) {
      const isAdmin = otherUserDetails?.role === "admin" || 
                     otherUserDetails?.name?.toLowerCase().includes("admin");
      
      if (isAdmin) {
        return "/admin.png";
      }
      
      if (otherUserDetails?.avatar) {
        const avatar = otherUserDetails.avatar;
        if (avatar.startsWith('http')) {
          return avatar;
        } else if (avatar !== "/profile-pic.png" && avatar !== "") {
          return `${cdnURL}${avatar}`;
        }
      }
      return "/profile-pic.png";
    } else {
      if (currentUserProfile?.avatar) {
        const avatar = currentUserProfile.avatar;
        if (avatar.startsWith('http')) {
          return avatar;
        } else if (avatar !== "/profile-pic.png" && avatar !== "") {
          return `${cdnURL}${avatar}`;
        }
      }
      return "/profile-pic.png";
    }
  };

  // Function to get alt text
  const getAltText = (isOther: boolean) => {
    if (isOther) {
      return otherUserDetails?.name || "User";
    }
    return currentUserProfile?.name || "You";
  };

  const groupedMessages = groupMessagesByDate(messages);

  // Show loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="flex flex-col flex-grow h-full justify-center items-center">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col flex-grow h-full overflow-y-auto hide-scrollbar gap-3 sm:gap-4 p-2 sm:p-4"
      ref={containerRef}
    >
      {messages.length === 0 ? (
        // Show the "no messages" image when there are no messages
        <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            <Image
              src="/nomessage.png" // Your no messages image from public folder
              alt="No messages"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 192px, 256px"
              priority
            />
          </div>
          <p className="text-[#7A8B9B] text-sm sm:text-base text-center">
            No messages yet. Start a conversation!
          </p>
        </div>
      ) : (
        // Show messages when they exist
        Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="flex flex-col gap-2 sm:gap-4">
            {/* Date Header */}
            <div className="flex justify-center">
              <div className="bg-gray-100 text-black text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
                {formatDateHeader(date)}
              </div>
            </div>
            
            {/* Messages for this date */}
            {dateMessages.map((msg) => {
              const isOther = msg.isOtherUserMessage;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-1 sm:gap-2 items-end ${
                    isOther ? "self-start" : "self-end flex-row-reverse"
                  } max-w-[85%] sm:max-w-[70%]`}
                >
                  {/* Profile Image - Hidden on very small screens for own messages */}
                  <div className={`relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0 ${!isOther ? 'sm:block' : ''}`}>
                    <Image
                      src={getAvatarUrl(isOther)}
                      alt={getAltText(isOther)}
                      fill
                      className="object-cover rounded-full"
                      sizes="(max-width: 640px) 24px, (max-width: 768px) 32px, 40px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/profile-pic.png";
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-col text-[#667085] max-w-[calc(100%-40px)] sm:max-w-[21rem]">
                    <div
                      className={`rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base ${
                        isOther ? "bg-[#F8F9FA]" : "bg-[#233D4D33] text-black"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <div className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${
                      isOther ? "text-left" : "text-right"
                    }`}>
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
        ))
      )}
    </div>
  );
};

export default Chat;