import React from "react";

interface Props {
  text: string;
}

export default function TextWithLines({ text }: Props) {
  return (
    <div className="flex items-center my-2">
      <div className="flex-grow border-t border-dashed border-gray-300"></div>
      <span className="mx-4 text-[##B9B9B9]">{text}</span>
      <div className="flex-grow border-t border-dashed border-gray-300"></div>
    </div>
  );
}
