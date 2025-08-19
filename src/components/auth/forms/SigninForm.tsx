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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import Cookies from "js-cookie";

function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState("false");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const [signin] = useSigninMutation();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await signin({
        email,
        password,
        role: "giver" // or "receiver" based on your application
      }).unwrap();

      if (response.success) {
        // Set tokens with appropriate expiration
        if (rememberMe === "true") {
          Cookies.set("authToken", response.data.accessToken, { expires: 7 }); // 1 week
          Cookies.set("refreshToken", response.data.refreshToken, { expires: 30 }); // 1 month
        } else {
          Cookies.set("authToken", response.data.accessToken); // Session cookie
          Cookies.set("refreshToken", response.data.refreshToken); // Session cookie
        }
        
        router.push("/dashboard");
      } else {
        setError(response.message || "Sign in failed");
      }
    } catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // Use error.message in your UI
  } else {
    console.error("An unknown error occurred");
    // Fallback error message
  }
} finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6 flex flex-col gap-4">
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}

      <TextInput
        text={email}
        setText={setEmail}
        Icon={EmailIcon}
        type="email"
        placeholder="Enter Email ID"
      />

      <PasswordInput
        text={password}
        setText={setPassword}
        Icon={passwordIcon}
        placeholder="Enter Password"
      />

      <RadioGroup
        value={rememberMe}
        onValueChange={setRememberMe}
        className="gap-3 "
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="remember-me" className="!p-2 border-black border-2"/>
          <Label htmlFor="remember-me">Remember me</Label>
        </div>
      </RadioGroup>

      <CustomButton 
        className="mt-4 mb-3" 
        onClick={handleSubmit}
       // disabled={isLoading}
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