"use client";
import React from "react";
import DashboardMenu from "@/components/dashboard/DashboardMenu";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="my-10 grid  xl:grid-cols-24  ">
      <div className="col-start-1 xl:col-end-8 mr-5">
        <DashboardMenu />
      </div>

      <div className="lg:col-start-8 col-start-1 col-end-25 lg:mt-0 mt-8">
        {children}
      </div>
    </div>
  );
}

export default Layout;
