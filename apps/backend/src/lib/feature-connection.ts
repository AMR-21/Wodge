import type * as Party from "partykit/server";
import { disabledFeature, FlagSnapshot } from "@repo/data/feature-flags";

/** y-partykit installs its own listeners. Gate before its decoder and before sends. */
export function gatePageConnection(
  connection: Party.Connection,
  read: () => Promise<FlagSnapshot>,
): Party.Connection {
  let incoming = Promise.resolve();
  let outgoing = Promise.resolve();
  return new Proxy(connection, {
    get(target, property) {
      if (property === "addEventListener") {
        return (
          type: string,
          listener: (event: unknown) => void,
          ...options: any[]
        ) => {
          if (type !== "message")
            return (target.addEventListener as any)(type, listener, ...options);
          target.addEventListener("message", (event) => {
            incoming = incoming
              .then(async () => {
                if (!disabledFeature((await read()).flags, ["pages"]))
                  listener(event);
              })
              .catch(() => {});
          });
        };
      }
      if (property === "send") {
        return (message: string | ArrayBuffer | ArrayBufferView) => {
          outgoing = outgoing
            .then(async () => {
              if (!disabledFeature((await read()).flags, ["pages"]))
                target.send(message);
            })
            .catch(() => {});
        };
      }
      const value = Reflect.get(target, property, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}
