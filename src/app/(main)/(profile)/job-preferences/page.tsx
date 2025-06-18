"use client";
import About from "@/components/profile/job-preferences/About";
import JobProfile from "@/components/profile/job-preferences/JobProfile";
import MyServices from "@/components/profile/job-preferences/MyServices";
import WhyChooseMe from "@/components/profile/job-preferences/WhyChooseMe";
import React from "react";

function JobPreferencePage() {
  return (
    <div className=" flex flex-col gap-6 ">
      <About />
      <JobProfile />
      <MyServices />
      <WhyChooseMe />
    </div>
  );
}

export default JobPreferencePage;
