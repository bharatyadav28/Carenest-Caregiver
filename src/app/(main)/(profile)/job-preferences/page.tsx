"use client";
import About from "@/components/profile/job-preferences/About";
import JobProfile from "@/components/profile/job-preferences/JobProfile";
import MyCertificates from "@/components/profile/job-preferences/MyCertificate";
import MyServices from "@/components/profile/job-preferences/MyServices";
import ResumeComponent from "@/components/profile/job-preferences/ResumeComponent";
import WorkPermitComponent from "@/components/profile/job-preferences/WorkPermitComponent";
import Zipcode from "@/components/profile/job-preferences/Zipcode";
import React from "react";

function JobPreferencePage() {
  return (
    <div className=" flex flex-col gap-6 ">
      <About />
      <JobProfile />
      <MyServices />
      <Zipcode />
      <WorkPermitComponent/>
      <ResumeComponent/>
<MyCertificates/> 
    </div>
  );
}

export default JobPreferencePage;
