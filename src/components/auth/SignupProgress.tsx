"use client";
import React from "react";
import { usePathname } from "next/navigation";

function SignupProgress() {
  const pathName = usePathname();
  const isDocumentsPage = pathName?.split("/")?.includes("documents");

  console.log("Pathname", pathName, isDocumentsPage);
  const classes =
    "bg-primary-foreground text-[#fff] text-sm px-[0.6rem] py-1 rounded-full w-max";

  return (
    <div className="flex flex-col gap-1 w-[17rem] mt-4 mb-6">
      <div className="flex w-[15.5rem] items-center">
        <div className={`${classes} ${isDocumentsPage && "!bg-primary"} `}>
          1
        </div>

        <div
          className={`flex-grow border-t-1  ${
            isDocumentsPage ? " border-primary" : "border-primary-foreground"
          }`}
        ></div>
        <div className={classes}>2</div>
      </div>

      <div className="flex justify-between text-sm font-medium">
        <div>Basic Details</div>
        <div>Documents</div>
      </div>
    </div>
  );
}

export default SignupProgress;
