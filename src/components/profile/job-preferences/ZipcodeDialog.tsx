import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

  // Handle input change with 5-digit restriction
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    // Limit to 5 digits
    if (value.length > 5) {
      return;
    }
    
    setZipcode(value);
  };

  // 🔹 Save zipcode to backend
  const handleSave = async () => {
    const trimmedZip = zipcode.trim();
    const numericZip = Number(trimmedZip);

    // Validation
    if (!trimmedZip) {
      toast.error("Please enter a zipcode");
      return;
    }

    if (isNaN(numericZip)) {
      toast.error("Please enter a valid zipcode");
      return;
    }

    if (trimmedZip.length !== 5) {
      toast.error("Zipcode must be exactly 5 digits");
      return;
    }

    try {
      const res = await updateZipcode({ zipcode: numericZip }).unwrap();

      if (res.success) {
        setZipcodes([numericZip]); // sync with parent
        
        // Show success toast
        toast.success("Zipcode updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        handleOpen();
      } else {
        toast.error(res.message || "Failed to update zipcode.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err: any) {
      console.error("Update zipcode failed:", err);
      
      // Show error toast
      toast.error(
        err?.data?.message || 
        "Something went wrong while updating zipcode. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
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
        
        <div className="text-[var(--cool-gray)] text-sm mb-4">
          Enter your 5-digit zipcode
        </div>

        {/* Input for zipcode */}
        <div className="mt-4 flex gap-2 w-full">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            className="input flex-1 rounded-4xl border border-gray-300 px-4 py-4 text-center"
            placeholder="Enter 5-digit zipcode"
            value={zipcode}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              // Allow only numbers and control keys
              if (!/^\d$/.test(e.key) && 
                  !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>

   

        {/* Actions */}
        <div className="flex w-full gap-2 mt-6">
          <TransaparentButton 
            onClick={handleOpen}  
            className="text-lg"
          />
          <DialogConfirmButton
            className="text-lg"
            onClick={handleSave}
            title={isLoading ? "Saving..." : "Save"}
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default ZipcodeDialog;