import React, { useState } from "react";
import { MdOutlineEdit as EditIcon } from "react-icons/md";

import { AddButton, EditButton } from "@/components/common/CustomButton";
import { SimpleLine } from "@/components/common/HorizontalLines";
import { BinIcon } from "@/lib/svg_icons";

function WhyChooseMe() {
  const [services, setServices] = useState("");

  const handleClick = () => {
    setServices("");
  };

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="heading2">Why Choose Me?</div>
        {services ? (
          <EditButton onClick={handleClick} />
        ) : (
          <AddButton onClick={handleClick} />
        )}
      </div>

      <div className="text-[var(--slat-gray)]">
        {services || "Add why care seekers should choose you."}
      </div>

      <SimpleLine />

      <div className="flex flex-col gap-6 mt-2">
        <div className="flex justify-between">
          <div className="text-sm flex flex-col gap-1">
            <div className="font-medium">Certified and background-checked</div>
            <div className="text-[var(--slat-gray)] ">
              Certified and background-checked. Flexible scheduling and
              availability. Personalized and compassionate care.
            </div>
          </div>

          <div className="flex gap-4 ">
            <button className="hover:cursor-pointer hover:opacity-90 transition">
              <EditIcon />
            </button>
            <button className="hover:cursor-pointer hover:opacity-90 transition">
              {BinIcon}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyChooseMe;
