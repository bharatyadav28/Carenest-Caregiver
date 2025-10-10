"use client";
import React from "react";
import {
  callIcon,
  profileIcon,
  calendarIcon,
  interestIcon,
} from "@/lib/svg_icons";

interface DashboardStatCardProps {
  label: string;
  value: number;
  index: number;
}

export function DashboardStatCard({ label, value, index }: DashboardStatCardProps) {
  const icons = [callIcon, profileIcon, calendarIcon, interestIcon];
  const bgColors = ["bg-green-100", "bg-sky-100", "bg-amber-100", "bg-purple-100"];

  const Icon = icons[index] || null;
  const bg = bgColors[index] || "bg-gray-100";

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col gap-2">
      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${bg}`}>
        <div className="">
          {Icon}
        </div>
      </div>
      <div className="text-2xl font-semibold text-[#1B2A37]">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-[#7A8B9B] text-xl">{label}</div>
    </div>
  );
}