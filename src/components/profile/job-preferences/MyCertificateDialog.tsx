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
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

interface CertificateDialogProps {
  open: boolean;
  handleOpen: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

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
    if (!fileList) return;

    const newFiles = Array.from(fileList);

    const validFiles: File[] = [];
    newFiles.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(` ${file.name} exceeds 10MB limit`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }

    e.target.value = ""; // reset input
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.warning("Please upload at least one document before saving.");
      return;
    }

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

      toast.success(" Certificate uploaded successfully!");
      setFiles([]);
      handleOpen(); // close dialog
    } catch (err) {
      console.error(" Upload failed:", err);
      toast.error("Failed to upload certificate(s). Please try again.");
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

        <div className="w-full my-4 flex flex-col gap-3">
          <span className="text-lg justify-start flex w-full">
            Upload your documents <span className="text-red-600">*</span>
          </span>
          <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2">
            <label className="text-[#F2A307] cursor-pointer text-lg underline">
              Upload your document
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpeg,.jpg"
              />
            </label>
            <p className="text-lg text-gray-500 text-center">
              Only .doc, .docx, .pdf, .png, .jpeg (max 10MB)
            </p>
          </div>

          {/* Scrollable file list container */}
          <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {files.map((file, index) => (
              <div
                key={file.name + index}
                className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg shadow-sm mb-2 last:mb-0"
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
        </div>

        <div className="flex w-full gap-2 mt-2">
          <TransaparentButton onClick={handleOpen} title="Cancel" className="text-lg" />
          <DialogConfirmButton
            onClick={handleSubmit}
            className="text-lg"
            title={loading ? "Saving..." : "Save"}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default CertificateDialog;