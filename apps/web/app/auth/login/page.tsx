import { Logo } from "@/components/logo";
import { LoginWrapper } from "@/components/auth/login-wrapper";

function LoginPage() {
  return (
    <main className="flex min-h-screen w-screen items-center justify-center bg-page text-center">
      <div className="flex h-full flex-col items-center space-y-3 overflow-y-auto py-4 text-center">
        <Logo />
        <LoginWrapper />
      </div>
    </main>
  );
}

export default LoginPage;
