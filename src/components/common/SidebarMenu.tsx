"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MdArrowForwardIos as ArrowIcon } from "react-icons/md";
import { RiFileList3Line as MenuIcon } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";

import CustomDrawer from "./CustomDrawer";
import { sidebarItemType } from "@/lib/interface-types";
import { CustomPieChart } from "./CustomPieChart";
import {
  useGetProfileQuery,
  useUpdateAvatarMutation,
} from "@/store/api/profileApi";

// CDN URL for profile images
export const cdnURL = "https://creative-story.s3.us-east-1.amazonaws.com";

interface Props {
  items: sidebarItemType[];
  ViewProfile: boolean;
}
function SidebarMenu({ items, ViewProfile }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const lastIndex = items?.length - 1;
  const handleViewProfileClick = () => {
    router.push("/my-profile");
  };
  const handleOpenMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleItemClick = ({
    path,
    handleClick,
  }: {
    path?: string;
    handleClick?: () => void;
  }) => {
    if (path) router.push(path);
    else if (handleClick) handleClick();
  };

  // Fetch profile data from API
  const { data: profile, refetch } = useGetProfileQuery();
  const [updateAvatar] = useUpdateAvatarMutation();

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      await updateAvatar(formData).unwrap();
      refetch();
    } catch (err) {
      console.log(err);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    let completedFields = 0;
    const totalFields = 7; // Total number of fields to check
    
    // Check name
    if (profile.name && profile.name.trim() !== "") completedFields++;
    
    // Check email
    if (profile.email && profile.email.trim() !== "") completedFields++;
    
    // Check mobile
    if (profile.mobile && profile.mobile.trim() !== "") completedFields++;
    
    // Check address
    if (profile.address && profile.address.trim() !== "") completedFields++;
    
    // Check zipcode
    if (profile.zipcode) completedFields++;
    
    // Check gender
    if (profile.gender && profile.gender.trim() !== "") completedFields++;
    
    // Check avatar
    if (profile.avatar && profile.avatar.trim() !== "" && profile.avatar !== "/profile-pic.png") completedFields++;
    
  
    
    // Calculate percentage
    const percentage = Math.round((completedFields / totalFields) * 100);
    return percentage;
  };

  const name = profile?.name || "Loading...";
  const profileCompletionPercentage = calculateProfileCompletion();
  
  let avatar =
    profile?.avatar && profile.avatar !== ""
      ? profile.avatar
      : "/profile-pic.png";

  // If avatar is not a full URL, prepend the CDN URL
  if (avatar && avatar !== "/profile-pic.png") {
    avatar = `${cdnURL}${avatar}`;
  }

  const content = (
    <div className="min-h-[20rem] w-full min-w-[22rem] px-4 py-6 bg-[#fff] rounded-lg shadow-2xl">
      <div className="flex items-center gap-4">
        {/* Pass dynamic percentage to CustomPieChart */}
        <CustomPieChart percentage={profileCompletionPercentage}>
          <div
            className="relative rounded-full w-20 h-20 m-3 group cursor-pointer"
            onClick={handleAvatarClick}
            title="Edit profile image"
          >
            <Image
              src={avatar}
              alt="profile pic"
              fill
              className="object-cover rounded-full border"
              style={{ opacity: avatarUploading ? 0.5 : 1 }}
            />
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full text-xs">
                Uploading...
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
              disabled={avatarUploading}
            />
            {/* Edit icon */}
            <span className="absolute bottom-3 right-4 text-white/80 rounded-full p-1 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition">
              <FiEdit2 size={22} />
            </span>
          </div>
        </CustomPieChart>
        
        {/* Change: Removed items-center to keep name and button aligned to start */}
        <div className="flex flex-col">
          <div className="text-[1.4rem] font-semibold mb-1 capitalize break-words max-w-[180px]">
            {name}
          </div>
          
          {ViewProfile === true && (
            <div className="mt-1">
              <button
                onClick={handleViewProfileClick}
                className="text-[#F2A307] border-1 border-[#F2A307] font-medium rounded-full bg-[#F2A3071A] px-4 py-1.5 text-md hover:bg-[#F2A3071A]/80 transition-colors"
              >
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full border-t-1 border-[#33333333] my-2"></div>

      <div className="flex flex-col gap-2 mt-3">
        {items?.map((item, index) => {
          const isCurrentPage = pathname === item.path;
          const lastItem = lastIndex === index;

          return (
            <div
              className={`flex justify-between border-cool-gray py-3 px-4 text-[#1B2A37] font-medium hover:cursor-pointer transition-all w-full ${
                isCurrentPage ? "bg-primary rounded-full" : ""
              } ${!lastItem ? "border-b" : ""}`}
              key={item.id}
              onClick={() =>
                handleItemClick({
                  path: item?.path,
                  handleClick: item?.handleClick,
                })
              }
            >
              <div>{item.text}</div>
              <button>
                <ArrowIcon size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  return (
    <>
      <div className="lg:block hidden">{content}</div>

      <button onClick={handleOpenMenu} className="lg:hidden">
        <MenuIcon size={30} />
      </button>

      <CustomDrawer
        className="lg-hidden w-max h-max my-auto mx-auto rounded-lg"
        open={openMenu}
        handleOpen={handleOpenMenu}
        direction="left"
      >
        {content}
      </CustomDrawer>
    </>
  );
}

export default SidebarMenu;