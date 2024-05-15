"use client";

import { useCurrentThreadRep } from "@/hooks/use-thread-rep";

import { PostPage } from "../../post-page";

function ChannelPage() {
  const rep = useCurrentThreadRep();
  return <PostPage rep={rep} />;
}

export default ChannelPage;
