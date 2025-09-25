import React, { useEffect, useState } from "react";
import {toast} from "react-toastify";
import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";

import { useUpdateZipcodeMutation } from "@/store/api/profileApi";

interface Props {
  open: boolean;
  handleOpen: () => void;
  zipcodes: number[]; 
  setZipcodes: React.Dispatch<React.SetStateAction<number[]>>;
}

function ZipcodeDialog({ open, handleOpen, zipcodes, setZipcodes }: Props) {
  const [zipcode, setZipcode] = useState<string>("");

  const [updateZipcode, { isLoading }] = useUpdateZipcodeMutation();

  // 🔹 Save zipcode to backend
  const handleSave = async () => {
    const numericZip = Number(zipcode.trim());

    if (isNaN(numericZip) ) {
      toast.error("Please enter a valid zipcode ");
      return;
    }

    try {
      const res = await updateZipcode({ zipcode: numericZip }).unwrap();

      if (res.success) {
        setZipcodes([numericZip]); // sync with parent
        handleOpen();
      } else {
        alert(res.message || "Failed to update zipcode.");
      }
    } catch (err) {
      console.error("Update zipcode failed:", err);
      alert("Something went wrong while updating zipcode.");
    }
  };

  // 🔹 Sync parent zipcodes into local state (only take the first one)
  useEffect(() => {
    if (zipcodes && zipcodes.length > 0) {
      setZipcode(String(zipcodes[0]));
    } else {
      setZipcode("");
    }
  }, [zipcodes]);

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton={true}
      className="preference-dialog"
    >
      <div className="flex flex-col gap-1 items-center text-center">
        <div className="text-2xl font-semibold">Zip Code</div>
   

        {/* Input for zipcode */}
        <div className="mt-4 flex gap-2 w-full">
          <input
            type="text"
            className="input flex-1  rounded-4xl border border-gray-300 px-4 py-4"
            placeholder="Enter Zip Code"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
          />
          {/* {zipcode && (
            <button
              className="btn"
              onClick={() => setZipcode("")}
              title="Clear"
            >
              <CrossIcon />
            </button>
          )} */}
        </div>

        {/* Actions */}
        <div className="flex w-full gap-2 mt-6">
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

export default ZipcodeDialog;
