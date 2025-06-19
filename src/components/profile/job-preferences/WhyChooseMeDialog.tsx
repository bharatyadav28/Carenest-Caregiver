import React, { useEffect, useState } from "react";

import { CustomDialog } from "@/components/common/CustomDialog";

import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";
import { Input } from "@/components/ui/input";
import { reasonType } from "@/lib/interface-types";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  handleOpen: () => void;
  reason?: reasonType;
}

function WhyChooseMeDialog({ open, handleOpen, reason }: Props) {
  const [newReason, setNewReason] = useState<reasonType>({
    title: "",
    description: "",
    id: -1,
  });

  console.log("Reason: ", newReason);

  useEffect(() => {
    if (reason) {
      setNewReason({
        id: reason.id,
        title: reason.title,
        description: reason.description,
      });
    }
  }, [reason]);

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton={true}
      className="preference-dialog"
    >
      <div className="flex flex-col gap-1 items-center text-center ">
        <div className="text-2xl font-semibold">Why choose me?</div>
        <div className="text-[var(--cool-gray)] text-sm">
          Please add why care seekers should choose you.
        </div>

        <div className="w-full my-6 flex flex-col gap-6">
          <Input
            className="rounded-full focus-visible:ring-[0px]"
            placeholder="Enter Title"
          />

          <Textarea
            className="h-[5rem] w-full !rounded-2xl focus-visible:ring-[0px] "
            placeholder="Enter brief description "
          />
        </div>

        <div className="flex w-full gap-2 ">
          <TransaparentButton onClick={handleOpen} />
          <DialogConfirmButton onClick={handleOpen} />
        </div>
      </div>
    </CustomDialog>
  );
}

export default WhyChooseMeDialog;
