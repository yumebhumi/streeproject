"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

function LogoutForm() {
  const { LogoutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    LogoutUser();
    router.replace("/login");
  }, [LogoutUser, router]);

  return null;
}

export default LogoutForm;
