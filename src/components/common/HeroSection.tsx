"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
  title?: string;
}
function HeroSection({ title }: Props) {
  const pathname = usePathname();

  const pageTitle = pathname.split("/").reverse()?.[0];
  const formatTitle = pageTitle?.split("-").join(" ");

  return (
    <div className="relative">
      <div className="relative w-full h-[221px] ">
        <Image
          src="/hero-section.png"
          alt="Hero Section"
          fill
          className="object-cover"
        />
      </div>
      <div
        className="absolute top-0 left-0 h-full w-2/3 z-10"
        style={{
          background:
            "linear-gradient(to left, #233d4d00 0%, #233d4d 50%, #233d4d 100%) ",
        }}
      ></div>

      <div className="z-20 absolute lg:left-28 left-8 top-1/2 -translate-y-1/2 text-[#fff] text-5xl font-medium capitalize">
    {title || formatTitle=="profile views" ?"Who's Looking  Your Profile" :formatTitle }
      </div>
    </div>
  );
}

export default HeroSection;
