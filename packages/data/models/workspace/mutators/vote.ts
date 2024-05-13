import { produce } from "immer";
import { DrObj, TEAM_MEMBERS_ROLE, Thread, ThreadSchema } from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

interface VoteArgs {
  threadId: string;
  teamId: string;
  option: number;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  curUserId: string;
}

export function voteMutation({
  threadId,
  teamId,
  structure,
  option,
  curUserId,
}: VoteArgs) {
  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    // Check if team not found
    if (!team) throw new Error("Team not found");

    const thread = team.threads.find((ch) => ch.id === threadId);
    if (!thread) {
      throw new Error("Thread not found");
    } else {
      const curVote = thread.pollVoters?.find((v) => v.voter === curUserId);
      if (curVote) {
        // thread.pollVoters = thread.pollVoters?.filter(
        //   (v) => v.voter !== curUserId
        // );
        // thread.votes![curVote.option]!--;
        throw new Error("User already voted");
      }

      if (thread.pollOptions && option >= thread.pollOptions?.length)
        throw new Error("Invalid option");

      thread.pollVoters?.push({ voter: curUserId, option });
      thread.votes![option]
        ? thread.votes![option]!++
        : (thread.votes![option] = 1);
    }
  });
  return newStructure as WorkspaceStructure;
}
