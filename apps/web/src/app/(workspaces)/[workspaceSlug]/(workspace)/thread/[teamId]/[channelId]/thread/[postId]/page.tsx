"use client";

import { useChannelPath } from "@/hooks/use-channel-path";

import { useUpdateRecentlyVisited } from "@/hooks/use-recently-visited";
import { useCurrentThreadRep } from "@/hooks/use-thread-rep";

import { Replicache } from "replicache";
import { threadMutators, ThreadPost } from "@repo/data";
import { QAPage } from "../../qa-page";

function ChannelPage() {
  const rep = useCurrentThreadRep();


  return <QAPage rep={rep} />;
}

export default ChannelPage;
