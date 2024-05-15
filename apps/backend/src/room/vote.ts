import { RunnerParams } from "@/lib/replicache";
import RoomParty from "./room-party";
import { voteMutation } from "@repo/data/models/room/mutators/vote";
import { VoteArgs } from "./room-mutators";
import { produce } from "immer";

export async function vote(party: RoomParty, params: RunnerParams) {
  const vote = params.mutation.args as VoteArgs;

  party.roomMessages = produce(party.roomMessages, (draft) => {
    draft.data = voteMutation({
      curUserId: params.userId,
      msgsArr: draft.data,
      ...vote,
    });
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("messages", party.roomMessages);
}
