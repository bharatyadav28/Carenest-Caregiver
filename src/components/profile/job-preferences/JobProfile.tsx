import React, { useState } from "react";

import { AddButton, EditButton } from "@/components/common/CustomButton";
import { jobProfileType } from "@/lib/interface-types";
import { SimpleLine } from "@/components/common/HorizontalLines";
import data from "@/lib/dummy_data/profile-ques.json";

function JobProfile() {
  const [profile, setProfile] = useState<jobProfileType[] | null>(null);

  const handleClick = () => {
    setProfile(null);
  };

  const profileQues = data?.profileQues;

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="heading2">Job Profile</div>
        {profile ? (
          <EditButton onClick={handleClick} />
        ) : (
          <AddButton onClick={handleClick} />
        )}
      </div>

      <div className="text-[var(--slat-gray)]">
        Please complete the job peferences. This helps us match you with the
        right opportunities
      </div>

      <SimpleLine />

      <div className="grid grid-cols-2 gap-y-6">
        {profileQues?.map((item) => {
          return (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="text-sm font-medium">{item.ques}</div>
              <div className="text-sm text-[var(--slat-gray)]">
                {item.placeholder}{" "}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JobProfile;
