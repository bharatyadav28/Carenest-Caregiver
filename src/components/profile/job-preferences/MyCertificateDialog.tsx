import React, { useState } from "react";
import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";
import {
  // useUploadCertificateMutation,
  useSaveCertificatesMutation,
  useGetCertificatesQuery,
} from "@/store/api/profileApi";
import { pdfIcons} from "@/lib/svg_icons";

interface Props {
  open: boolean;
  handleOpen: () => void;
}

function CertificateDialog({ open, handleOpen }: Props) {
  const { data: certificates = [] } = useGetCertificatesQuery();
  // const [uploadCertificate] = useUploadCertificateMutation();
  const [saveCertificates] = useSaveCertificatesMutation();

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const updatedDocs = [...certificates];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        // const res = await uploadCertificate(formData).unwrap();
        // const fileUrl = res.data.url;

        // Push every new certificate (not replace all with single)
        // updatedDocs.push({ type: "certificate", fileUrl });
      }

      await saveCertificates({ documents: updatedDocs }).unwrap();
      handleOpen();
      setFiles([]); // clear after save
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton={true}
      className="preference-dialog"
    >
      <div className="flex flex-col gap-4 items-center text-center w-full">
        <div className="text-2xl font-semibold">My Certification</div>
        <div className="text-[var(--cool-gray)] text-sm">
          Upload your documents
        </div>

        <div className="w-full my-4 flex flex-col gap-3">
          {/* Upload box always visible */}
          <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2">
            <label className="text-[var(--primary-color)] cursor-pointer text-sm underline">
              Upload your document
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500 text-center">
              Only .doc, pdf, png, jpeg (10mb max file size)
            </p>
          </div>

          {/* Preview selected files */}
          {files.map((file, index) => (
            <div
              key={index}
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
          <DialogConfirmButton onClick={handleSubmit} title="Save" />
        </div>
      </div>
    </CustomDialog>
  );
}

export default CertificateDialog;
