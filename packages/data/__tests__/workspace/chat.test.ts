import { describe, expect, test } from "vitest";
import {
  createTestMessage,
  createTestRoom,
  createTestStructure,
  createTestTeam,
} from "../utils";
import { sendMessage } from "../../models/workspace/mutators/send-msg";
import { deleteMsg } from "../../models/workspace/mutators/delete-msg";
describe("Chat test", () => {
  test("Chat test", async () => {
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
  test("Delete test", async () => {
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
});
