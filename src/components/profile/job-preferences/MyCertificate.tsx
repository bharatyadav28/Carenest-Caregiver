import React, { useState } from "react";
import { AddButton } from "@/components/common/CustomButton";
import { BinIcon, binIconTheme, pdfIcons } from "@/lib/svg_icons";
import ActionDialog from "@/components/common/ActionDialog";
import CertificateDialog from "./MyCertificateDialog";
import { useGetCertificatesQuery } from "@/store/api/profileApi";

// Define a proper type for certificates
interface Certificate {
  id: string;
  type: string;
// optional, if there are extra fields you don't know yet
}

function MyCertificates() {
  const { data: certificates = [] } = useGetCertificatesQuery();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDialog = (cert: Certificate | null) => {
    setSelectedCert(cert);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (cert: Certificate) => {
    setSelectedCert(cert);
    setOpenDeleteDialog(true);
  };

  // 🔹 For now, just close dialog on delete (no API call)
  const handleDelete = async () => {
    console.log("Pretend delete:", selectedCert);
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">My Certification</div>
          <AddButton onClick={() => handleOpenDialog(null)} />
        </div>

        <div className="text-[var(--slat-gray)]">
          Upload your certificates.
        </div>

        <div className="flex flex-col gap-6 mt-2">
          {certificates.length === 0 ? (
            <div className="text-[var(--slat-gray)]">
              No certificates added yet.
            </div>
          ) : (
            certificates.map((cert: Certificate) => (
              <div key={cert.id} className="flex justify-between">
                <div className="text-sm flex flex-row justify-between gap-1 border rounded-xl px-4 py-4 w-full">
                  <div className="font-medium uppercase flex-row flex gap-3">
                    {pdfIcons} {cert.type}
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
        // selectedCert={selectedCert} // pass selected certificate if needed
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
