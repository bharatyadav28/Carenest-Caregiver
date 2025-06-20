import React from "react";

interface Props {
  text?: string;
  className?: string;
}

export default function TextWithLines({ text, className }: Props) {
  return (
    <div className={`flex items-center my-2 ${className}`}>
      <div className="flex-grow border-t border-dashed border-gray-300"></div>
      <span className="mx-4 text-[##B9B9B9]">{text}</span>
      <div className="flex-grow border-t border-dashed border-gray-300"></div>
    </div>
  );
}

export function SimpleLine({ className }: Props) {
  return (
    <div
      className={`w-full border-t-1 border-[#33333333] my-2 ${className}`}
    ></div>
  );
}
