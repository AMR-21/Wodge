import { RedirectBtn } from "@/components/redirect-btn";

function LoginErrorPage() {
  return (
    <main className="flex h-full min-h-screen w-screen items-center justify-center  bg-background">
      <div className="flex flex-col items-center gap-4 rounded-md border border-border bg-surface p-8">
        <p>Something went very wrong :(</p>
        <RedirectBtn />
      </div>
    </main>
  );
}

export default LoginErrorPage;
