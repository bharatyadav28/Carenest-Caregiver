// ResumeComponent.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AddButton, EditButton } from "@/components/common/CustomButton";
import { pdfIcons } from "@/lib/svg_icons";
import ResumeDialog from "./ResumeDialog";
import {
  useGetResumeQuery,
  useUpdateDocumentMutation,
  useUploadDocumentMutation,
} from "@/store/api/profileApi";
import { cdnURL } from "@/lib/utils";

// Define a specific type for Resume
interface ResumeDocument {
  id: string;
  userId: string;
  type: 'resume';
  fileUrl: string;
  createdAt: string;
}

// Helper function to convert the generic Document to ResumeDocument
const convertToResume = (doc: any): ResumeDocument | null => {
  if (!doc) return null;
  
  return {
    id: doc.id,
    userId: doc.userId,
    type: 'resume' as const,
    fileUrl: doc.fileUrl,
    createdAt: doc.createdAt,
  };
};

function ResumeComponent() {
  const { data: resumeData, isLoading, isError, refetch } = useGetResumeQuery();
  
  // Convert the generic Document to ResumeDocument
  const resume = resumeData ? convertToResume(resumeData) : null;
  
  const [updateDocument] = useUpdateDocumentMutation();
  const [uploadDocument] = useUploadDocumentMutation();

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to extract filename from URL
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').pop() || "Resume";
    } catch (error) {
      console.log("Error parsing URL:", error);
      return "Resume";
    }
  };

  // Function to get a shortened version of the file URL
  const getShortUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const parts = path.split('/').filter(part => part.length > 0);
      
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        return lastPart.length > 15 ? `${lastPart.substring(0, 12)}...` : lastPart;
      }
      return url.substring(url.length - 15);
    } catch (error) {
      return url.length > 15 ? `${url.substring(url.length - 15)}` : url;
    }
  };

  // Function to view document
  const handleViewDocument = (url: string) => {
    let viewUrl = url;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.startsWith('/')) {
        viewUrl = `${cdnURL}${url}`;
      } else {
        viewUrl = `${cdnURL}/${url}`;
      }
    }
    
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFileUpload = async (file: File) => {
    try {
      // 1. Upload file to get URL
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResult = await uploadDocument(formData).unwrap();
      
      // 2. Save/Update resume with the URL
      await updateDocument({
        type: 'resume',
        fileUrl: uploadResult.data.url
      }).unwrap();
      
      toast.success("Resume uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      refetch();
      setOpenDialog(false);
      
    } catch (err: any) {
      console.error("Failed to upload resume:", err);
      
      toast.error(
        err?.data?.message || 
        "Failed to upload resume. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  // Determine which button to show based on whether resume exists
  const showAddButton = !resume?.fileUrl;
  const showEditButton = !!resume?.fileUrl;

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">Resume</div>
          {showAddButton && <AddButton onClick={handleOpenDialog} />}
          {showEditButton && <EditButton onClick={handleOpenDialog} />}
        </div>

        <div className="text-[var(--slat-gray)] text-sm">Upload your resume document.</div>

        <div className="flex flex-col gap-3 mt-2">
          {isLoading ? (
            <div className="text-sm">Loading resume...</div>
          ) : isError ? (
            <div className="text-red-500 text-sm">Failed to load resume</div>
          ) : !resume?.fileUrl ? (
            <div className="text-[var(--slat-gray)] text-sm">No resume uploaded yet.</div>
          ) : (
            <div className="flex justify-between">
              <div className="text-xs flex flex-row justify-between gap-2 border rounded-xl px-3 py-3 w-full items-center">
                <div className="flex flex-row gap-2 items-center">
                  <div className="text-gray-500">
                    {pdfIcons}
                  </div>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleViewDocument(resume.fileUrl)}
                      className="text-left hover:text-blue-600 hover:underline text-[14px] transition-colors duration-200 font-medium"
                      title="Click to view resume"
                    >
                      {getFileNameFromUrl(resume.fileUrl)}
                    </button>
                    <span className="text-xs text-gray-500">
                      {getShortUrl(resume.fileUrl)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload / Update Dialog */}
      <ResumeDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(false)}
        onFileUpload={handleFileUpload}
        existingDocument={resume}
      />
    </>
  );
}

export default ResumeComponent;