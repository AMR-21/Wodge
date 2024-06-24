"use client";

import { useCurrentThreadRep } from "@/hooks/use-thread-rep";

import { QAPage } from "../../qa-page";

function ChannelPage() {
  const rep = useCurrentThreadRep();

  return <QAPage rep={rep} />;
}

export default ChannelPage;
