"use client";

import React from "react";

import { Button } from "../ui/button";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const CustomButton = ({ children, onClick, className }: ButtonProps) => {
  const classes = `py-6 rounded-full hover:cursor-pointer transition-all ${className}`;
  return (
    <Button className={classes} onClick={onClick}>
      {" "}
      {children}
    </Button>
  );
};
