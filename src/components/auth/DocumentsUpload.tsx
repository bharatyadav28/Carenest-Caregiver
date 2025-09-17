"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import UploadFiles from "@/components/auth/UploadFiles";
import { CustomButton } from "@/components/common/CustomButton";
import { pdfIcon } from "@/lib/svg_icons";
import { PiDotOutlineFill as DotIcon } from "react-icons/pi";
import { RxCross2 as CrossIcon } from "react-icons/rx";

import {
  useUploadDocumentMutation,
  useSaveDocumentsMutation,
} from "@/store/api/authApi"; // ✅ adjust path if needed

function DocumentsUpload() {
  const resumeRef = useRef<HTMLInputElement>(null);
  const workPermitRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workPermitFile, setWorkPermitFile] = useState<File | null>(null);

  const [uploadedDocs, setUploadedDocs] = useState<
    { type: "resume" | "work_permit"; fileUrl: string; name: string }[]
  >([]);

  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const [saveDocuments, { isLoading: isSaving }] =
    useSaveDocumentsMutation();

  // Handle upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "work_permit"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadDocument(formData).unwrap();

      if (res.success) {
        setUploadedDocs((prev) => [
          ...prev.filter((doc) => doc.type !== type), // overwrite if same type uploaded again
          { type, fileUrl: res.data.url, name: file.name },
        ]);
      }

      if (type === "resume") setResumeFile(file);
      if (type === "work_permit") setWorkPermitFile(file);

      if (e.target) e.target.value = ""; // reset input
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };
console.log(resumeFile, workPermitFile, uploadedDocs);
  // Handle submit (save uploaded docs to backend)
  const handleSubmit = async () => {
    try {
      const payload = {
        documents: uploadedDocs.map((doc) => ({
          type: doc.type,
          fileUrl: doc.fileUrl,
        })),
      };

      const res = await saveDocuments(payload).unwrap();

      if (res.success) {
        console.log("Documents saved:", res.message);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Save documents failed:", err);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4">
        <UploadFiles
          label="Upload your Resume"
          uploadTitle="Upload your Resume"
          handleUpload={(e) => handleFileUpload(e, "resume")}
          inputRef={resumeRef}
        />

        <UploadFiles
          label="Upload your Work Permit and License documents"
          uploadTitle="Upload your files"
          handleUpload={(e) => handleFileUpload(e, "work_permit")}
          inputRef={workPermitRef}
        />
      </div>

      {uploadedDocs.map((doc) => (
        <div
          key={doc.type}
          className="flex rounded-xl bg-[#fff] py-4 px-5 justify-between mt-4 "
        >
          <div className=" flex gap-4 items-center">
            <div>{pdfIcon}</div>
            <div>
              <div>{doc.name}</div>
              <div className="text-[var(--cool-gray)] text-sm flex items-center gap-1">
                <div>Uploaded</div>
                <div>
                  <DotIcon />
                </div>
                <div>PDF</div>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() =>
                setUploadedDocs((prev) =>
                  prev.filter((d) => d.type !== doc.type)
                )
              }
              className="hover:cursor-pointer"
            >
              <CrossIcon size={15} />
            </button>
          </div>
        </div>
      ))}

    <CustomButton
  className="w-full mt-8"
  onClick={handleSubmit}
  disabled={
    isUploading ||
    isSaving ||
    !uploadedDocs.find((d) => d.type === "resume") ||
    !uploadedDocs.find((d) => d.type === "work_permit")
  }
>
  {isUploading || isSaving ? "Processing..." : "Save & Continue"}
</CustomButton>
    </div>
  );
}

export default DocumentsUpload;
