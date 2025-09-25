"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { TextInput } from "@/components/common/CustomInputs";
import { EmailIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async () => {
    if (!email) {
      return toast.error("Please enter your email");
    }

    setIsLoading(true);

    try {
      const response = await forgotPassword({
        email,
        role: "giver", // or "receiver" based on your application
      }).unwrap();

      if (response.success) {
        toast.success(`OTP sent successfully to your ${email}`);
        Cookies.set("tempUserId", response.data.userId, { expires: 1/24 }); // 1 hour
        router.push("/otp-verification");
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      const message =  "An unknown error occurred";
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-8 flex flex-col gap-4">
      <TextInput
        text={email}
        setText={setEmail}
        Icon={EmailIcon}
        type="email"
        placeholder="Enter Email ID"
        onChange={(e) => setEmail(e.target.value)}
      />

      <CustomButton
        className="mt-6"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </CustomButton>
    </div>
  );
}

export default ForgotPasswordForm;
