// WorkPermitDialog.tsx
import React, { useState } from "react";
import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";
import { pdfIcons } from "@/lib/svg_icons";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

// Define a specific type for Work Permit
interface WorkPermitDocument {
  id: string;
  userId: string;
  type: 'work_permit';
  fileUrl: string;
  createdAt: string;
}

interface WorkPermitDialogProps {
  open: boolean;
  handleOpen: () => void;
  onFileUpload: (file: File) => Promise<void>;
  existingDocument?: any; // Accept any type
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const WorkPermitDialog: React.FC<WorkPermitDialogProps> = ({
  open,
  handleOpen,
  onFileUpload,
  existingDocument,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const selectedFile = fileList[0];

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error(`Invalid file type. Please upload a valid document.`);
      return;
    }
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(`File exceeds 10MB limit`);
      return;
    }

    setFile(selectedFile);
    e.target.value = ""; // reset input
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.warning("Please upload a document before saving.");
      return;
    }

    setLoading(true);

    try {
      await onFileUpload(file);
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      // Error toast is handled in parent component
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
        <div className="text-2xl font-semibold">Driving License</div>

        <div className="w-full my-4 flex flex-col gap-3">
          <span className="text-lg justify-start flex w-full">
            Upload your driving license <span className="text-red-600">*</span>
          </span>
          
          {existingDocument?.fileUrl && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                You already have a driving license uploaded. Uploading a new file will replace the existing one.
              </p>
            </div>
          )}
          
          <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2">
            <label className="text-[#F2A307] cursor-pointer text-lg underline">
              {file ? "Change Document" : "Upload your document"}
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpeg,.jpg"
              />
            </label>
            <p className="text-lg text-gray-500 text-center">
              Only .doc, .docx, .pdf, .png, .jpeg (max 10MB)
            </p>
          </div>

          {file && (
            <div className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg shadow-sm">
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
                onClick={handleRemoveFile}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex w-full gap-2 mt-2">
          <TransaparentButton onClick={handleOpen} title="Cancel" className="text-lg" />
          <DialogConfirmButton
            onClick={handleSubmit}
            className="text-lg"
            title={loading ? "Uploading..." : existingDocument?.fileUrl ? "Update" : "Upload"}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default WorkPermitDialog;