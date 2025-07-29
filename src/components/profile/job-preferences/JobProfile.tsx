import React, { useEffect, useState } from "react";
import { AddButton, EditButton } from "@/components/common/CustomButton";
import { jobProfileType } from "@/lib/interface-types";
import { SimpleLine } from "@/components/common/HorizontalLines";
import data from "@/lib/dummy_data/profile-ques.json";
import JobProfileDialog from "./JobProfileDialog";

// ✅ RTK Query
import {
  useGetJobProfileQuery,
 
} from "@/store/api/profileApi";

function JobProfile() {
  const [profile, setProfile] = useState<jobProfileType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: jobProfile,
   
    isSuccess,
  } = useGetJobProfileQuery();

  // const [updateJobProfile] = useUpdateJobProfileMutation();

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  useEffect(() => {
    if (isSuccess && jobProfile) {
      const profileData = jobProfile;
      
      // Format the price range
      const priceRange = profileData.minPrice && profileData.maxPrice 
        ? `$${profileData.minPrice} - $${profileData.maxPrice}`
        : "";
      
      // Format the experience range
      const experienceRange = profileData.experienceMin && profileData.experienceMax
        ? `${profileData.experienceMin}-${profileData.experienceMax} years`
        : "";
      
      // Format PRN
      const prnRange = profileData.isPrn && profileData.prnMin && profileData.prnMax
        ? `$${profileData.prnMin} - $${profileData.prnMax}`
        : "As Needed";

      const mappedProfile: jobProfileType[] = [
        {
          qid: "q1", // What type of caregiving are you up for?
          oid: profileData.caregivingType ?? "",
        },
        {
          qid: "q2", // Price Range
          oid: priceRange,
        },
        {
          qid: "q3", // Preferred Location Range
          oid: profileData.locationRange ?? "",
        },
        {
          qid: "q4", // PRN
          oid: prnRange,
        },
        {
          qid: "q7", // Years of Experience
          oid: experienceRange,
        },
        {
          qid: "q5", // Are You Certified?
          oid: profileData.certified ? "Yes" : "No",
        },
        {
          qid: "q6", // Languages Spoken
          oid: Array.isArray(profileData.languages)
            ? profileData.languages.join(", ")
            : "",
        },
      ];
      setProfile(mappedProfile);
    }
  }, [isSuccess, jobProfile]);

  const profileQues = data?.profileQues;

  return (
    <>
      <div className="card flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="heading2">Job Profile</div>
          {profile?.length ? (
            <EditButton onClick={handleOpenDialog} />
          ) : (
            <AddButton onClick={handleOpenDialog} />
          )}
        </div>

        <div className="text-[var(--slat-gray)]">
          Please complete the job preferences. This helps us match you with the
          right opportunities.
        </div>

        <SimpleLine />

        <div className="grid lg:grid-cols-2 gap-y-6">
          {profileQues?.map((item) => {
            const result = profile?.find((data) => data.qid === item.id);
            let answer = result?.oid;

            // If options are provided, get the matching display text
            if (result && item.options?.length > 0) {
              const match = item.options.find((opt) => opt.text === result.oid);
              if (match) answer = match.text;
            }

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

      {/* ✅ Edit/Add Dialog */}
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