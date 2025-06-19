import React, { useState } from "react";

import { AddButton, EditButton } from "@/components/common/CustomButton";
import AboutDialog from "./AboutDialog";

function About() {
  const [openDialog, setOpenDialog] = useState(false);
  const [about, setAbout] = useState("");

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
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

        <div className="text-[var(--slat-gray)]">
          {about ||
            "Add a brief summary about yourself so care seekers can learn more about you."}
        </div>
      </div>

      <AboutDialog
        open={openDialog}
        handleOpen={handleOpenDialog}
        about={about}
        setAbout={setAbout}
      />
    </>
  );
}

export default About;
