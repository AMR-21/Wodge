"use client";

import { RecentCarousel } from "@/components/home/recent-carousel";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useRecentlyVisited } from "@repo/ui/hooks/use-recently-visited";

function HomePage() {
  const { user } = useCurrentUser();

  let greeting;
  const hrs = new Date().getHours();

  if (hrs < 12 && hrs > 4) {
    greeting = "Good Morning";
  } else if (hrs >= 12 && hrs < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="container w-full space-y-8">
      <h2 className="text-center text-2xl">
        {greeting}, {user?.displayName}
      </h2>

      {/* <div>notifications</div> */}
      <RecentCarousel />
    </div>
  );
}

export default HomePage;
