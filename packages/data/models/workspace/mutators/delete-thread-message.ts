import { produce } from "immer";
import { DrObj, TEAM_MEMBERS_ROLE, Thread, ThreadMessage, ThreadSchema , ThreadMessageSchema, PublicUserType} from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";
import { or } from "drizzle-orm";

export function deleteThreadMessageMutation ({
    threadid,
    teamId,
    structure,
    msg,
    msgsarray,
    user,
}: {
    threadid: string;
    teamId: string;
    msg:ThreadMessage;
    structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
    msgsarray : ThreadMessage[]
    user : string

})
{

    const team = structure.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");
    const thread = team.threads.find((t) => t.id === threadid);
    if (!thread) throw new Error("Thread not found");
    const validateFields = ThreadMessageSchema.safeParse(msg);
    if (!validateFields.success) throw new Error("Invalid msg data");
    //check if the msg exists in the array
    if(!msgsarray.find(m => m.id === msg.id)) throw new Error("Message not found");
    const { data: newMsg } = validateFields;
    //check if the current user is the author of the message or he has the role of owner or admin in the team  
    if(newMsg.author !== user || user!== team.createdBy || team.moderators.includes(user)) throw new Error("You are not allowed to delete this message");
    // delete the message using produce 
    const newMsgsArray = produce(msgsarray, (draft) => {
        return draft.filter((m) => m.id !== msg.id);
      });
    return newMsgsArray;
}