"use client";

import { Logo } from "@/components/logo";
import { LoginWrapper } from "@/components/auth/login-wrapper";
import { useEffect, useState } from "react";

function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    localStorage.removeItem("user");
  }

  return (
    <main className="flex h-full min-h-screen w-screen flex-col items-center justify-center space-y-3 overflow-y-auto bg-page py-8">
      <Logo />
      <LoginWrapper />
    </main>
  );
}

export default LoginPage;
