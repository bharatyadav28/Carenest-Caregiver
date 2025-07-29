import React from "react";
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
  onSave: () => void;
  isLoading?: boolean;
}

function AboutDialog({ open, handleOpen, about, setAbout, onSave, isLoading }: Props) {
  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton={true}
      className="preference-dialog"
    >
      <div className="flex flex-col gap-1 items-center text-center ">
        <div className="text-2xl font-semibold">About</div>
        <div className="text-[var(--cool-gray)] text-sm">
          Add a brief summary about yourself so care seekers can learn more
          about you.
        </div>

        <div className="w-full my-6">
          <CustomTextArea
            text={about}
            setText={setAbout}
            className="h-[5rem] w-full !rounded-2xl"
            placeholder="Add a brief summary"
          />
        </div>

        <div className="flex w-full gap-2">
          <TransaparentButton onClick={handleOpen} />
          <DialogConfirmButton
            onClick={onSave}
            title={isLoading ? "Saving..." : "Save"}
            // disabled={isLoading}
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default AboutDialog;
