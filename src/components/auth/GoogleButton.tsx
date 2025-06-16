import React from "react";

import { googleIcon } from "@/lib/svg_icons";
import { CustomButton } from "../common/CustomButton";

function GoogleButton() {
  return (
    <CustomButton
      className="bg-[#ffffff] hover:bg-[#ffffff] text-[var( --blue-gray)] "
      onClick={() => {}}
    >
      <div className="flex gap-2 items-center">
        <div>{googleIcon}</div>
        <div>Continue with Google</div>
      </div>
    </CustomButton>
  );
}

export default GoogleButton;
