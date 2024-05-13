import { RunnerParams } from "@/lib/replicache";
import RoomParty from "./room-party";
import { voteMutation } from "@repo/data/models/room/mutators/vote";
import { VoteArgs } from "./room-mutators";

export async function vote(party: RoomParty, params: RunnerParams) {
  const vote = params.mutation.args as VoteArgs;

  party.roomMessages.data = voteMutation({
    curUserId: params.userId,
    msgsArr: party.roomMessages.data,
    ...vote,
  });

  party.roomMessages.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put("messages", party.roomMessages);
}
