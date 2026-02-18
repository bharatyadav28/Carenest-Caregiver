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
      {/* Mobile Image */}
      <div className="relative w-full h-[230px] sm:h-[230px] md:h-[231px] md:hidden">
        <Image
          src="/imagemobile.png"
          alt="Hero Section Mobile"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>

      {/* Desktop Image */}
      <div className="relative w-full h-[230px] sm:h-[230px] md:h-[231px] hidden md:block">
        <Image
          src="/hero-section.png"
          alt="Hero Section"
          fill
          style={{ objectFit: "cover", objectPosition: "80% center" }}
          priority
        />
      </div>
      
      {/* Desktop gradient overlay (kept exactly as your design) */}
      <div
        className="absolute top-0 left-0 h-full w-2/3 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(to left, #233d4d00 0%, #233d4d 50%, #233d4d 100%)",
        }}
      ></div>

      {/* Mobile gradient overlay (new for mobile screens) */}
      <div
        className="absolute inset-0 z-10 md:hidden"
        style={{
          background:
            "linear-gradient(to top, #233d4d 0%, #233d4dcc 50%, #233d4d00 100%)",
        }}
      ></div>

      {/* Title with responsive positioning */}
      <div 
        className={`
          z-20 absolute 
          text-[#fff] font-medium capitalize
          left-1/2 md:left-8 lg:left-28 
          -translate-x-1/2 md:translate-x-0 
          text-center md:text-left
          text-3xl sm:text-4xl md:text-5xl
          whitespace-nowrap max-w-none
          ${title || formatTitle === "profile views" 
            ? "bottom-6 md:top-1/2 md:-translate-y-1/2" 
            : "bottom-6 md:top-1/2 md:-translate-y-1/2"
          }
        `}
      >
        {title || (formatTitle === "profile views" ? "Who's Looking Your Profile" : formatTitle)}
      </div>
    </div>
  );
}

export default HeroSection;