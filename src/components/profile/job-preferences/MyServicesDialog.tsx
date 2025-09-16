import React, { useEffect, useState } from "react";
import { RxCross2 as CrossIcon } from "react-icons/rx";
import { IoIosAdd as AddIcon } from "react-icons/io";

import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";

import { useUpdateMyServicesMutation } from "@/store/api/profileApi";

interface Props {
  open: boolean;
  handleOpen: () => void;
  services: string[]; // array of service names
  setServices: React.Dispatch<React.SetStateAction<string[]>>;
  allServices: { id: string; name: string }[];
}

function MyServicesDialog({
  open,
  handleOpen,
  services,
  setServices,
  allServices,
}: Props) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");

  const [updateMyServices, { isLoading }] = useUpdateMyServicesMutation();

  const notSelectedServices = allServices?.filter(
    (service) => !selectedServices.includes(service.name)
  );

  const handleSelect = (serviceName: string) => {
    setSelectedServices((prev) => [...prev, serviceName]);
  };

  const handleRemove = (serviceName: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== serviceName));
  };

  const handleSave = async () => {
    const serviceData = newService
      ? [...selectedServices, newService]
      : [...selectedServices];

    setServices(serviceData);
    setNewService("");

    // 🔁 Convert selected names to IDs
    const selectedIds = allServices
      .filter((s) => serviceData.includes(s.name))
      .map((s) => s.id);

    // ⬆️ Save to backend
    await updateMyServices({ serviceIds: selectedIds });

    handleOpen();
  };

  useEffect(() => {
    setSelectedServices(services || []);
  }, [services]);

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton={true}
      className="preference-dialog"
    >
      <div className="flex flex-col gap-1 items-center text-center">
        <div className="text-2xl font-semibold">My Services</div>
        <div className="text-[var(--cool-gray)] text-sm">
          Please add type of care giving services you’re interested.
        </div>

        {selectedServices?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-y-3 gap-x-2 items-start w-full">
            {selectedServices.map((service) => (
              <div
                className="service-card flex gap-1 items-center !text-white  bg-[#233D4D]"
                key={service}
              >
                {service}
                <button className="btn" onClick={() => handleRemove(service)}>
                  <CrossIcon />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-y-3 gap-x-2 items-start w-full">
          {notSelectedServices?.map((service) => (
            <div
              className="service-card flex gap-1 items-center"
              key={service.id}
            >
              {service.name}
              <button className="btn" onClick={() => handleSelect(service.name)}>
                <AddIcon size={17} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex w-full gap-2">
          <TransaparentButton onClick={handleOpen} />
          <DialogConfirmButton
            onClick={handleSave}
            title={isLoading ? "Saving..." : "Save"}
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default MyServicesDialog;
