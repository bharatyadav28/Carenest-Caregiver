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

  // Mobile menu content with proper notification count
  const mobileMenuContent = (
    <div className="flex flex-col items-center gap-6 p-6">
      <Link
        href={"/dashboard"}
        onClick={() => setOpenMenu(false)}
        className={`font-medium ${
          pathName === "/dashboard" ? "text-primary" : "#fff"
        } text-2xl`}
      >
        Dashboard
      </Link>
      
      <button 
        className="relative p-4 flex items-center gap-3 w-full justify-center"
        onClick={() => {
          handleNotificationOpen();
          setOpenMenu(false);
        }}
      >
        <NotificationIcon size={30} />
        <span className="font-medium text-lg">Notifications</span>
        {mounted && unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <CustomButton
        className="py-[1.3rem] w-full"
        onClick={() => {
          router.push("/my-profile");
          setOpenMenu(false);
        }}
      >
        <div className="flex items-center gap-2 justify-center">
          <ProfileIcon />
          <div className="font-medium text-lg">My Profile</div>
        </div>
      </CustomButton>
    </div>
  );

  return (
    <>
      <div
        className={`flex justify-between bg-primary-foreground sticky top-0 z-9999 text-[#fff] items-center py-2 ${className}`}
      >
        <Link href={"/dashboard"}>
          <div className="relative w-40 h-18">
            <Image src={"/Logo.svg"} alt="Logo" fill className="object-contain" />
          </div>
        </Link>
        
        <div className="lg:block hidden">
          {navContent}
        </div>

        <button onClick={handleOpenMenu} className="lg:hidden">
          <MenuIcon size={30} />
        </button>

        <CustomDrawer
          className="bg-primary-foreground text-white"
          open={openMenu}
          handleOpen={handleOpenMenu}
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