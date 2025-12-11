import React, { useState } from "react";
import { toast } from "react-toastify";
import { AddButton } from "@/components/common/CustomButton";
import { BinIcon, binIconTheme, pdfIcons } from "@/lib/svg_icons";
import ActionDialog from "@/components/common/ActionDialog";
import CertificateDialog from "./MyCertificateDialog";
import {
  useGetCertificatesQuery,
  useDeleteCertificateMutation,
} from "@/store/api/profileApi";

interface Certificate {
  id: string;
  fileUrl: string;
  createdAt: string;
}

function MyCertificates() {
  const { data: certificates = [], isLoading, isError, refetch } = useGetCertificatesQuery();
  const [deleteCertificate] = useDeleteCertificateMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDialog = () => {
    setSelectedCert(null);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (cert: Certificate) => {
    setSelectedCert(cert);
    setOpenDeleteDialog(true);
  };

  // Function to extract filename from URL
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').pop() || "Certificate";
    } catch (error) {
      console.log("Error parsing URL:", error);
      return "Certificate";
    }
  };

  // Function to get a shortened version of the file URL
  const getShortUrl = (url: string) => {
    try {
      // Remove protocol and domain, then get last part
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const parts = path.split('/').filter(part => part.length > 0);
      
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        // Show first 15 characters
        return lastPart.length > 15 ? `${lastPart.substring(0, 12)}...` : lastPart;
      }
      return url.substring(url.length - 15);
    } catch (error) {
      console.log("Error parsing URL:", error);
      // If URL parsing fails, just get last 15 characters
      return url.length > 15 ? `${url.substring(url.length - 15)}` : url;
    }
  };

  // Function to view document
  const handleViewDocument = (url: string) => {
    let viewUrl = url;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.startsWith('/')) {
        viewUrl = `https://creative-story.s3.us-east-1.amazonaws.com${url}`;
      } else {
        viewUrl = `https://creative-story.s3.us-east-1.amazonaws.com/${url}`;
      }
    }
    
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async () => {
    if (selectedCert) {
      try {
        await deleteCertificate({ id: selectedCert.id, fileUrl: selectedCert.fileUrl }).unwrap();
        
        toast.success("Certificate deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        refetch();
        
      } catch (err: any) {
        console.error("Failed to delete certificate:", err);
        
        toast.error(
          err?.data?.message || 
          "Failed to delete certificate. Please try again.",
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
    }
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">My Certification</div>
          <AddButton onClick={handleOpenDialog} />
        </div>

        <div className="text-[var(--slat-gray)] text-sm">Upload your certificates.</div>

        <div className="flex flex-col gap-3 mt-2">
          {isLoading ? (
            <div className="text-sm">Loading certificates...</div>
          ) : isError ? (
            <div className="text-red-500 text-sm">Failed to load certificates</div>
          ) : certificates.length === 0 ? (
            <div className="text-[var(--slat-gray)] text-sm">No certificates uploaded yet.</div>
          ) : (
            certificates.map((cert) => {
              const fileName = getFileNameFromUrl(cert.fileUrl);
              const displayName = fileName.length > 25 
                ? `${fileName.substring(0, 22)}` 
                : fileName;
              
              const shortUrl = getShortUrl(cert.fileUrl);
              
              return (
                <div key={cert.id} className="flex justify-between">
                  <div className="text-xs flex flex-row justify-between gap-2 border rounded-xl px-3 py-3 w-full items-center">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="text-gray-500">
                        {pdfIcons}
                      </div>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleViewDocument(cert.fileUrl)}
                          className="text-left hover:text-blue-600 hover:underline text-[14px] transition-colors duration-200 font-medium"
                          title="Click to view certificate"
                        >
                          {displayName}{shortUrl}

                        </button>
                       
                      </div>
                    </div>
                    <button
                      className="hover:cursor-pointer hover:opacity-90 transition text-gray-500"
                      onClick={() => handleOpenDeleteDialog(cert)}
                      title="Delete certificate"
                    >
                      {BinIcon}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upload / Add Certificate */}
      <CertificateDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(false)}
      />

      {/* Delete Confirmation */}
      <ActionDialog
        icon={binIconTheme}
        open={openDeleteDialog}
        handleOpen={() => setOpenDeleteDialog(false)}
        handleConfirm={handleDelete}
        heading="Delete Certificate"
        subheading="Are you sure you want to delete this certificate?"
        confirmText="Delete"
      />
    </>
  );
}

export default MyCertificates;