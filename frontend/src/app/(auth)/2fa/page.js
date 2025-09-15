"use client";

import AuthenticationNumber from "@/components/AuthenticationNumber";
import LockScreen from "@/components/LockScreen";
import { useSearchParams } from "next/navigation";

export default function Authentication() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // "login" | "signup"

  return <LockScreen mode={mode} />;
}
