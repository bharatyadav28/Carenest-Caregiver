"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import toast

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
    sessionStorage.clear();
    localStorage.clear(); // Also clear localStorage
    
    // Show success toast
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    handleLogoutDialog();
    router.push("/signin");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
      sessionStorage.clear();
      localStorage.clear(); // Also clear localStorage
      
      // Show success toast
      toast.success("Account deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      router.push("/signin"); // Redirect after successful deletion
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      
      // Show error toast
      toast.error(
        error?.data?.message || 
        "Failed to delete account. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
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
      <SidebarMenu items={items} ViewProfile={false} />

      <ActionDialog
        open={openDeleteDialog}
        handleOpen={handleDeleteDialog}
        icon={binIconTheme}
        heading="Delete Account"
        subheading="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
        handleConfirm={handleDeleteAccount}
        confirmText="Delete"
      />

      <ActionDialog
        open={openLogoutDialog}
        handleOpen={handleLogoutDialog}
        icon={logoutIcon}
        heading="Log Out"
        subheading="Are you sure you want to logout from your account?"
        handleConfirm={handleLogout}
        confirmText="Logout"
      />
    </>
  );
}

export default ProfileMenu;