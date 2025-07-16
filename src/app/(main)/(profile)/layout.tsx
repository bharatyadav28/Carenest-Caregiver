import React from "react";

import ProfileMenu from "@/components/profile/ProfileMenu";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="my-10 grid grid-cols-24">
      <div className="col-start-1 col-end-8 mr-5">
        <ProfileMenu />
      </div>
      <div className="lg:col-start-8 col-start-1 col-end-25 lg:mt-0 mt-8">
        {children}
      </div>
    </div>
  );
}

export default Layout;
