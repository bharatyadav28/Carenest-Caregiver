import React from "react";
import Image from "next/image";

interface Props {
  image: string;
  children: React.ReactNode;
}

function AuthLayout({ image, children }: Props) {
  return (
    <div className="w-full h-screen py-8 md:px-20 px-5 bg-[var(--secondary-backgound)] flex flex-col  ">
      <div className="grid grid-cols-12 h-full flex-1 min-h-0">
        {/* Left form */}

        <div className="col-start-1 md:col-end-5 col-end-13 flex flex-col min-h-0">
          <div className="mb-4">
            <Image src={"/auth/logo.png"} alt="Logo" width={80} height={100} />
          </div>
          <div className="h-full overflow-auto hide-scrollbar">{children}</div>
        </div>

        {/* Right image */}
        <div className=" md:block hidden relative col-start-6 col-end-13 bg-[#fff] h-max mt-20">
          <div className="absolute left-[-3rem] top-[-1.2rem] ">
            <Image src="/auth/design.png" alt="Logo" width={100} height={100} />
          </div>

          <div className="z-100 p-8 flex flex-col ">
            <div className="relative h-[28rem] w-full">
              <Image
                src={image}
                alt="Signup"
                fill
                className="object-cover object-top "
              />
            </div>

            <div className="mx-10">
              <div className="mt-6 mb-3 items-center  text-center font-semibold text-4xl">
                Find Trusted Caregivers for Your Loved Ones at Home
              </div>
              <div className="text-[#98A2B3] text-sm text-center px-0">
                Connect with verified professionals who provide compassionate,
                personalized care for seniors—right where they feel safest.
              </div>
            </div>
          </div>

          <div className="absolute right-[-3rem] bottom-[-1.2rem] z-[0] ">
            <Image src="/auth/design.png" alt="Logo" width={100} height={100} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
