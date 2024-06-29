"use client";

import { useRouter } from "next/navigation";
import { AddWorkspaceDialog } from "@/app/(workspaces)/add-workspace-dialog";
import { WorkspacesList } from "@/app/(workspaces)/workspaces-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCard } from "@/components/user-card";

function WorkspacesPage() {
  const router = useRouter();

  // Cache the user data on login or sign up
  // const isCached = useCacheUser();

  // To avoid errors of accessing the local storage before it's initialized
  // if (!isCached) return null;

  return (
    <div className="relative flex h-full  w-full flex-col  items-center justify-center overflow-hidden   bg-background  bg-grid-black/[0.2] dark:bg-grid-white/[0.2] ">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background  opacity-85 [mask-image:radial-gradient(ellipse_at_center)]" />
      <UserCard className="absolute right-10 top-10 z-20" />
      <Button
        className="group absolute left-10 top-10 z-20 items-center text-sm"
        size="sm"
        variant="secondary"
        onClick={() => router.back()}
      >
        Back
      </Button>

      <div className="z-20 flex w-full max-w-xs flex-col">
        <p className="mb-2 text-xs text-muted-foreground">Your Workspaces</p>

        <ScrollArea className="max-h-72 rounded-md border border-border/50 bg-dim">
          <WorkspacesList />
        </ScrollArea>

        <SubscribeComponent
          priceId={"prod_QNTD1HpMozUpbm"}
          price={"50"}
          description="Test"
        />
        <Portal
          priceId={"prod_QNTD1HpMozUpbm"}
          price={"50"}
          description="Test"
        />

        <AddWorkspaceDialog />
      </div>
    </div>
  );
}

export default WorkspacesPage;

import { loadStripe } from "@stripe/stripe-js";
type props = {
  priceId: string;
  price: string;
  description: string;
};

const SubscribeComponent = ({ priceId, price, description }: props) => {
  const router = useRouter();
  const handleSubmit = async () => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PK as string,
    );
    if (!stripe) {
      return;
    }
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json<{ url: string }>();
      // if (!data.ok) throw new Error("Something went wrong");
      // await stripe.redirectToCheckout({
      //   sessionId: data.result.id,
      // });

      router.push(data.url);
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      Click Below button to get {description}
      <Button onClick={handleSubmit}>Upgrade in {price}</Button>
    </div>
  );
};
const Portal = ({ priceId, price, description }: props) => {
  const router = useRouter();
  const handleSubmit = async () => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PK as string,
    );
    if (!stripe) {
      return;
    }
    try {
      const response = await fetch("/api/portal", {
        method: "POST",
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json<{ url: string }>();
      // if (!data.ok) throw new Error("Something went wrong");
      // await stripe.redirectToCheckout({
      //   sessionId: data.result.id,
      // });

      router.push(data.url);
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      Click Below button to get {description}
      <Button onClick={handleSubmit}>Upgrade in {price}</Button>
    </div>
  );
};
