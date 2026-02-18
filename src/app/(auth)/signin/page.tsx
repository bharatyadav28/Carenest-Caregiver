import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SigninForm from "@/components/auth/forms/SigninForm";
import Link from "next/link";

function page() {
  return (
    <AuthLayout 
      image="/auth/signin.png" // Desktop image
    >
      <div className="mt-4 md:mt-6">
        <div className="font-semibold text-2xl md:text-3xl">Welcome Back!</div>
        <div className="mt-1 text-base md:text-xl">
          Join the caregiving community—log in and start supporting those in
          need.
        </div>

        <div className="flex items-center gap-1 mt-4 md:mt-5 text-base md:text-xl">
          <div>Don&apos;t have an account?</div>
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