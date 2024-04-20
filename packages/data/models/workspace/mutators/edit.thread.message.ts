import { produce } from "immer";
import { DrObj, TEAM_MEMBERS_ROLE, Thread, ThreadMessage, ThreadSchema , ThreadMessageSchema, PublicUserType} from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";
import { z } from "zod";
export function editThreadMessageMutation ({
    threadid,
    teamId,
    structure,
    msg,
    msgsarray,
    newcontent,
    user
}: {
    threadid: string;
    teamId: string;
    msg:ThreadMessage;
    newcontent : string
    structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
    user : string
    msgsarray : ThreadMessage[]
}) {
    const ContentSchema = z.string().min(1).max(4096);
    const team = structure.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");
    const thread = team.threads.find((t) => t.id === threadid);
    if (!thread) throw new Error("Thread not found");
    const validateFields = ThreadMessageSchema.safeParse(msg);
    if (!validateFields.success) throw new Error("Invalid msg data");
    const validationResult = ContentSchema.safeParse(newcontent);
    if (!validationResult.success) throw new Error("Invalid edited msg data");
    //check if you are allowed to edit the message 
    if (user !== msg.author)throw new Error("You are not allowed to edit this message");
    //check if the msg exists in the array
    if(!msgsarray.find(m => m.id === msg.id)) throw new Error("Message not found");
    //replace the content of the message using produce
     const newMsgsArray = produce(msgsarray, (draft) => {
         draft = draft.map((m) => {
             if (m.id === msg.id) {
                 m.content = newcontent
             }
             return m
         })
     })
    return newMsgsArray

}