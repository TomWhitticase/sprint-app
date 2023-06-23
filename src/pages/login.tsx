import React from "react";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { signIn, useSession } from "next-auth/react";

// Import Login Component
import LoginCard from "@/components/login/login-card";

const Login = () => {
  const { status } = useSession();
  const router = useRouter();

  // Error State
  const [error, setError] = useState("");

  // Field States
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Push to home page if already authenticated
  if (status === "authenticated") {
    router.push("/");
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent Refresh
    e.preventDefault();

    setError(""); // Clear the error message before new attempt
    interface ISignInResponse {
      error: string;
      status: number;
      ok: boolean;
      url: string;
    }
    const result = (await signIn("credentials", {
      redirect: false,
      username: emailInput,
      password: passwordInput,
      callbackUrl: "/",
    })) as ISignInResponse;

    // Add error handling
    if (result.error) {
      result.error === "CredentialsSignin"
        ? setError("Invalid credentials")
        : setError("Could not connect to server");
    } else {
      console.log(result);
      router.push("/");
    }
  };

  return (
    <>
      {status === "unauthenticated" ? (
        <LoginCard
          email={emailInput}
          password={passwordInput}
          setEmail={setEmailInput}
          setPassword={setPasswordInput}
          formSubmission={handleSignIn}
          error={error}
        />
      ) : null}
    </>
  );
};

export default Login;
