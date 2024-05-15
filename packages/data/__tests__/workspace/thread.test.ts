import { describe, expect, test } from "vitest";
import {
  createTestStructure,
  createTestTeam,
  createTestThread,
  createThreadMessage,
} from "../utils";
import { createThreadMutation } from "../../models/workspace/mutators/create-thread";
import { deleteThreadMutation } from "../../models/workspace/mutators/delete-thread";
import { deleteThreadMessageMutation } from "../../models/thread/mutators/delete-comment";
import { createThreadMessageMutation } from "../../models/thread/mutators/create-comment";
import { editThreadMessageMutation } from "../../models/thread/mutators/edit-comment";
import { user } from "../tests";

describe("Workspace threads' unit mutations", () => {
  test("Create a thread", async () => {
    const team = createTestTeam();
    const structure = createTestStructure({ teams: [team] });
    const thread = createTestThread();
    const newstr = createThreadMutation({
      thread: thread,
      teamId: team.id,
      curUserId: user.id,
      structure,
    });

    expect(newstr.teams[0]?.threads).toContainEqual(thread);
  });
  test("Delete a thread", async () => {
    const thread = createTestThread();
    const team = createTestTeam({ threads: [thread] });
    const structure = createTestStructure({ teams: [team] });
    //console.log(structure.teams[0]?.threads);
    const newstr = deleteThreadMutation({
      threadId: thread.id,
      teamId: team.id,
      structure,
    });
    //console.log(newstr.teams[0]?.threads);
    expect(newstr.teams[0]?.threads).not.toContainEqual(thread);
  });
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
  test("Create thread message", async () => {
    const thread = createTestThread();
    const team = createTestTeam({ threads: [thread] });
    const structure = createTestStructure({ teams: [team] });
    const msg = createThreadMessage();
    //console.log("created",msg);
    const msgsArray = [createThreadMessage()];
    //console.log(msgsArray);
    const newMsgsArray = createThreadMessageMutation({
      msgsArray,
      userId: user.id,
      msg,
    });
    //console.log("created",newMsgsArray[1]);
    //console.log(newMsgsArray);
    expect(newMsgsArray).toContainEqual(msg);
  });
  test("Delete thread message", async () => {
    const thread = createTestThread();
    const team = createTestTeam({ threads: [thread] });
    const structure = createTestStructure({ teams: [team] });
    const msg = createThreadMessage();
    //console.log("created",msg);
    const msgsArray = [msg];
    const newMsgsArray = deleteThreadMessageMutation({
      msg,
      msgsArray,
      userId: user.id,
      isPrivileged: true,
    });
    //console.log("created",newMsgsArray[1]);
    //console.log(newMsgsArray);
    expect(newMsgsArray).not.toContainEqual(msg);
  });
  test("edit thread message", async () => {
    const thread = createTestThread();
    const team = createTestTeam({ threads: [thread] });
    const structure = createTestStructure({ teams: [team] });
    const msg = createThreadMessage();
    //console.log("created",msg.content);
    const msgsArray = [msg];

    const newMsgsArray1 = editThreadMessageMutation({
      msg,
      msgsArray,
      newContent: "edited",
      userId: user.id,
    });
    //console.log("new",newMsgsArray1[0]?.content );
    expect(newMsgsArray1).toContainEqual({
      ...msg,
      content: "edited",
    });
  });
});
