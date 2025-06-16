import React from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import SignupProgress from "@/components/auth/SignupProgress";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthLayout image="/auth/signup.png">
      <SignupProgress />
      {children}
    </AuthLayout>
  );
}

export default Layout;
