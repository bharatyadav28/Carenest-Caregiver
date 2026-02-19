import React from "react";
import ProfileMenu from "@/components/profile/ProfileMenu";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="my-10 grid grid-cols-24">
      {/* Profile Menu - significantly wider now */}
      <div className="col-start-1 col-end-10 mr-5">
        <ProfileMenu />
      </div>
      
      {/* Content - adjusted to start after profile menu */}
      <div className="lg:col-start-10 col-start-1 col-end-25 lg:mt-0 mt-8">
        {children}
      </div>
    </div>
  );
}

export default Layout;