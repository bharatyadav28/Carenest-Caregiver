import React, { useEffect, useState } from "react";
import { AddButton, EditButton } from "@/components/common/CustomButton";
import { SimpleLine } from "@/components/common/HorizontalLines";
import MyServicesDialog from "./MyServicesDialog";
import {
  useGetAllServiceNamesQuery,
  useGetMyServicesQuery,
} from "@/store/api/profileApi";

function MyServices() {
  const [services, setServices] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch all available services
  const { data: allServices = [] } = useGetAllServiceNamesQuery();

  // Fetch user's selected service IDs
  const { data: myServiceIds = [] } = useGetMyServicesQuery();

  useEffect(() => {
    if (allServices.length && myServiceIds.length) {
      const matchedNames = allServices
        .filter((svc) => myServiceIds.includes(svc.id))
        .map((svc) => svc.name);
      setServices(matchedNames);
    }
  }, [allServices, myServiceIds]);

  const handleOpenDialog = () => setOpenDialog((prev) => !prev);

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
              {services.map((service) => (
                <div className="service-card" key={service}>
                  {service}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <MyServicesDialog
        open={openDialog}
        handleOpen={handleOpenDialog}
        services={services}
        setServices={setServices}
        allServices={allServices}
      />
    </>
  );
}

export default MyServices;
