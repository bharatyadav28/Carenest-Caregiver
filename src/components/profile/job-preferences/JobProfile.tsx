import React, { useState } from "react";

import { AddButton, EditButton } from "@/components/common/CustomButton";
import { jobProfileType } from "@/lib/interface-types";
import { SimpleLine } from "@/components/common/HorizontalLines";
import data from "@/lib/dummy_data/profile-ques.json";
import JobProfileDialog from "./JobProfileDialog";

function JobProfile() {
  const [profile, setProfile] = useState<jobProfileType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  const profileQues = data?.profileQues;

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">Job Profile</div>
          {profile ? (
            <EditButton onClick={handleOpenDialog} />
          ) : (
            <AddButton onClick={handleOpenDialog} />
          )}
        </div>

        <div className="text-[var(--slat-gray)]">
          Please complete the job peferences. This helps us match you with the
          right opportunities
        </div>

        <SimpleLine />

        <div className="grid lg:grid-cols-2 gap-y-6">
          {profileQues?.map((item) => {
            const result = profile?.find((data) => data.qid === item.id);
            let answer = null;
            if (result)
              item.options.forEach((option) => {
                if (option.id === result.oid) {
                  answer = option.text;
                }
              });
            return (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="text-sm font-medium">{item.ques}</div>
                <div className="text-sm text-[var(--slat-gray)]">
                  {answer || item.placeholder}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <JobProfileDialog
        open={openDialog}
        handleOpen={handleOpenDialog}
        profile={profile}
        setProfile={setProfile}
      />
    </>
  );
}

export default JobProfile;
