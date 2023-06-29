import RegisterCard from "@/components/login/register-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    router.push("/");
    return null;
  }

  return <>{status === "unauthenticated" ? <RegisterCard /> : null}</>;
}
