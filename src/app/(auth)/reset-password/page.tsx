import React from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/forms/ResetPasswordForm";

function page() {
  return (
    <AuthLayout image="/auth/forgot-password.png">
      <div className="mt-[8rem]">
        <div className="font-semibold text-2xl">Reset Password</div>
        <div className="mt-3">Please set a new password to continue.</div>

        <ResetPasswordForm />
      </div>
    </AuthLayout>
  );
}

export default page;
