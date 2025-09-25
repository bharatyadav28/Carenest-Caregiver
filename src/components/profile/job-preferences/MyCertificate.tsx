import React, { useState } from "react";
import { AddButton } from "@/components/common/CustomButton";
import { BinIcon, binIconTheme, pdfIcons } from "@/lib/svg_icons";
import ActionDialog from "@/components/common/ActionDialog";
import CertificateDialog from "./MyCertificateDialog";
import {
  useGetCertificatesQuery,
  useDeleteCertificateMutation,
} from "@/store/api/profileApi"; // ✅ adjust path

interface Certificate {
  id: string;
  fileUrl: string;
  createdAt: string;
}

function MyCertificates() {
  const { data: certificates = [], isLoading, isError } = useGetCertificatesQuery();
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

  const handleDelete = async () => {
    if (selectedCert) {
      try {
        await deleteCertificate({ id: selectedCert.id, fileUrl: selectedCert.fileUrl }).unwrap();
      } catch (err) {
        console.error("❌ Failed to delete certificate:", err);
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

        <div className="text-[var(--slat-gray)]">Upload your certificates.</div>

        <div className="flex flex-col gap-6 mt-2">
          {isLoading ? (
            <div>Loading certificates...</div>
          ) : isError ? (
            <div className="text-red-500">Failed to load certificates</div>
          ) : certificates.length === 0 ? (
            <div className="text-[var(--slat-gray)]"></div>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <div className="text-sm flex flex-row justify-between gap-1 border rounded-xl px-4 py-4 w-full">
                  <div className="font-medium uppercase flex-row flex gap-3">
                    {pdfIcons} {cert.fileUrl.split(".").pop()?.toUpperCase()}
                  </div>
                  <button
                    className="hover:cursor-pointer hover:opacity-90 transition"
                    onClick={() => handleOpenDeleteDialog(cert)}
                  >
                    {BinIcon}
                  </button>
                </div>
              </div>
            ))
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
