import React from "react";
import Image from "next/image";

interface Props {
  image: string;
  children: React.ReactNode;
}

function AuthLayout({ image, children }: Props) {
  return (
    <div className="w-full h-full py-8 md:px-20 px-5 bg-[var(--secondary-backgound)] flex flex-col">
      <div className="grid grid-cols-12 h-full flex-1 min-h-0">
        {/* Left form */}
        <div className="col-start-1 md:col-end-5 col-end-13 flex flex-col min-h-0">
          <div className="mb-0">
            <Image src={"/auth/logoblue.png"} alt="Logo" width={180} height={100} />
          </div>
          <div className="h-full ">{children}</div>
        </div>

        {/* Right image */}
        <div className="md:block hidden relative col-start-6 col-end-13 h-max mt-20 ">
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
             Join a Trusted Network of Professional Elderly Caregivers
              </div>
              <div className="text-[#98A2B3]  text-center px-0 text-xl">
               Offer your caregiving skills, connect with families in need, and find caregiving jobs that match your skills and location.
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
