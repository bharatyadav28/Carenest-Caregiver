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

interface ActionButtonProps {
  title?: React.ReactNode;
  onClick: () => void;
  className?: string;
}
export const DialogConfirmButton = ({
  title,
  onClick,
  className,
}: ActionButtonProps) => {
  const classes = `flex-1 py-5 ${className}`;
  return (
    <CustomButton className={classes} onClick={onClick}>
      {" "}
      {title || "Confirm"}
    </CustomButton>
  );
};

export const TransaparentButton = ({
  title,
  onClick,
  className,
}: ActionButtonProps) => {
  const classes = `flex-1 py-5 bg-[#233D4D1A] text-primary-foreground hover:bg-[#233D4D1A] hover:opacity-85 transition ${className}`;
  return (
    <CustomButton className={classes} onClick={onClick}>
      {" "}
      {title || "Cancel"}
    </CustomButton>
  );
};
