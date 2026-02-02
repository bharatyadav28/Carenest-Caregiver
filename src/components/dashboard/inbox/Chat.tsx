"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { chatMessageType } from "@/lib/interface-types";
import { useGetProfileQuery } from "@/store/api/profileApi";

// CDN URL for profile images (same as in SidebarMenu)
export const cdnURL = "https://carenest-storage.ap-south-1.storage.onantryk.com";

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
      className="flex flex-col flex-grow h-full overflow-y-auto hide-scrollbar gap-4 p-4"
      ref={containerRef}
    >
      {messages.length === 0 ? (
        // Show the "no messages" image when there are no messages
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="relative w-64 h-64">
            <Image
              src="/nomessage.png" // Your no messages image from public folder
              alt="No messages"
              fill
              className="object-contain"
              sizes="256px"
              priority
            />
          </div>
    
        </div>
      ) : (
        // Show messages when they exist
        Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="flex flex-col gap-4">
            {/* Date Header */}
            <div className="flex justify-center">
              <div className="bg-gray-100 text-black text-xs px-3 py-1 rounded-full">
                {formatDateHeader(date)}
              </div>
            </div>
            
            {/* Messages for this date */}
            {dateMessages.map((msg) => {
              const isOther = msg.isOtherUserMessage;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 items-end ${
                    isOther ? "self-start" : "self-end flex-row-reverse text-lg"
                  }`}
                >
                  {/* Profile Image */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={getAvatarUrl(isOther)}
                      alt={getAltText(isOther)}
                      fill
                      className="object-cover rounded-full"
                      sizes="40px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/profile-pic.png";
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-col text-[#667085] max-w-[21rem] text-lg">
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOther ? "bg-[#F8F9FA]" : "bg-[#233D4D33] text-black"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <div className="text-sm">
                      <div className={isOther ? "ms-1" : "self-end mr-1 text-sm"}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
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