"use client";

import { useChannelPath } from "@/hooks/use-channel-path";

import { useUpdateRecentlyVisited } from "@/hooks/use-recently-visited";
import { useCurrentThreadRep } from "@/hooks/use-thread-rep";

import { PostPage } from "./post-page";
import { QAPage } from "./qa-page";

function ChannelPage() {
  useUpdateRecentlyVisited("thread");
  const path = useChannelPath();

  const rep = useCurrentThreadRep();

  if (path?.thread?.type === "post") return <PostPage rep={rep} />;

  return <QAPage rep={rep} />;
}

export default ChannelPage;
