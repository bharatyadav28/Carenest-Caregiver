import React, { useState, useEffect } from "react";
import { AddButton, EditButton } from "@/components/common/CustomButton";
import { SimpleLine } from "@/components/common/HorizontalLines";
import ZipcodeDialog from "./ZipcodeDialog";
import { useGetZipcodeQuery } from "@/store/api/profileApi"; // <-- import hook

function Zipcode() {
  const [zipcodes, setZipcodes] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: zipcode } = useGetZipcodeQuery();

  const handleOpenDialog = () => setOpenDialog((prev) => !prev);

  // 🔹 Sync API zipcode into local state
  useEffect(() => {
    if (zipcode) {
      setZipcodes([zipcode]); // normalize into array
    }
  }, [zipcode]);

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">Zip Code</div>
          {zipcodes.length > 0 ? (
            <EditButton onClick={handleOpenDialog} />
          ) : (
            <AddButton onClick={handleOpenDialog} />
          )}
        </div>

        <div className="text-[var(--slat-gray)]">Provide the Zip Code</div>

        {/* {isLoading && <div>Loading zipcode...</div>}
        {error && <div className="text-red-500">Failed to load zipcode</div>} */}

        {zipcodes.length > 0 && (
          <>
            <SimpleLine />
            <div className="flex flex-wrap gap-4 mt-2">
              {zipcodes.map((zip) => (
                <div className="service-card" key={zip}>
                  {zip}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ZipcodeDialog
        open={openDialog}
        handleOpen={handleOpenDialog}
        zipcodes={zipcodes}
        setZipcodes={setZipcodes}
      />
    </>
  );
}

export default Zipcode;
