"use client";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { googleIcon } from "@/lib/svg_icons";
import { CustomButton } from "../common/CustomButton";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
function GoogleButton() {
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch("https://carenest-backend-8y2y.onrender.com/api/v1/user/google-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleToken: response.access_token,role:"giver" }),
        });

        const data = await res.json();
            console.log("Google login response:", data?.data?.accessToken,);
              if(res.ok){
                Cookies.set("authToken", data?.data?.accessToken, { expires: 7 });
                Cookies.set("refreshToken", data?.data?.refreshToken, { expires: 7 });
              }
              
        if (!res.ok) {
          toast.error(data?.message || "Google login failed");
          return;
        }

        toast.success("Google login successful!");
        router.push("/dashboard"); // redirect after success
      } catch (err) {
        console.error("Google login error:", err);
        toast.error("Something went wrong");
      }
    },
    onError: (err) => {
      console.log("Login Failed:", err);
      toast.error("Google login failed");
    },
  });

  return (
    <CustomButton
      className="bg-[#ffffff] hover:bg-[#ffffff] text-[var(--blue-gray)]"
      onClick={() => googleLogin()}
    >
      <div className="flex gap-2 items-center">
        <div>{googleIcon}</div>
        <div>Continue with Google</div>
      </div>
    </CustomButton>
  );
}

export default GoogleButton;
