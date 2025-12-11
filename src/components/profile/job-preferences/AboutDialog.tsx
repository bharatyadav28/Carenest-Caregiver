import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CustomDialog } from "@/components/common/CustomDialog";
import { CustomTextArea } from "@/components/common/CustomInputs";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";

interface Props {
  open: boolean;
  handleOpen: () => void;
  about: string;
  setAbout: React.Dispatch<React.SetStateAction<string>>;
  onSave: (content: string) => void;
  isLoading?: boolean;
}

function AboutDialog({ open, handleOpen, about, onSave, isLoading }: Props) {
  const [localAbout, setLocalAbout] = useState(about);

  // Reset local state when dialog opens with current about value
  useEffect(() => {
    if (open) {
      setLocalAbout(about);
    }
  }, [open, about]);

  const handleCancel = () => {
    // Reset to original value when canceling
    setLocalAbout(about);
    handleOpen();
  };

  const handleSave = () => {
    if (!localAbout.trim()) {
      toast.error("Please fill the required details!");
      return;
    }
    onSave(localAbout);
  };

  return (
    <CustomDialog
      open={open}
      handleOpen={handleCancel} // Use handleCancel instead of handleOpen
      showCrossButton={true}
      className="preference-dialog"
    >
      <div className="flex flex-col gap-1 items-center text-center">
        <div className="text-2xl font-semibold">About</div>
        <div className="text-[var(--cool-gray)] text-md">
          Add a brief summary about yourself so care seekers can learn more
          about you.
        </div>

        <div className="w-full my-6">
          <CustomTextArea
            text={localAbout}
            setText={setLocalAbout}
            className="h-[10rem] w-full !rounded-2xl"
            placeholder="Add a brief summary"
          />
        </div>

        <div className="flex w-full gap-2">
          <TransaparentButton onClick={handleCancel} className="text-lg" />
          <DialogConfirmButton
          className="text-lg"
            onClick={handleSave}
            title={isLoading ? "Saving..." : "Save"}
            // disabled={isLoading}
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default AboutDialog;