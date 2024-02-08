import { LogoutBtn } from "@/components/logout-btn";

function LogoutPage() {
  return (
    <main className="flex h-full min-h-screen w-screen items-center justify-center  bg-background">
      <div className="flex flex-col items-center gap-4 rounded-md border border-border bg-surface p-8">
        <p>Are you sure you want to log out?</p>
        <LogoutBtn />
      </div>
    </main>
  );
}

export default LogoutPage;
