import React, { useEffect, useState } from "react";
import {
  useCreateWhyChooseMeMutation,
  useUpdateWhyChooseMeMutation,
} from "@/store/api/profileApi"; // Update the import path
import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
interface WhyChooseMeEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
interface Props {
  open: boolean;
  handleOpen: () => void;
  entry?: WhyChooseMeEntry | null;
}

function WhyChooseMeDialog({ open, handleOpen, entry }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createEntry] = useCreateWhyChooseMeMutation();
  const [updateEntry] = useUpdateWhyChooseMeMutation();

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setDescription(entry.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [entry]);

  const handleSubmit = async () => {
    try {
      if (entry) {
        // Update existing entry
        await updateEntry({
          id: entry.id,
          title,
          description,
        }).unwrap();
      } else {
        // Create new entry
        await createEntry({
          title,
          description,
        }).unwrap();
      }
      handleOpen();
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  return (
    
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton={true}
      className="preference-dialog"
    >
      <div className="flex flex-col gap-1 items-center text-center">
        <div className="text-2xl font-semibold">
          {entry ? "Edit Entry" : "Add New Entry"}
        </div>
        <div className="text-[var(--cool-gray)] text-sm">
          Please add why care seekers should choose you.
        </div>

        <div className="w-full my-6 flex flex-col gap-6">
          <Input
            className="rounded-full focus-visible:ring-[0px]"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            className="h-[5rem] w-full !rounded-2xl focus-visible:ring-[0px]"
            placeholder="Enter brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex w-full gap-2">
          <TransaparentButton onClick={handleOpen} />
          <DialogConfirmButton onClick={handleSubmit} title="Save" />
        </div>
      </div>
    </CustomDialog>
  );
}

export default WhyChooseMeDialog;