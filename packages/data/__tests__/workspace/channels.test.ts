import test from "node:test";
import { describe } from "vitest";
import { createTestChannel } from "../utils";

describe("Workspace channels' unit mutations", () => {
  test("Create a channel", () => {
    const channel = createTestChannel();
  });
});
