import { RunnerParams } from "@/lib/replicache";
import RoomParty from "./room-party";
import { removeRoomVoteMutation } from "@repo/data/models/room/mutators/remove-vote";
import { produce } from "immer";
import { VoteArgs } from "@repo/data";

export async function removeVote(party: RoomParty, params: RunnerParams) {
  const vote = params.mutation.args as VoteArgs;

  party.roomMessages = produce(party.roomMessages, (draft) => {
    draft.data = removeRoomVoteMutation({
      curUserId: params.userId,
      msgsArr: draft.data,
      ...vote,
    });
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("messages", party.roomMessages);
}
