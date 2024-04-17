import { describe, expect, test } from "vitest";
import {
  createTestMessage,
  createTestRoom,
  createTestStructure,
  createTestTeam,
} from "../utils";
import { sendMessage } from "../../models/workspace/mutators/send-msg";
import { deleteMsg } from "../../models/workspace/mutators/delete-msg";
import { addReact } from "../../models/workspace/mutators/add-react";
describe("Chat test", () => {
  test.skip("Chat test", async () => {
    const room = createTestRoom();
    const team = createTestTeam({ rooms: [room] });
    const structure = createTestStructure({ teams: [team] });
    const msg = createTestMessage();
    const newStr = sendMessage({
      message: msg,
      teamId: team.id,
      roomId: room.id,
      structure,
    });
    expect(
      newStr.teams
        .find((t) => t.id == team.id)
        ?.rooms.find((r) => r.id == room.id)?.messages
    ).toContainEqual(msg);
  });
  test.skip("Delete test", async () => {
    const room = createTestRoom();
    const team = createTestTeam({ rooms: [room] });
    const structure = createTestStructure({ teams: [team] });
    const msg = createTestMessage();
    const newStr = sendMessage({
      message: msg,
      teamId: team.id,
      roomId: room.id,
      structure,
    });
    const newStr2 = deleteMsg({
      msgId: msg.id,
      teamId: team.id,
      roomId: room.id,
      structure: newStr,
    });
    expect(
      newStr.teams
        .find((t) => t.id == team.id)
        ?.rooms.find((r) => r.id == room.id)?.messages
    ).not.toContain(msg);
    // console.log(newStr2.teams[0]?.rooms[0]?.messages);
  });
  test("Add reaction", async () => {
    const msg = createTestMessage();
    const room = createTestRoom({ messages: [msg] });
    const team = createTestTeam({ rooms: [room] });
    const structure = createTestStructure({ teams: [team] });
    const newStr = addReact({
      messageId: msg.id,
      roomId: room.id,
      teamId: team.id,
      structure: structure,
      emoji: "👍",
    });

    console.log(newStr.teams[0]?.rooms[0]?.messages[0]?.reactions);
    const newStr1 = addReact({
      messageId: msg.id,
      roomId: room.id,
      teamId: team.id,
      structure: newStr,
      emoji: "👍",
    });
    console.log(newStr1.teams[0]?.rooms[0]?.messages[0]?.reactions);
  });
});
