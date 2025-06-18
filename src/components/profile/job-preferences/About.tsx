import React, { useState } from "react";

import { AddButton, EditButton } from "@/components/common/CustomButton";

function About() {
  const [about, setAbout] = useState("");

  const handleClick = () => {
    setAbout("");
  };

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="heading2">About</div>
        {about ? (
          <EditButton onClick={handleClick} />
        ) : (
          <AddButton onClick={handleClick} />
        )}
      </div>

      <div className="text-[var(--slat-gray)]">
        {about ||
          "Add a brief summary about yourself so care seekers can learn more about you."}
      </div>
    </div>
  );
}

export default About;
