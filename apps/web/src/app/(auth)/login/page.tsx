"use client";

import { Logo } from "@/components/logo";
import { LoginWrapper } from "@/components/auth/login-wrapper";
import { useEffect } from "react";
import {
  localStoragePersister,
  queryClient,
} from "@repo/data/lib/query-client";

function LoginPage() {
  useEffect(() => {
    queryClient.clear();
    localStoragePersister.removeClient();
  }, []);

  return (
    <main className="bg-page flex h-full min-h-screen w-screen flex-col items-center justify-center space-y-3 overflow-y-auto overflow-x-hidden py-8">
      <Logo />
      <LoginWrapper />
    </main>
  );
}

export default LoginPage;
