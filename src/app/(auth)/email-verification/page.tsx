import React from "react";

import OTPForm from "@/components/auth/forms/OTPForm";
import AuthLayout from "@/components/auth/AuthLayout";

function page() {
  return (
    <AuthLayout image="/auth/otp.png">
      <OTPForm isEmailVerify={true} />
    </AuthLayout>
  );
}

export default page;
 