import type * as Party from "partykit/server";
import RoomParty from "./room-party";
import { AccessToken } from "livekit-server-sdk";
import { UserType } from "@repo/data";
import { json } from "../lib/http-utils";

export async function generateCallToken(req: Party.Request, party: RoomParty) {
  // if this room doesn't exist, it'll be automatically created when the first
  // client joins
  const roomName = party.room.id;
  // identifier to be used for participant.
  // it's available as LocalParticipant.identity with livekit-client SDK

  const user = JSON.parse(req.headers.get("x-user-data")!) as UserType;
  const participantName = user.username!;

  const at = new AccessToken(
    party.room.env.LIVEKIT_API_KEY as string,
    party.room.env.LIVEKIT_API_SECRET as string,
    {
      identity: participantName,
      // token to expire after 10 minutes
      ttl: "10m",
    }
  );
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  const jwt = await at.toJwt();
  return json({ token: jwt });
}
