"use client";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { googleIcon } from "@/lib/svg_icons";
import { CustomButton } from "../common/CustomButton";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials, setAccessToken } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { backendurl } from "@/lib/utils";
function GoogleButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch(`${backendurl}/api/v1/user/google-auth`, {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleToken: response.access_token,role:"giver" }),
        });

        const data = await res.json();
            console.log("Google login response:", data?.data?.accessToken,);
              if(res.ok){

  
                Cookies.set("authToken", data?.data?.accessToken, { expires: 7 });
                Cookies.set("refreshToken", data?.data?.refreshToken, { expires: 7 });
                 // Update redux state immediately
    dispatch(setCredentials?.({ accessToken: data?.data?.accessToken, refreshToken: data?.data?.refreshToken }) ?? setAccessToken(data?.data?.accessToken));
              
              }
              
        if (!res.ok) {
          toast.error(data?.message || "Google login failed");
          return;
        }

        toast.success("Google login successful!");
        // redirect after success
           router.push("/dashboard");
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
      <div className="flex gap-2 items-center  text-lg">
        <div>{googleIcon}</div>
        <div>Continue with Google</div>
      </div>
    </CustomButton>
  );
}

export default GoogleButton;
