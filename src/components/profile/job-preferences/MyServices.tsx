import React, { useState } from "react";

import { AddButton, EditButton } from "@/components/common/CustomButton";
import { SimpleLine } from "@/components/common/HorizontalLines";

function MyServices() {
  const [services, setServices] = useState("");

  const handleClick = () => {
    setServices("");
  };

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="heading2">My Services</div>
        {services ? (
          <EditButton onClick={handleClick} />
        ) : (
          <AddButton onClick={handleClick} />
        )}
      </div>

      <div className="text-[var(--slat-gray)]">
        {services ||
          "Please add type of care giving services you’re interested"}
      </div>

      <SimpleLine />

      <div className="flex flex-wrap mt-2">
        <div className="text-[var(--slat-gray)] px-3 py-2 border border-[#98A2B34D] rounded-full text-sm">
          Personal Care
        </div>
      </div>
    </div>
  );
}

export default MyServices;
