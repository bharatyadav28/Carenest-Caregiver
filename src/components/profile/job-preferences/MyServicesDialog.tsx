import React, { useEffect, useState } from "react";
import { RxCross2 as CrossIcon } from "react-icons/rx";
import { IoIosAdd as AddIcon } from "react-icons/io";

import { CustomDialog } from "@/components/common/CustomDialog";
import { CustomTextArea } from "@/components/common/CustomInputs";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";

interface Props {
  open: boolean;
  handleOpen: () => void;
  services: string[];
  setServices: React.Dispatch<React.SetStateAction<string[]>>;
}

function MyServicesDialog({ open, handleOpen, services, setServices }: Props) {
  const servicesSuggestions = [
    "Personal Care",
    "Home Care",
    "Memory Care",
    "Private Pay Skilled Nursing",
  ];

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");

  const notSelectedServices = servicesSuggestions?.filter(
    (service) => !selectedServices?.includes(service)
  );

  const handleSelect = (service: string) => {
    setSelectedServices((prev) => [...prev, service]);
  };
  const handleRemove = (service: string) => {
    setSelectedServices((prev) => prev.filter((item) => item !== service));
  };

  const handleSave = () => {
    const serviceData = newService
      ? [...selectedServices, newService]
      : [...selectedServices];
    setServices(serviceData);
    setNewService("");
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
      <div className="flex flex-col gap-1 items-center text-center ">
        <div className="text-2xl font-semibold">My Services</div>
        <div className="text-[var(--cool-gray)] text-sm">
          Please add type of care giving services you’re interested.
        </div>

        {selectedServices?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-y-3 gap-x-2 items-start w-full ">
            {selectedServices?.map((service) => (
              <div
                className="service-card flex gap-1 items-center"
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

        <div className="w-full my-6">
          <CustomTextArea
            text={newService}
            setText={setNewService}
            className="h-[5rem] w-full !rounded-2xl "
            placeholder="Add Services "
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-y-3 gap-x-2 items-start w-full ">
          {notSelectedServices?.map((service) => (
            <div className="service-card flex gap-1 items-center" key={service}>
              {service}
              <button className="btn" onClick={() => handleSelect(service)}>
                <AddIcon size={17} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex w-full gap-2 ">
          <TransaparentButton onClick={handleOpen} />
          <DialogConfirmButton onClick={handleSave} title="Save" />
        </div>
      </div>
    </CustomDialog>
  );
}

export default MyServicesDialog;
