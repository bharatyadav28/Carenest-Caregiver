"use client";
import React from "react";
import { IoIosAdd as AddIcon } from "react-icons/io";
import { MdOutlineEdit as EditIcon } from "react-icons/md";

import { Button } from "../ui/button";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
    disabled?: boolean;
}

export const CustomButton = ({
  children,
  onClick,
  className,
  disabled = false,
}: ButtonProps) => {
  const classes = `py-6 rounded-full hover:cursor-pointer transition-all ${className}`;
  return (
    <Button className={classes} onClick={onClick} disabled={disabled}>
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

export const AddButton = ({ onClick }: ActionButtonProps) => {
  return (
    <CustomButton onClick={onClick} className="py-1 ps-2">
      <div className=" flex gap-1 items-center ">
        <div>
          <AddIcon />
        </div>
        Add
      </div>
    </CustomButton>
  );
};

export const EditButton = ({ onClick }: ActionButtonProps) => {
  return (
    <CustomButton onClick={onClick} className="py-1 pe-2">
      <div className="flex gap-1 items-center ">
        Edit
        <div>
          <EditIcon size={17} />
        </div>
      </div>
    </CustomButton>
  );
};
