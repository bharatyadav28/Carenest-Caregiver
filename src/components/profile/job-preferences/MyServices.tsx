import React, { useState } from "react";

import { AddButton, EditButton } from "@/components/common/CustomButton";
import { SimpleLine } from "@/components/common/HorizontalLines";
import MyServicesDialog from "./MyServicesDialog";

function MyServices() {
  const [services, setServices] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">My Services</div>
          {services.length > 0 ? (
            <EditButton onClick={handleOpenDialog} />
          ) : (
            <AddButton onClick={handleOpenDialog} />
          )}
        </div>

        <div className="text-[var(--slat-gray)]">
          Please add type of care giving services you’re interested
        </div>

        {services.length > 0 && (
          <>
            <SimpleLine />
            <div className="flex flex-wrap gap-4 mt-2">
              {services?.map((service) => (
                <div className="service-card" key={service}>
                  {service}
                </div>
              ))}
            </div>{" "}
          </>
        )}
      </div>

      <MyServicesDialog
        open={openDialog}
        handleOpen={handleOpenDialog}
        services={services}
        setServices={setServices}
      />
    </>
  );
}

export default MyServices;
