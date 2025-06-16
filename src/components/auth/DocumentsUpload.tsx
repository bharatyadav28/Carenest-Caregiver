"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";

import UploadFiles from "@/components/auth/UploadFiles";
import { CustomButton } from "@/components/common/CustomButton";
import { pdfIcon } from "@/lib/svg_icons";
import { PiDotOutlineFill as DotIcon } from "react-icons/pi";
import { RxCross2 as CrossIcon } from "react-icons/rx";

function DocumentsUpload() {
  const resumeRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/signin");
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file", file);

    if (resumeRef.current) {
      resumeRef.current.value = "";
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4">
        <UploadFiles
          label="Upload your Resume"
          uploadTitle="Upload your Resume"
          handleUpload={handleResumeUpload}
          inputRef={resumeRef}
        />

        <UploadFiles
          label="Upload your Work Permit and License documents"
          uploadTitle="Upload your files"
          handleUpload={handleResumeUpload}
          inputRef={resumeRef}
        />
      </div>

      <div className="flex rounded-xl bg-[#fff] py-4 px-5 justify-between mt-4 ">
        <div className=" flex gap-4 items-center">
          <div>{pdfIcon}</div>
          <div>
            <div>Documents/files name.pdf</div>
            <div className="text-[var(--cool-gray)] text-sm flex items-center gap-1">
              <div>10mb</div>
              <div>
                <DotIcon />
              </div>
              <div>PDF</div>
            </div>
          </div>
        </div>

        <div>
          <button className="hover:cursor-pointer">
            <CrossIcon size={15} />
          </button>
        </div>
      </div>

      <CustomButton className="w-full mt-8" onClick={handleSubmit}>
        {" "}
        Save & Continue
      </CustomButton>
    </div>
  );
}

export default DocumentsUpload;
