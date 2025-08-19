import React, { useState } from "react";
import { MdOutlineEdit as EditIcon } from "react-icons/md";
import { useGetWhyChooseMeQuery, useDeleteWhyChooseMeMutation } from "@/store/api/profileApi"; // Update the import path
import { AddButton } from "@/components/common/CustomButton";
// import { SimpleLine } from "@/components/common/HorizontalLines";
import { BinIcon, binIconTheme } from "@/lib/svg_icons";
import WhyChooseMeDialog from "./WhyChooseMeDialog";
import ActionDialog from "@/components/common/ActionDialog";
interface WhyChooseMeEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
function WhyChooseMe() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WhyChooseMeEntry | null>(null);
  
  // Fetch data from API
  const { data: whyChooseMeEntries = [] } = useGetWhyChooseMeQuery();
  const [deleteEntry] = useDeleteWhyChooseMeMutation();

  const handleOpenDialog = (entry: WhyChooseMeEntry | null = null) => {
    setSelectedEntry(entry);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (entry: WhyChooseMeEntry) => {
    setSelectedEntry(entry);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (selectedEntry?.id) {
      try {
        await deleteEntry(selectedEntry.id).unwrap();
        setOpenDeleteDialog(false);
      } catch (error) {
        console.error("Failed to delete entry:", error);
      }
    }
  };

  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error loading data</div>;

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">Why Choose Me?</div>
          <AddButton onClick={() => handleOpenDialog(null)} />
        </div>

        <div className="text-[var(--slat-gray)]">
          Add why care seekers should choose you.
        </div>

        {/* <SimpleLine /> */}

        <div className="flex flex-col gap-6 mt-2">
          {whyChooseMeEntries.length === 0 ? (
            <div className="text-[var(--slat-gray)]">
             
            </div>
          ) : (
            whyChooseMeEntries.map((entry) => (
              <div key={entry.id} className="flex justify-between">
                <div className="text-sm flex flex-col gap-1">
                  <div className="font-medium">{entry.title}</div>
                  <div className="text-[var(--slat-gray)]">
                    {entry.description}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    className="hover:cursor-pointer hover:opacity-90 transition"
                    onClick={() => handleOpenDialog(entry)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="hover:cursor-pointer hover:opacity-90 transition"
                    onClick={() => handleOpenDeleteDialog(entry)}
                  >
                    {BinIcon}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    
      

      <WhyChooseMeDialog 
        open={openDialog} 
        handleOpen={() => setOpenDialog(false)} 
        entry={selectedEntry}
      />

      <ActionDialog
        icon={binIconTheme}
        open={openDeleteDialog}
        handleOpen={() => setOpenDeleteDialog(false)}
        handleConfirm={handleDelete}
        heading="Deletion"
        subheading="Are you sure you want to delete this content?"
        confirmText="Delete"
      />
    </>
  );
}

export default WhyChooseMe;