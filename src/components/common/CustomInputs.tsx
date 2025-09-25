import { eyeClosedIcon, eyeOpenIcon } from "@/lib/svg_icons";
import { Input } from "../ui/input";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  divClassName?: string;
  iconLast?: boolean;
  Icon?: React.JSX.Element;
  hideEyeIcon?: boolean;
}

export const TextInput = ({
  text,
  setText,
  className,
  divClassName,
  Icon,
  disabled,
  iconLast,
  ...props
}: InputProps) => {
  const classes = `w-full border-none focus-visible:ring-[0px] shadow-none ${className}`;
  const divClasses = `flex items-center rounded-full bg-[#ffffff] py-2 px-4 ${
    iconLast ? "flex-row-reverse font-normal" : ""
  } ${divClassName}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div className={divClasses}>
      {Icon && <div className="text-[#667085]">{Icon}</div>}
      <Input
        value={text}
          disabled={disabled}
        onChange={handleChange}
        {...props}
        className={classes}
      />
    </div>
  );
};

export const PasswordInput = ({
  text,
  setText,
  className,
  Icon,
  iconLast,
  divClassName,
  hideEyeIcon,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const classes = `w-full border-none  focus-visible:ring-[0px] shadow-none ${className}`;
  const divClasses = `flex items-center rounded-full bg-[#ffffff] py-2 px-4 ${
    iconLast ? "flex-row-reverse" : ""
  } ${divClassName}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div className={divClasses}>
      {Icon && <div>{Icon}</div>}
      <Input
        type={showPassword ? "text" : "password"}
        value={text}
        onChange={handleChange}
        {...props}
        className={classes}
      />
      {!hideEyeIcon && (
        <button
          className="p-0 m-0"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ?   eyeOpenIcon :eyeClosedIcon}
        </button>
      )}
    </div>
  );
};

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}
export const CustomTextArea = ({
  text,
  setText,
  className,

  ...props
}: TextareaProps) => {
  const classes = `w-full focus-visible:ring-[0px] shadow-none ${className} border border-[#EBEBEB] rounded-xl resize-none `;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div>
      {/* {Icon && <div>{Icon}</div>} */}
      <Textarea
        value={text}
        onChange={handleChange}
        {...props}
        className={classes}
      />
    </div>
  );
};
