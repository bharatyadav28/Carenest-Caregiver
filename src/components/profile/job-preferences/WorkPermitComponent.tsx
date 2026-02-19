// WorkPermitComponent.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AddButton, EditButton } from "@/components/common/CustomButton";
import { pdfIcons } from "@/lib/svg_icons";
import WorkPermitDialog from "./WorkPermitDialog";
import {
  useGetWorkPermitQuery,
  useUpdateDocumentMutation,
  useUploadDocumentMutation,
} from "@/store/api/profileApi";
import { cdnURL } from "@/lib/utils";

// Define a specific type for Work Permit
interface WorkPermitDocument {
  id: string;
  userId: string;
  type: 'work_permit';
  fileUrl: string;
  createdAt: string;
}

// Helper function to convert the generic Document to WorkPermitDocument
const convertToWorkPermit = (doc: any): WorkPermitDocument | null => {
  if (!doc) return null;
  
  return {
    id: doc.id,
    userId: doc.userId,
    type: 'work_permit' as const,
    fileUrl: doc.fileUrl,
    createdAt: doc.createdAt,
  };
};

function WorkPermitComponent() {
  const { data: workPermitData, isLoading, isError, refetch } = useGetWorkPermitQuery();
  
  // Convert the generic Document to WorkPermitDocument
  const workPermit = workPermitData ? convertToWorkPermit(workPermitData) : null;
  
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
      return urlObj.pathname.split('/').pop() || "Driving License";
    } catch (error) {
      console.log("Error parsing URL:", error);
      return "Driving License";
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
      
      // 2. Save/Update work permit with the URL
      await updateDocument({
        type: 'work_permit',
        fileUrl: uploadResult.data.url
      }).unwrap();
      
      toast.success("Driving License uploaded successfully!", {
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
      console.error("Failed to upload driving license:", err);
      
      toast.error(
        err?.data?.message || 
        "Failed to upload driving license. Please try again.",
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

  // Determine which button to show based on whether work permit exists
  const showAddButton = !workPermit?.fileUrl;
  const showEditButton = !!workPermit?.fileUrl;

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">Driving License</div>
          {showAddButton && <AddButton onClick={handleOpenDialog} />}
          {showEditButton && <EditButton onClick={handleOpenDialog} />}
        </div>

        <div className="text-[var(--slat-gray)] text-sm">Upload your driving license document.</div>

        <div className="flex flex-col gap-3 mt-2">
          {isLoading ? (
            <div className="text-sm">Loading driving license...</div>
          ) : isError ? (
            <div className="text-red-500 text-sm">Failed to load driving license</div>
          ) : !workPermit?.fileUrl ? (
            <div className="text-[var(--slat-gray)] text-sm">No driving license uploaded yet.</div>
          ) : (
            <div className="flex justify-between">
              <div className="text-xs flex flex-row justify-between gap-2 border rounded-xl px-3 py-3 w-full items-center">
                <div className="flex flex-row gap-2 items-center">
                  <div className="text-gray-500">
                    {pdfIcons}
                  </div>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleViewDocument(workPermit.fileUrl)}
                      className="text-left hover:text-blue-600 hover:underline text-[14px] transition-colors duration-200 font-medium"
                      title="Click to view driving license"
                    >
                      {getFileNameFromUrl(workPermit.fileUrl)}
                    </button>
                    <span className="text-xs text-gray-500">
                      {getShortUrl(workPermit.fileUrl)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload / Update Dialog */}
      <WorkPermitDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(false)}
        onFileUpload={handleFileUpload}
        existingDocument={workPermit}
      />
    </>
  );
}

export default WorkPermitComponent;