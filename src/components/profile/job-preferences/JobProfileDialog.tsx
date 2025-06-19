import React, { useEffect, useState } from "react";

import { CustomDialog } from "@/components/common/CustomDialog";
import {
  DialogConfirmButton,
  TransaparentButton,
} from "@/components/common/CustomButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import data from "@/lib/dummy_data/profile-ques.json";
import { jobProfileType } from "@/lib/interface-types";

interface Props {
  open: boolean;
  handleOpen: () => void;
  profile: jobProfileType[];
  setProfile: React.Dispatch<React.SetStateAction<jobProfileType[]>>;
}

function JobProfileDialog({ open, handleOpen, profile, setProfile }: Props) {
  const [selectedValues, setSelectedValued] = useState<jobProfileType[]>([]);

  const handleChange = (qid: string, oid: string, type: string) => {
    setSelectedValued((prev) => {
      const existing = prev.find((item) => item.qid === qid);

      if (type === "multiple") {
        return [];
      } else {
        if (existing) {
          return prev.map((item) =>
            item.qid === qid ? { ...item, oid } : item
          );
        } else {
          return [...prev, { qid, oid }];
        }
      }
    });
  };

  const handleSave = () => {
    setProfile([...selectedValues]);
    handleOpen();
  };

  useEffect(() => {
    if (profile.length > 0) {
      setSelectedValued(profile);
    }
  }, [profile]);

  const questions = data.profileQues;
  const radioQues = questions?.filter((ques) => ques.type === "radio");
  const multipleQues = questions?.filter((ques) => ques.type === "multiple");

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton={true}
      className="preference-dialog px-10 !py-6 h-full "
    >
      <div className="flex h-full overflow-y-auto  flex-col gap-1 items-center text-center ">
        <div className="flex flex-col gap-2">
          <div className="text-2xl  font-semibold ">
            Complete Your job Profile to Start Getting Jobs
          </div>
          <div className="text-[var(--cool-gray)] text-sm lg:px-7">
            Please fill out the information below. This helps us match you with
            the right opportunities
          </div>
        </div>

        <div className="flex-1 overflow-y-auto h-full w-full my-6 flex flex-col gap-5">
          {radioQues?.map((item) => {
            const result = selectedValues?.find(
              (value) => value.qid === item.id
            );
            const selectedOption =
              result && !Array.isArray(result.oid) ? result.oid : undefined;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-2 items-start text-lg font-medium"
              >
                <div>{item.ques} </div>
                <div>
                  <RadioGroup
                    className="gap-2"
                    onValueChange={(oid) => handleChange(item.id, oid, "radio")}
                    value={selectedOption}
                  >
                    {item.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label
                          htmlFor="option-one"
                          className=" text-[var(--cool-gray)] text-sm"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            );
          })}

          {multipleQues?.map((item) => {
            return (
              <div
                key={item.id}
                className="flex flex-col gap-2 items-start text-lg font-medium"
              >
                <div>{item.ques} </div>
                <div className="mb-4 flex flex-wrap gap-y-3 gap-x-2 items-start w-full ">
                  {item.options?.map((option) => (
                    <button
                      className="service-card flex gap-1 items-center btn"
                      key={option.text}
                      onClick={() => {}}
                    >
                      {option.text}
                      {/* <AddIcon size={17} /> */}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex mt-auto w-full gap-2 ">
          <TransaparentButton onClick={handleOpen} />
          <DialogConfirmButton onClick={handleSave} title="Save" />
        </div>
      </div>
    </CustomDialog>
  );
}

export default JobProfileDialog;
