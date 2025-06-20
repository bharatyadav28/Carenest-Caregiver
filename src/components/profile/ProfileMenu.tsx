"use client";

import React from "react";
import { sidebarItemType } from "@/lib/interface-types";
import SidebarMenu from "../common/SidebarMenu";

function ProfileMenu() {
  const items: sidebarItemType[] = [
    {
      id: 1,
      text: "Manage Profile",
      path: "/my-profile",
    },
    {
      id: 2,
      text: "Job Preferences",
      path: "/job-preferences",
    },
    {
      id: 3,
      text: "Subscription",
      path: "/subscription",
    },
    {
      id: 4,
      text: "Reset Password",
      path: "/change-password",
    },
    {
      id: 5,
      text: "Delete Account",
      handleClick: () => {},
    },
    {
      id: 6,
      text: "Log Out",
      handleClick: () => {},
    },
  ];
  return <SidebarMenu items={items} />;
}

export default ProfileMenu;
