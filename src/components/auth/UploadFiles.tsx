import React from "react";

interface Props {
  label: string;
  uploadTitle: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadFiles({ label, uploadTitle, handleUpload, inputRef }: Props) {
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        accept=".doc,.pdf,.png,.jpeg"
        onChange={handleUpload}
        className="hidden"
      />

      <div className="flex flex-col gap-1">
        <div className=" flex gap-1">
          <div>{label} </div>
          <div className="text-[#D80027]">*</div>
        </div>

        <div className="border border-dashed border-[#98A2B3] flex flex-col items-center p-6 w-full rounded-xl bg-[#fff] text-[var(--cool-gray)] text-sm">
          <div>
            <button
              className="text-primary underline hover:cursor-pointer"
              onClick={handleClick}
            >
              {uploadTitle}
            </button>{" "}
            or drag and drop it here
          </div>
          <div>Only .doc, pdf, png, jpeg, </div>
          <div>(10mb max file size)</div>
        </div>
      </div>
    </>
  );
}

export default UploadFiles;
