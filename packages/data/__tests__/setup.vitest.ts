import indexeddb from "fake-indexeddb";
import { UserId } from "./tests";
import { vi } from "vitest";
import { TEST_LICENSE_KEY } from "replicache";
import { queryClient } from "../lib/query-client";

globalThis.indexedDB = indexeddb;

/**
 * Setup a user
 */

localStorage.setItem(
  "user",
  JSON.stringify({
    id: UserId,
    displayName: "Test User",
    email: "test@example.com",
    username: "ad3",
  })
);

vi.stubEnv("NEXT_PUBLIC_BACKEND_DOMAIN", "http://localhost:3000");
vi.stubEnv("NEXT_PUBLIC_REPLICACHE_KEY", TEST_LICENSE_KEY);

queryClient.setQueryData(["user"], {
  id: UserId,
  displayName: "Test User",
  email: "test@example.com",
  username: "ad3",
});
