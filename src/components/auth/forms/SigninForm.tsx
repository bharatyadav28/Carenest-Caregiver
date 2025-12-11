"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSigninMutation } from "@/store/api/authApi";
import { PasswordInput, TextInput } from "@/components/common/CustomInputs";
import { EmailIcon, passwordIcon } from "@/lib/svg_icons";
import { CustomButton } from "../../common/CustomButton";
import GoogleButton from "../GoogleButton";
import TextWithLines from "../../common/HorizontalLines";
import { Label } from "../../ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; 

function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Change to boolean
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [signin] = useSigninMutation();

  const handleSubmit = async () => {
    // ✅ Validation
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signin({
        email,
        password,
        role: "giver", // adjust if needed
      }).unwrap();

      if (response.success) {
        // ✅ Success toast
        toast.success("Signed in successfully 🎉");

        // Store tokens
        if (rememberMe) { // Change to boolean check
          Cookies.set("authToken", response.data.accessToken, { expires: 7 });
          Cookies.set("refreshToken", response.data.refreshToken, { expires: 30 });
        } else {
          Cookies.set("authToken", response.data.accessToken);
          Cookies.set("refreshToken", response.data.refreshToken);
        }

        router.push("/dashboard");
      } else {
        toast.error(response.message || "Sign in failed");
      }
    } catch (error:any) {
          console.log(error);
          toast.error(error.data.message);
        
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6 flex flex-col gap-4">
      <TextInput
        text={email}
        setText={setEmail}
        Icon={EmailIcon}
        type="email"
        placeholder="Enter Email ID"
        className="!text-lg"
      />

      <PasswordInput
        text={password}
        setText={setPassword}
        Icon={passwordIcon}
        placeholder="Enter Password"
        className="!text-lg"
      />

      {/* Replace RadioGroup with Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
          className="border-black border-2 m-1" // Add your custom styling
        />
        <Label htmlFor="remember-me" className="cursor-pointer">
          Remember me
        </Label>
      </div>

      <CustomButton
        className="mt-4 mb-3 text-xl"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </CustomButton>

      <div className="text-center">
        <Link href="/forgot-password" className="text-[#667085] hover:text-primary">
          Forgot your password?
        </Link>
      </div>

      <TextWithLines text="or" />
      <GoogleButton />
    </div>
  );
}

export default SigninForm;