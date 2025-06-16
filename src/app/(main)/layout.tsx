import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import React from "react";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
