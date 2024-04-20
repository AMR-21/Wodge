import { describe, expect, test } from "vitest";
import {
  createTestChannel,
  createTestStructure,
  createTestTeam,
  createTestThread,
  createThreadMessage,
} from "../utils";
import { createThreadMutation } from "../../models/workspace/mutators/create-thread";
import { deleteThreadMutation } from "../../models/workspace/mutators/delete-thread";
import { deleteThreadMessageMutation } from "../../models/workspace/mutators/delete-thread-message";
import { createThreadMessageMutation } from "../../models/workspace/mutators/create-thread-message";
import { editThreadMessageMutation } from "../../models/workspace/mutators/edit.thread.message";
import { nanoid } from "nanoid";
import { user } from "../tests";

import exp from "constants";

describe ("Workspace threads' unit mutations", () => {
    test ("Create a thread", async () => {
        const team = createTestTeam();
        const structure = createTestStructure({teams: [team]});
        const thread = createTestThread();
        const newstr = createThreadMutation
        ({
                thread: thread, 
                teamId: team.id,
                 structure
                });
        
        expect( newstr.teams[0]?.threads ).toContainEqual(thread);
    })
    test ("Delete a thread", async () => {
        const thread = createTestThread();
        const team = createTestTeam({threads: [thread]});
        const structure = createTestStructure({teams: [team]});
        //console.log(structure.teams[0]?.threads);
        const newstr = deleteThreadMutation (
            {
                threadId: thread.id,
                teamId: team.id,
                structure
            }
        );
        //console.log(newstr.teams[0]?.threads);
        expect( newstr.teams[0]?.threads ).not.toContainEqual(thread);
    })
// test ("Delete a non existing thread", async () => {
//     const thread = createTestThread();
//     const team = createTestTeam({threads: [thread]});
//     const structure = createTestStructure({teams: [team]});
//     //console.log(structure.teams[0]?.threads);
//     const newstr = deleteThreadMutation (
//         {
//             threadId: "non existing id",
//             teamId: team.id,
//             structure
//         }
//     );
//     //console.log(newstr.teams[0]?.threads);
//     expect( newstr.teams[0]?.threads ).not.toContainEqual(thread);
// })
test ("Create thread message", async () => {
    const thread = createTestThread();
    const team = createTestTeam({threads: [thread]});
    const structure = createTestStructure({teams: [team]});
    const msg = createThreadMessage();
    //console.log("created",msg);
    const msgsarray = [createThreadMessage()];
    //console.log(msgsarray);
    const newMsgsArray = createThreadMessageMutation ({
        threadid: thread.id,
        teamId: team.id,
        structure,
        msg,
        msgsarray,
        user:user,
    })
    //console.log("created",newMsgsArray[1]);
    //console.log(newMsgsArray);
    expect(newMsgsArray).toContainEqual(msg);


})
test ("Delete thread message", async () => {
    const thread = createTestThread();
    const team = createTestTeam({threads: [thread]});
    const structure = createTestStructure({teams: [team]});
    const msg = createThreadMessage();
    //console.log("created",msg);
    const msgsarray = [msg];
    //console.log(msgsarray);
    const newMsgsArray = deleteThreadMessageMutation ({
        threadid: thread.id,
        teamId: team.id,
        structure,
        msg,
        msgsarray,
        user:msg.author,
    })
    //console.log("created",newMsgsArray[1]);
    //console.log(newMsgsArray);
    expect(newMsgsArray).not.toContainEqual(msg);
})
 test ("edit thread message", async () => {
    const thread = createTestThread();
    const team = createTestTeam({threads: [thread]});
    const structure = createTestStructure({teams: [team]});
    const msg = createThreadMessage();
    //console.log("created",msg.content);
    const msgsarray = [msg];
    
    const newMsgsArray1 = editThreadMessageMutation ({
        threadid: thread.id,
        teamId: team.id,
        structure,
        msg,
        msgsarray,
        newcontent:"edited",
        user:msg.author,
    })
    //console.log("new",newMsgsArray1[0]?.content );
 expect(newMsgsArray1).toContainEqual({
    ...msg,
    content:"edited"
 })
 })
})