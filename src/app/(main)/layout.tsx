"use client";
import React from "react";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import HeroSection from "@/components/common/HeroSection";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const commonClasses = "lg:px-28 px-8";

  return (
    <div className="min-h-screen flex flex-col ">
      <Header className={commonClasses} />
      <HeroSection />
      <div className={commonClasses}>{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
