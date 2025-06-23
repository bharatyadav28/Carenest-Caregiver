"use client";
import React from "react";
import DashboardMenu from "@/components/dashboard/DashboardMenu";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="my-8 grid grid-cols-1 lg:grid-cols-24 gap-8 px-4 sm:px-6 lg:px-8">
  
      <div className="lg:col-start-1 lg:col-end-7 w-full">
        <DashboardMenu />
      </div>
      
    
      <div className="lg:col-start-8 lg:col-end-25 w-full">
        {children}
      </div>
    </div>
  );
}

export default Layout;