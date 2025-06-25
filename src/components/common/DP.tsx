import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface Props {
  url: string | StaticImageData;
  alt: string;
  className?: string;
}

function DP({ url, alt, className }: Props) {
  const classes = `relative rounded-full flex w-12 h-12 ${className}`;
  return (
    <div className={classes}>
      <Image src={url} alt={alt} fill className="rounded-full" />
    </div>
  );
}

export default DP;
