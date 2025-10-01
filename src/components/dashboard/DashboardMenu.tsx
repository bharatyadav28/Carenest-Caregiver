"use client";

import React from "react";
import { sidebarItemType } from "@/lib/interface-types";
import SidebarMenu from "../common/SidebarMenu";

function DashboardMenu() {
  
  const items: sidebarItemType[] = [
    {
      id: 1,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      id: 2,
      text: "Profile Views",
      path: "/profile-views",
    },
    {
      id: 3,
      text: "Bookings",
      path: "/bookings",
    },
    {
      id: 4,
      text: "Inbox",
      path: "/inbox",
    },

  ];
  return(
    <>
  
 
  <SidebarMenu items={items} ViewProfile={true} />
    </>
  );
}

export default DashboardMenu;
