"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoNotificationsOutline as NotificationIcon } from "react-icons/io5";
import { MdMenu as MenuIcon } from "react-icons/md";
import Image from "next/image";
import { CustomButton } from "./CustomButton";
import { IoMdPerson as ProfileIcon } from "react-icons/io";
// import { Logo } from "@/lib/svg_icons";
import CustomDrawer from "./CustomDrawer";
import Notification from "../Notification";

interface props {
  className: string;
}

function Header({ className }: props) {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();

  const handleOpenMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleNotificationOpen = () => {
    setOpenNotifications((prev) => !prev);
  };
  const pathName = usePathname();

  const unseenNotifications = true;

  const navContent = (
    <div className="flex lg:flex-row flex-col items-center gap-6">
      <div className=" flex lg:flex-row flex-col items-center lg:gap-16 gap-6">
        <Link
          href={"/dashboard"}
          className={`font-medium ${
            pathName === "/dashboard" ? "text-primary" : "#fff"
          } lg:mt-0 mt-4`}
        >
          Dashboard
        </Link>
        <button className="relative" onClick={handleNotificationOpen}>
          <NotificationIcon size={20} />
          {unseenNotifications && (
            <div className="w-2 h-2 rounded-full bg-primary absolute top-0 right-[0.1rem]" />
          )}
        </button>
      </div>

      <CustomButton
        className="py-[1.1rem] lg:mb-0 mb-4"
        onClick={() => {
          router.push("/my-profile");
        }}
      >
        <div className="flex items-center gap-2">
          <ProfileIcon />
          <div className="font-medium">My Profile</div>
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
 <div className="relative w-40 h-21 x">
  
            <Image src={"/Logo.svg"} alt="Logo" fill  />
          
          </div>
            </Link>
        <div className="lg:block hidden"> {navContent}</div>

        <button onClick={handleOpenMenu} className="lg:hidden">
          <MenuIcon size={30} />
        </button>

        <CustomDrawer
          className="bg-primary-foreground text-white lg-hidden "
          open={openMenu}
          handleOpen={handleOpenMenu}
        >
          {navContent}
        </CustomDrawer>
      </div>

      <Notification
        open={openNotifications}
        handleOpen={handleNotificationOpen}
      />
    </>
  );
}

export default Header;
