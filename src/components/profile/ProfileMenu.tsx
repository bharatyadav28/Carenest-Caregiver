"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { sidebarItemType } from "@/lib/interface-types";
import SidebarMenu from "../common/SidebarMenu";
import ActionDialog from "../common/ActionDialog";
import { binIconTheme, logoutIcon } from "@/lib/svg_icons";
import { useDeleteAccountMutation } from "@/store/api/profileApi";

function ProfileMenu() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [deleteAccount] = useDeleteAccountMutation();
  const router = useRouter();

  const handleDeleteDialog = () => {
    
    setOpenDeleteDialog((prev) => !prev);

  };

  const handleLogoutDialog = () => {
    setOpenLogoutDialog((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
     Cookies.remove("refreshToken");
    handleLogoutDialog();
    router.push("/signin");
  };

    const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
      router.push("/signin"); // Redirect after successful deletion
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      handleDeleteDialog(); // Close dialog
    }
  };

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
      path: "/reset-password",
    },
    {
      id: 5,
      text: "Delete Account",
    
      handleClick: handleDeleteDialog,
    },
    {
      id: 6,
      text: "Log Out",
      handleClick: handleLogoutDialog,
    },
  ];
  return (
    <>
      <SidebarMenu items={items} ViewProfile={false}/>

      <ActionDialog
        open={openDeleteDialog}
        handleOpen={handleDeleteDialog}
        icon={binIconTheme}
        heading="Account Deletion"
        subheading="Are you sure you want to delete your account?"
        handleConfirm={handleDeleteAccount}
          confirmText="Delete"
      />

      <ActionDialog
        open={openLogoutDialog}
        handleOpen={handleLogoutDialog}
        icon={logoutIcon}
        heading="Account Logout"
        subheading="Are you sure you want to logout your account?"
        handleConfirm={handleLogout}
          confirmText="Logout"
      
      />
    </>
  );
}

export default ProfileMenu;
