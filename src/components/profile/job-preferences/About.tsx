import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddButton, EditButton } from "@/components/common/CustomButton";
import AboutDialog from "./AboutDialog";
import { useGetAboutQuery, useUpdateAboutMutation } from "@/store/api/profileApi";

function About() {
  const [openDialog, setOpenDialog] = useState(false);
  const [about, setAbout] = useState("");

  const { data, isLoading } = useGetAboutQuery();
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();

  // Update local state when data is fetched
  useEffect(() => {
    if (data?.about) {
      setAbout(data.about.trim());
    }
  }, [data]);

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
    // Show edit toast when opening dialog with existing content

  };

  const handleSave = async (content: string) => {
    try {
      await updateAbout({ content }).unwrap();
      setAbout(content); // Update local state with saved content
      toast.success("About section updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      handleOpenDialog(); // Close dialog on success
    } catch (err) {
      console.error("Failed to update About:", err);
      toast.error("Failed to update about section. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

        <div className="text-[var(--slat-gray)] min-h-[4rem] w-[90%]">
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
        isLoading={isUpdating}
      />
    </>
  );
}

export default About;