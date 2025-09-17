import React, { useState } from "react";
import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";
import { pdfIcons } from "@/lib/svg_icons";
import {
  useUploadDocumentMutation,
  useSaveCertificateMutation,
} from "@/store/api/profileApi";

interface CertificateDialogProps {
  open: boolean;
  handleOpen: () => void;
}

const CertificateDialog: React.FC<CertificateDialogProps> = ({
  open,
  handleOpen,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadDocument] = useUploadDocumentMutation();
  const [saveCertificate] = useSaveCertificateMutation();
  const [loading, setLoading] = useState(false);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = e.target.files;
  if (!fileList) return; // TS now knows it's not null
  setFiles((prev) => [...prev, ...Array.from(fileList)]);
  e.target.value = ""; // reset input
};

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setLoading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        // Step 1: Upload document
        const uploadRes = await uploadDocument(formData).unwrap();
        const fileUrl = uploadRes.data.url;

        // Step 2: Save certificate reference
        await saveCertificate({ fileUrl }).unwrap();
      }
      setFiles([]);
      handleOpen(); // close dialog
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton
      className="preference-dialog"
    >
      <div className="flex flex-col gap-4 items-center text-center w-full">
        <div className="text-2xl font-semibold">My Certification</div>
        <div className="text-[var(--cool-gray)] text-sm">
          Upload your documents
        </div>

        <div className="w-full my-4 flex flex-col gap-3">
          <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2">
            <label className="text-[var(--primary-color)] cursor-pointer text-sm underline">
              Upload your document
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpeg,.jpg"
              />
            </label>
            <p className="text-xs text-gray-500 text-center">
              Only .doc, .docx, .pdf, .png, .jpeg (max 10MB)
            </p>
          </div>

          {files.map((file, index) => (
            <div
              key={file.name + index}
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                {pdfIcons}
                <div className="flex flex-col text-sm text-left">
                  <span className="font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB •{" "}
                    {file.type.split("/")[1]?.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-red-500 text-lg"
                onClick={() => removeFile(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex w-full gap-2 mt-2">
          <TransaparentButton onClick={handleOpen} title="Cancel" />
          <DialogConfirmButton
            onClick={handleSubmit}
            title={loading ? "Saving..." : "Save"}
          
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default CertificateDialog;
