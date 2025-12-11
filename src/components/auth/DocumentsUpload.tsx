"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Import toast for success message

import UploadFiles from "@/components/auth/UploadFiles";
import { CustomButton } from "@/components/common/CustomButton";
import { pdfIcon, imageIcon } from "@/lib/svg_icons";
import { PiDotOutlineFill as DotIcon } from "react-icons/pi";
import { RxCross2 as CrossIcon } from "react-icons/rx";

import {
  useUploadDocumentMutation,
  useSaveDocumentsMutation,
} from "@/store/api/authApi";

// Helper function to get file icon based on type
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') return pdfIcon;
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp'].includes(extension || '')) 
    return imageIcon;
  if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) 
    return pdfIcon;
  
  return pdfIcon; // default
};

// Helper function to get file type string
const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toUpperCase();
  return extension || 'FILE';
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function DocumentsUpload() {
  const resumeRef = useRef<HTMLInputElement>(null);
  const workPermitRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [uploadedDocs, setUploadedDocs] = useState<
    { 
      type: "resume" | "work_permit"; 
      fileUrl: string; 
      name: string;
      size: number;
      file: File;
    }[]
  >([]);

  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [saveDocuments, { isLoading: isSaving }] = useSaveDocumentsMutation();

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
          ...prev.filter((doc) => doc.type !== type),
          { 
            type, 
            fileUrl: res.data.url, 
            name: file.name,
            size: file.size,
            file: file
          },
        ]);
        toast.success(`${file.name} uploaded successfully!`);
      }

      if (e.target) e.target.value = "";
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error(err.data?.message || "Failed to upload file");
    }
  };

  // Handle submit (save uploaded docs to backend)
  const handleSubmit = async () => {
    try {
      const payload = {
        documents: uploadedDocs.map((doc) => ({
          type: doc.type,
          fileUrl: doc.fileUrl,
          fileName: doc.name,
          fileSize: doc.size,
        })),
      };

      const res = await saveDocuments(payload).unwrap();

      if (res.success) {
        toast.success("Documents saved successfully!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Save documents failed:", err);
      toast.error(err.data?.message || "Failed to save documents");
    }
  };

  // Handle remove file
  const handleRemoveFile = (type: "resume" | "work_permit", name: string) => {
    setUploadedDocs((prev) =>
      prev.filter((d) => !(d.type === type && d.name === name))
    );
    toast.info(`${name} removed`);
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
          key={`${doc.type}-${doc.name}`}
          className="flex items-center rounded-xl bg-white py-4 px-5 mt-4 gap-4"
        >
          {/* File icon */}
          <div className="flex-shrink-0">
            {getFileIcon(doc.name)}
          </div>
          
          {/* File info - takes available space but doesn't overflow */}
          <div className="flex-grow min-w-0">
            {/* File name with truncation */}
            <div className="font-medium truncate pr-2" title={doc.name}>
              {doc.name}
            </div>
            
            {/* File details */}
            <div className="text-[var(--cool-gray)] text-sm flex items-center gap-1 flex-wrap">
              <span>Uploaded</span>
              <DotIcon />
              <span className="font-medium">{getFileType(doc.name)}</span>
              <DotIcon />
              <span>{formatFileSize(doc.size)}</span>
            </div>
          </div>
          
          {/* Remove button - fixed position on the right */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleRemoveFile(doc.type, doc.name)}
              className="hover:cursor-pointer hover:text-red-500 transition-colors p-1"
              aria-label={`Remove ${doc.name}`}
            >
              <CrossIcon size={18} />
            </button>
          </div>
        </div>
      ))}

      <CustomButton
        className="w-full mt-8 text-xl"
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