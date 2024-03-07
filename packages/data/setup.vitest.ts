import indexeddb from "fake-indexeddb";
import { UserId } from "./tests";

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
