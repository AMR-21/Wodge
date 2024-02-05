import { Button } from "@repo/ui";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-primary">
      A page
      <Button>Click</Button>
      <Button asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
    </main>
  );
}
