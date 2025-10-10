import React from "react";
import Link from "next/link";

import SignupForm from "@/components/auth/forms/SignupForm";

function page() {
  return (
    <div>
      <div className="font-semibold text-3xl">Join Now!</div>
      <div className="mt-2 text-2xl font-medium">
       Start Your journey as a Caregiver - SignUp to provide compassionate care
      </div>

      <div className="flex items-center gap-1 mt-4 text-lg">
        <div>Already have an account?</div>
        <Link
          href="signin"
          className="p-0 m-0 text-[var(--primary)] font-medium"
        >
          Signin
        </Link>
      </div>

      <SignupForm />
    </div>
  );
}

export default page;
