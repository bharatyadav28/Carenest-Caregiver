import React, { useEffect, useState } from "react";
import { RxCross2 as CrossIcon } from "react-icons/rx";
import { IoIosAdd as AddIcon } from "react-icons/io";
import { toast } from "react-toastify"; // Import toast

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
    try {
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
      await updateMyServices({ serviceIds: selectedIds }).unwrap();
      
      // Show success toast message
      toast.success("Services updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      handleOpen();
    } catch (err) {
      console.error("Failed to update services:", err);
      
      // Show error toast message
      toast.error("Failed to update services. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
          Please add type of care giving services you are interested.
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
          <TransaparentButton onClick={handleOpen} className="text-lg" />
          <DialogConfirmButton
            onClick={handleSave}
            className="text-lg"
            title={isLoading ? "Saving..." : "Save"}
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default MyServicesDialog;