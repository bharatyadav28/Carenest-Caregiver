import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  image: string;
  children: React.ReactNode;
}

function AuthLayout({ image, children }: Props) {
  return (
    <div className="w-full h-full py-8 md:px-20 bg-[#F7F7F3] px-5 flex flex-col">
      {/* Mobile/Tablet: Logo and Hero Section (visible < lg) */}
      <div className="lg:hidden flex flex-col items-center w-full mb-8">
        <div className="mb-6">
          <Link href="/">
            <Image src={"/auth/logoblue.png"} alt="Logo" width={180} height={100} className="cursor-pointer" />
          </Link>
        </div>
        
        {/* Mobile/Tablet: Hero Image Section with background designs behind card */}
        <div className="relative w-full">
          {/* Background design images behind the white card */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute left-[-1rem] top-[-1rem] z-0">
              <Image
                src="/auth/design.png"
                alt="Design"
                width={70}
                height={70}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="absolute right-[-1rem] bottom-[-1rem] z-0">
              <Image src="/auth/design.png" alt="Design" width={70} height={70} style={{ objectFit: "cover" }} />
            </div>
          </div>

          {/* Foreground white card */}
          <div className="relative z-10 bg-white rounded-2xl p-4 md:p-6">
            <div className="relative h-64 md:h-64 w-full mb-4 md:mb-6">
              <Image
                src={image}
                alt="Caregiver Hero"
                fill
                className="object-cover object-top rounded-lg"
              />
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-[#233D4D] text-center">
              Find Trusted Caregivers for Your Loved Ones at Home
            </h2>
            <p className="text-[#98A2B3] text-center text-sm md:text-base md:mt-3">
              Connect with verified professionals who provide compassionate, personalized care for seniors—right where they feel safest.
            </p>
          </div>
        </div>

        {/* Render page content (children) below hero for mobile/tablet */}
        <div className="w-full mt-6">
          {children}
        </div>

      </div>

      {/* Desktop (lg+): Two-column layout */}
      <div className="hidden lg:grid grid-cols-12 h-full flex-1 min-h-0">
        {/* Left form */}
        <div className="col-start-1 md:col-end-5 col-end-13 flex flex-col min-h-0">
          <div className="mb-6 hidden lg:block">
            <Link href="/">
              <Image src={"/auth/logoblue.png"} alt="Logo" width={180} height={100} className="cursor-pointer" />
            </Link>
          </div>
          <div className="h-full ">{children}</div>
        </div>

        {/* Right image - Desktop only */}
        <div className="lg:block hidden relative col-start-6 col-end-13 h-max mt-20 ">
          {/* Background design image - behind the white background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute left-[-3rem] top-[-2.2rem] ">
              <Image
                src="/auth/design.png"
                alt="Design"
                width={150}
                height={150}
                className=""
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="absolute right-[-3rem] bottom-[-2.2rem]">
              <Image src="/auth/design.png" alt="Logo" width={150} height={150} />
            </div>
          </div>

          {/* White background with content, above the design image */}
          <div className="relative z-10 bg-[#fff] p-8 flex flex-col">
            <div className="relative h-[28rem] w-full">
              <Image
                src={image}
                alt="Signup"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="mx-10">
              <div className="mt-6 mb-3 items-center text-center font-semibold text-4xl">
               Find Trusted Caregivers for Your Loved Ones at Home
              </div>
              <div className="text-[#98A2B3]  text-center px-0 text-xl">
               Connect with verified professionals who provide compassionate,
                personalized care for seniors—right where they feel safest.
              </div>
            </div>
          </div>
        </div>
        <div className="py-10"></div>
      </div>

    </div>
  );
}

export default AuthLayout;