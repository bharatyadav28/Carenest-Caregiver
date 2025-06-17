"use client";

import * as React from "react";

interface Props {
  children: React.ReactNode;
  percentage: number;
}

export function CustomPieChart({ children, percentage }: Props) {
  // const percentage = 90;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Calculate the stroke-dasharray for the progress circle
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (clampedPercentage / 100) * circumference || 0;

  return (
    <div className="relative flex gap-2 items-center text-sm ">
      <div className="rounded-full relative">
        {/* SVG for circular progress */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 48 48"
          style={{ overflow: "visible" }}
        >
          {/* Define gradient */}
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
          </defs>

          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
            r={20}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        </svg>

        {children}
      </div>

      <div className="bg-primary px-[0.31rem] py-[0.42rem] flex justify-center items-center text-xs rounded-full font-semibold absolute right-0 bottom-0">
        {percentage}%
      </div>
    </div>
  );
}
