"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoNotificationsOutline as NotificationIcon } from "react-icons/io5";
import { MdMenu as MenuIcon } from "react-icons/md";
import Image from "next/image";
import { CustomButton } from "./CustomButton";
import { IoMdPerson as ProfileIcon } from "react-icons/io";
import CustomDrawer from "./CustomDrawer";
import Notification from "../Notification";
import { useGetUnreadCountQuery } from "../../store/api/notificationApi";
import Cookies from "js-cookie";
import { frontendurl } from "../../lib/utils"; // Adjust import path

interface props {
  className: string;
}

function Header({ className }: props) {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  // Get unread notification count
  const token = Cookies.get("authToken");
  const { data: unreadCountData, refetch: refetchUnreadCount } = useGetUnreadCountQuery(undefined, {
    skip: !token, // Only fetch if user is logged in
  });

  const unreadCount = unreadCountData?.data?.unreadCount || 0;

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(frontendurl, "_blank");
  };

  const handleOpenMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleNotificationOpen = () => {
    setOpenNotifications(true);
    // Refetch unread count when opening notifications
    refetchUnreadCount();
  };

  const handleNotificationClose = () => {
    setOpenNotifications(false);
  };

  const navContent = (
    <div className="flex lg:flex-row flex-col items-center gap-6 py-4">
      <div className="flex lg:flex-row flex-col items-center lg:gap-16 gap-6">
        <Link
          href={"/dashboard"}
          className={`font-medium ${
            pathName === "/dashboard" ? "text-primary" : "#fff"
          } lg:mt-0 mt-4 text-2xl`}
        >
          Dashboard
        </Link>
        <button 
          className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={handleNotificationOpen}
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <NotificationIcon size={30} />
          {/* Show unread notification indicator */}
          {mounted && unreadCount > 0 && (
            <div className="absolute -top-1 -right-1">
              {/* Animated ping effect for new notifications */}
              <div className="relative">
                <div className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Fallback for SSR - static dot */}
          {!mounted && unreadCount > 0 && (
            <div className="w-2 h-2 rounded-full bg-primary absolute top-0 right-[0.1rem]" />
          )}
        </button>
      </div>

      <CustomButton
        className="py-[1.3rem] lg:mb-0 mb-4"
        onClick={() => {
          router.push("/my-profile");
          setOpenMenu(false);
        }}
      >
        <div className="flex items-center gap-2">
          <ProfileIcon />
          <div className="font-medium text-lg">My Profile</div>
        </div>
      </CustomButton>
    </div>
  );

  // Mobile menu content with updated design
  const mobileMenuContent = (
    <div className="flex flex-col h-full">
      {/* Navigation Links */}
      <div className="flex-1 py-8">
        
        <div className="flex flex-col">
          <Link
            href={"/dashboard"}
            onClick={() => setOpenMenu(false)}
            className={`px-8 py-5 text-xl font-medium transition-colors ${
              pathName === "/dashboard" 
                ? "text-primary bg-white/10 border-l-4 border-primary" 
                : "text-white hover:bg-white/5"
            }`}
          >
            Dashboard
          </Link>
          
          <Link
            href={"/my-profile"}
            onClick={() => setOpenMenu(false)}
            className={`px-8 py-5 text-xl font-medium transition-colors ${
              pathName === "/my-profile" 
                ? "text-primary bg-white/10 border-l-4 border-primary" 
                : "text-white hover:bg-white/5"
            }`}
          >
            My Profile
          </Link>
          
        </div>
      </div>

      {/* Notification at the bottom */}
    
    </div>
  );

  return (
    <>
      <div
        className={`flex justify-between bg-primary-foreground sticky top-0 z-9999 text-[#fff] items-center py-2 ${className}`}
      >
        {/* Updated Logo with click handler */}
        <div 
          className="relative w-40 h-18 cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image 
            src={"/Logo.svg"} 
            alt="Logo" 
            fill 
            className="object-contain"
          />
        </div>
        
        <div className="lg:block hidden">
          {navContent}
          
        </div>
      
         <div className=" lg:hidden ">
        <button 
          className="w-full px-8 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors lg:hidden "
          onClick={() => {
            handleNotificationOpen();
            setOpenMenu(false);
          }}
        >
          <div className="relative">
            <NotificationIcon size={28} />
            {mounted && unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          {/* <span className="text-white text-xl font-medium">Notifications</span> */}
        </button>
      </div>
        <button onClick={handleOpenMenu} className="lg:hidden">
          <MenuIcon size={30} />
        </button>
    

        <CustomDrawer
          className="bg-primary-foreground text-white pt-25"
          open={openMenu}
          handleOpen={handleOpenMenu}
          direction="left" // This makes the drawer slide from left
        >
          {mobileMenuContent}
        </CustomDrawer>
      </div>

      <Notification
        open={openNotifications}
        handleOpen={handleNotificationClose}
      />
    </>
  );
}

export default Header;