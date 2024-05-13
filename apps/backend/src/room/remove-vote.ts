import { RunnerParams } from "@/lib/replicache";
import RoomParty from "./room-party";
import { VoteArgs } from "./room-mutators";
import { removeRoomVoteMutation } from "@repo/data/models/room/mutators/remove-vote";

export async function removeVote(party: RoomParty, params: RunnerParams) {
  const vote = params.mutation.args as VoteArgs;

  party.roomMessages.data = removeRoomVoteMutation({
    curUserId: params.userId,
    msgsArr: party.roomMessages.data,
    ...vote,
  });

  party.roomMessages.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put("messages", party.roomMessages);
}
