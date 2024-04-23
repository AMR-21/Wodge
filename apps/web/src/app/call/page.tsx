"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { env } from "@repo/env";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

export default function RoomPage() {
  // TODO: get user input for room and name

  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();

  const { workspaceId } = useCurrentWorkspace();
  //eYQ9u_WpdIdm06ZSWqEXH/ BnFT2UW9hR663yok / bj5LBo8btDv6A7tbrVHPx;
  const [token, setToken] = useState("");

  useEffect(() => {
    // if (workspaceId && teamId && channelId)
    (async () => {
      try {
        const resp = await fetch(
          `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/room/${"bj5LBo8btDv6A7tbrVHPx"}/call-token`,
          {
            headers: {
              "x-workspace-id": "eYQ9u_WpdIdm06ZSWqEXH",
              "x-team-id": "BnFT2UW9hR663yok",
            },
            credentials: "include",
          },
        );
        const data = await resp.json<{
          token: string;
        }>();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
    // }, [teamId, workspaceId, channelId]);
  }, []);

  if (token === "") {
    return <div>Getting token...</div>;
  }

  console.log(token);
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
      {/* <VideoConference /> */}
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Microphone, withPlaceholder: true },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
