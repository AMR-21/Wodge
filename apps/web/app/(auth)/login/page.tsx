import { Logo } from "@/components/logo";
import { LoginWrapper } from "@/components/auth/login-wrapper";

function LoginPage() {
  return (
    <main className="flex h-full min-h-screen w-screen flex-col items-center justify-center space-y-3 overflow-y-auto bg-page py-8">
      {/* <div className="flex h-full flex-col items-center space-y-3 overflow-y-auto py-4"> */}
      <Logo />
      <LoginWrapper />
      {/* </div> */}
    </main>
  );
}

export default LoginPage;
