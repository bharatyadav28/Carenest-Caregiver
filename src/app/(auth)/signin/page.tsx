import React from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import SigninForm from "@/components/auth/forms/SigninForm";
import Link from "next/link";

function page() {
  return (
    <AuthLayout image="/auth/signin.png">
      <div className="mt-6">
        <div className="font-semibold text-2xl">Welcome back!</div>
        <div className="mt-1">
          Join the caregiving community—log in and start supporting those in
          need.
        </div>

        <div className="flex items-center gap-1 mt-5">
          <div>Don’t have an account?</div>
          <Link
            href="/signup"
            className="p-0 m-0 text-[var(--primary)] font-medium"
          >
            Sign Up
          </Link>
        </div>

        <SigninForm />
      </div>
    </AuthLayout>
  );
}

export default page;
