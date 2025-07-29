import React, { useEffect, useState } from "react";
import { AddButton, EditButton } from "@/components/common/CustomButton";
import AboutDialog from "./AboutDialog";
import { useGetAboutQuery, useUpdateAboutMutation } from "@/store/api/profileApi";

function About() {
  const [openDialog, setOpenDialog] = useState(false);
  const [about, setAbout] = useState("");

  const { data, isLoading } = useGetAboutQuery();
  const [updateAbout] = useUpdateAboutMutation();

  // Update local state when data is fetched
  useEffect(() => {
    if (data?.about) {
      setAbout(data.about.trim());
    }
  }, [data]);

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      await updateAbout({ content: about }).unwrap();
      handleOpenDialog(); // Close dialog on success
    } catch (err) {
      console.error("Failed to update About:", err);
    }
  };

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">About</div>
          {about ? (
            <EditButton onClick={handleOpenDialog} />
          ) : (
            <AddButton onClick={handleOpenDialog} />
          )}
        </div>

        <div className="text-[var(--slat-gray)] min-h-[4rem]">
          {isLoading
            ? "Loading..."
            : about ||
              "Add a brief summary about yourself so care seekers can learn more about you."}
        </div>
      </div>

      <AboutDialog
        open={openDialog}
        handleOpen={handleOpenDialog}
        about={about}
        setAbout={setAbout}
        onSave={handleSave}
        // isLoading={isUpdating}
      />
    </>
  );
}

export default About;
