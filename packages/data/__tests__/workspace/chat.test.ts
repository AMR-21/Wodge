import { describe, expect, test } from "vitest";
import {
  createTestMessage,
  createTestRoom,
  createTestStructure,
  createTestTeam,
} from "../utils";
import { sendMessage } from "../../models/workspace/mutators/send-msg";
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
    // console.log(newStr.teams[0]?.rooms[0]?.messages[0]?.content);
    // console.log(msg);
    expect(
      newStr.teams
        .find((t) => t.id == team.id)
        ?.rooms.find((r) => r.id == room.id)?.messages
    ).toContainEqual(msg);
  });
});
