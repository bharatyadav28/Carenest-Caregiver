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
import { useUpdateJobProfileMutation } from "@/store/api/profileApi";
import { Check } from "lucide-react";
interface Props {
  open: boolean;
  handleOpen: () => void;
  profile: jobProfileType[];
  setProfile: React.Dispatch<React.SetStateAction<jobProfileType[]>>;
}

function JobProfileDialog({ open, handleOpen, profile, setProfile }: Props) {
  const [selectedValues, setSelectedValues] = useState<jobProfileType[]>([]);
  const [updateJobProfile, { isLoading }] = useUpdateJobProfileMutation();

  // Initialize form with current profile data
  useEffect(() => {
    if (profile.length > 0) {
      const mappedValues = profile.map(item => {
        // For languages (q6), convert text back to option IDs
        if (item.qid === "q6") {
          const question = data.profileQues.find(q => q.id === "q6");
          if (question) {
            const currentLanguages = typeof item.oid === 'string' 
              ? item.oid.split(', ').map(lang => lang.trim())
              : item.oid || [];
            
            const languageIds = currentLanguages.map(lang => {
              const option = question.options.find(opt => opt.text === lang);
              return option ? option.id : '';
            }).filter(id => id !== '');
            
            return { ...item, oid: languageIds };
          }
        }
        // For radio options, find matching option ID
        else {
          const question = data.profileQues.find(q => q.id === item.qid);
          if (question) {
            const option = question.options.find(opt => opt.text === item.oid);
            if (option) {
              return { ...item, oid: option.id };
            }
          }
        }
        return item;
      });
      setSelectedValues(mappedValues);
    } else {
      setSelectedValues([]);
    }
  }, [profile, open]);

  const handleChange = (qid: string, oid: string, type: string) => {
    setSelectedValues((prev) => {
      const existing = prev.find((item) => item.qid === qid);

      if (type === "multiple") {
        if (existing) {
          let newOids = Array.isArray(existing.oid) ? [...existing.oid] : [];
          if (newOids.includes(oid)) {
            newOids = newOids.filter((id) => id !== oid);
          } else {
            newOids.push(oid);
          }
          return prev.map((item) =>
            item.qid === qid ? { ...item, oid: newOids } : item
          );
        } else {
          return [...prev, { qid, oid: [oid] }];
        }
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

  const convertToApiPayload = () => {
    const getOptionText = (qid: string, oid: string) => {
      const question = data.profileQues.find((q) => q.id === qid);
      const option = question?.options.find((o) => o.id === oid);
      return option?.text || "";
    };

    const caregivingType = (() => {
      const item = selectedValues.find((v) => v.qid === "q1");
      return item
        ? getOptionText("q1", Array.isArray(item.oid) ? item.oid[0] : item.oid)
        : "";
    })();

    let minPrice = 0,
      maxPrice = 0;
    {
      const item = selectedValues.find((v) => v.qid === "q2");
      if (item) {
        const priceRange = getOptionText(
          "q2",
          Array.isArray(item.oid) ? item.oid[0] : item.oid
        );
        const matches = priceRange.match(/\$(\d+)\s*-\s*\$(\d+)/);
        if (matches) {
          minPrice = parseInt(matches[1], 10);
          maxPrice = parseInt(matches[2], 10);
        }
      }
    }

    const locationRange = (() => {
      const item = selectedValues.find((v) => v.qid === "q3");
      return item
        ? getOptionText("q3", Array.isArray(item.oid) ? item.oid[0] : item.oid)
        : "";
    })();

    let isPrn = false,
      prnMin = 0,
      prnMax = 0;
    {
      const item = selectedValues.find((v) => v.qid === "q4");
      if (item) {
        const prnText = getOptionText(
          "q4",
          Array.isArray(item.oid) ? item.oid[0] : item.oid
        );
        if (prnText.toLowerCase() === "as needed") {
          isPrn = true;
        } else {
          const matches = prnText.match(/\$(\d+)\s*-\s*\$(\d+)/);
          if (matches) {
            prnMin = parseInt(matches[1], 10);
            prnMax = parseInt(matches[2], 10);
          }
        }
      }
    }

    let experienceMin = 0,
      experienceMax = 0;
    {
      const item = selectedValues.find((v) => v.qid === "q7");
      if (item) {
        const expText = getOptionText(
          "q7",
          Array.isArray(item.oid) ? item.oid[0] : item.oid
        );
        const matches = expText.match(/(\d+)[^\d]+(\d+)/);
        if (matches) {
          experienceMin = parseInt(matches[1], 10);
          experienceMax = parseInt(matches[2], 10);
        } else if (expText.includes("10+")) {
          experienceMin = 10;
          experienceMax = 99;
        }
      }
    }

    let certified = false;
    {
      const item = selectedValues.find((v) => v.qid === "q5");
      if (item) {
        const certText = getOptionText(
          "q5",
          Array.isArray(item.oid) ? item.oid[0] : item.oid
        );
        certified = certText.toLowerCase() === "yes";
      }
    }

    let languages: string[] = [];
    {
      const item = selectedValues.find((v) => v.qid === "q6");
      if (item && Array.isArray(item.oid)) {
        languages = item.oid.map((oid) => getOptionText("q6", oid));
      }
    }

    return {
      caregivingType,
      minPrice,
      maxPrice,
      locationRange,
      experienceMin,
      experienceMax,
      certified,
      languages,
      prnMin,
      prnMax,
      isPrn,
    };
  };

  const handleSave = async () => {
    try {
      const payload = convertToApiPayload();
      await updateJobProfile(payload).unwrap();
      
      // Update the profile state with the new values
      const updatedProfile = selectedValues.map(item => {
        // Convert option IDs back to display text
        if (item.qid === "q6") {
          const question = data.profileQues.find(q => q.id === "q6");
          if (question) {
            const languageTexts = Array.isArray(item.oid) 
              ? item.oid.map(oid => {
                  const option = question.options.find(opt => opt.id === oid);
                  return option ? option.text : '';
                }).filter(text => text !== '')
              : [];
            return { ...item, oid: languageTexts.join(", ") };
          }
        }
        else {
          const question = data.profileQues.find(q => q.id === item.qid);
          if (question) {
            const option = question.options.find(opt => opt.id === item.oid);
            if (option) {
              return { ...item, oid: option.text };
            }
          }
        }
        return item;
      });
      
      setProfile(updatedProfile);
      handleOpen();
    } catch (err) {
      console.error("Failed to update job profile:", err);
    }
  };

  const questions = data.profileQues;
  const radioQues = questions?.filter((ques) => ques.type === "radio");
  const multipleQues = questions?.filter((ques) => ques.type === "multiple");

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      showCrossButton={true}
      className="preference-dialog px-10 !py-6 h-full"
    >
      <div className="flex h-full overflow-y-auto flex-col gap-1 items-center text-center">
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold">
            Complete Your Job Profile to Start Getting Jobs
          </div>
          <div className="text-[var(--cool-gray)] text-sm lg:px-7">
            Please fill out the information below. This helps us match you with
            the right opportunities
          </div>
        </div>

        <div className="flex-1 overflow-y-auto h-full w-full my-6 flex flex-col gap-5">
          {radioQues?.map((item) => {
            const result = selectedValues?.find((value) => value.qid === item.id);
            const selectedOption = result && !Array.isArray(result.oid) ? result.oid : "";

            return (
              <div
                key={item.id}
                className="flex flex-col gap-2 items-start text-lg font-medium"
              >
                <div>{item.ques}</div>
                <div>
                  <RadioGroup
                    className="gap-2"
                    onValueChange={(oid) => handleChange(item.id, oid, "radio")}
                    value={selectedOption}
                    defaultValue={selectedOption}
                  >
                    {item.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label
                          htmlFor={option.id}
                          className="text-[var(--cool-gray)] text-sm"
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
            const result = selectedValues?.find((value) => value.qid === item.id);
            const selectedOids = result && Array.isArray(result.oid) 
              ? result.oid 
              : [];

            return (
              <div
                key={item.id}
                className="flex flex-col gap-2 items-start text-lg font-medium"
              >
                <div>{item.ques} <span className="text-xs text-gray-600/60">(You can select multiple fields)</span> </div>
                <div className="mb-4 flex flex-wrap gap-y-3 gap-x-2 items-start w-full">
                  {item.options?.map((option) => {
                    const isSelected = selectedOids.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        className={`service-card flex gap-1 items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected 
                            ? "bg-[#233D4D] !text-white " 
                            : "bg-white text-gray-700 border border-gray-300 hover:border-primary"
                        }`}
                        onClick={() => handleChange(item.id, option.id, "multiple")}
                        type="button"
                      >
                            {isSelected && (
      <Check size={18} className="text-white " />
      )}
                        {option.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex mt-auto w-full gap-2">
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

export default JobProfileDialog;