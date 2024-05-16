import * as React from "react";
import type { Participant } from "livekit-client";
import { Track } from "livekit-client";
import type {
  ParticipantClickEvent,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-core";
import {
  isTrackReference,
  isTrackReferencePinned,
} from "@livekit/components-core";
import {
  AudioTrack,
  LockLockedIcon,
  ParticipantContext,
  TrackRefContext,
  useEnsureTrackRef,
  useFeatureContext,
  useFocusToggle,
  useIsEncrypted,
  useMaybeLayoutContext,
  useMaybeParticipantContext,
  useMaybeTrackRefContext,
  useParticipantTile,
  VideoTrack,
} from "@livekit/components-react";
import { Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMember } from "@/hooks/use-member";
import { SafeAvatar } from "@/components/safe-avatar";
import { TrackMutedIndicator } from "./track-muted-indicator";
import { Button } from "@/components/ui/button";

/**
 * The `ParticipantContextIfNeeded` component only creates a `ParticipantContext`
 * if there is no `ParticipantContext` already.
 * @example
 * ```tsx
 * <ParticipantContextIfNeeded participant={trackReference.participant}>
 *  ...
 * </ParticipantContextIfNeeded>
 * ```
 * @public
 */
export function ParticipantContextIfNeeded(
  props: React.PropsWithChildren<{
    participant?: Participant;
  }>,
) {
  const hasContext = !!useMaybeParticipantContext();
  return props.participant && !hasContext ? (
    <ParticipantContext.Provider value={props.participant}>
      {props.children}
    </ParticipantContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

/**
 * Only create a `TrackRefContext` if there is no `TrackRefContext` already.
 */
function TrackRefContextIfNeeded(
  props: React.PropsWithChildren<{
    trackRef?: TrackReferenceOrPlaceholder;
  }>,
) {
  const hasContext = !!useMaybeTrackRefContext();
  return props.trackRef && !hasContext ? (
    <TrackRefContext.Provider value={props.trackRef}>
      {props.children}
    </TrackRefContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

/** @public */
export interface ParticipantTileProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The track reference to display. */
  trackRef?: TrackReferenceOrPlaceholder;
  disableSpeakingIndicator?: boolean;

  onParticipantClick?: (event: ParticipantClickEvent) => void;
}

/**
 * The `ParticipantTile` component is the base utility wrapper for displaying a visual representation of a participant.
 * This component can be used as a child of the `TrackLoop` component or by passing a track reference as property.
 *
 * @example Using the `ParticipantTile` component with a track reference:
 * ```tsx
 * <ParticipantTile trackRef={trackRef} />
 * ```
 * @example Using the `ParticipantTile` component as a child of the `TrackLoop` component:
 * ```tsx
 * <TrackLoop>
 *  <ParticipantTile />
 * </TrackLoop>
 * ```
 * @public
 */
export const ParticipantTile = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  ParticipantTileProps
>(function ParticipantTile(
  {
    trackRef,
    children,
    onParticipantClick,
    disableSpeakingIndicator,

    ...htmlProps
  }: ParticipantTileProps,
  ref,
) {
  const trackReference = useEnsureTrackRef(trackRef);

  const { elementProps } = useParticipantTile<HTMLDivElement>({
    htmlProps,
    disableSpeakingIndicator,
    onParticipantClick,
    trackRef: trackReference,
  });
  const isEncrypted = useIsEncrypted(trackReference.participant);
  const layoutContext = useMaybeLayoutContext();

  const autoManageSubscription = useFeatureContext()?.autoSubscription;

  const handleSubscribe = React.useCallback(
    (subscribed: boolean) => {
      if (
        trackReference.source &&
        !subscribed &&
        layoutContext &&
        layoutContext.pin.dispatch &&
        isTrackReferencePinned(trackReference, layoutContext.pin.state)
      ) {
        layoutContext.pin.dispatch({ msg: "clear_pin" });
      }
    },
    [trackReference, layoutContext],
  );

  const memberId = trackReference.participant?.identity;
  const memberUsername = trackReference.participant?.name;

  const { member } = useMember(memberId);

  const isScreenSharing = trackReference.source === Track.Source.ScreenShare;
  const isCamSharing = trackReference.participant.isCameraEnabled;

  const { inFocus } = useFocusToggle({
    trackRef,
    props: {},
  });

  return (
    <div
      ref={ref}
      style={
        {
          position: "relative",

          "--lk-speaking-indicator-width": "2.5px",
        } as React.CSSProperties
      }
      {...elementProps}
      className={cn(
        // elementProps.className,
        "group/focus flex cursor-pointer flex-col gap-[0.375rem] overflow-hidden  rounded-md  border-2 bg-background  opacity-0 data-[lk-video-muted=true]:opacity-100 data-[lk-video-source=camera]:opacity-100 data-[lk-video-source=screen_share]:opacity-100",
        (isScreenSharing || isCamSharing) && "opacity-100",
        trackReference.participant.isSpeaking &&
          "border-green-500 dark:border-green-600",
      )}
      onClick={(e) => {
        elementProps.onClick?.(e);
        if (inFocus) {
          layoutContext?.pin.dispatch?.({
            msg: "clear_pin",
          });
        } else {
          layoutContext?.pin.dispatch?.({
            msg: "set_pin",
            trackReference,
          });
        }
      }}
    >
      <TrackRefContextIfNeeded trackRef={trackReference}>
        <ParticipantContextIfNeeded participant={trackReference.participant}>
          {children ?? (
            <>
              {isTrackReference(trackReference) &&
              (trackReference.publication?.kind === "video" ||
                trackReference.source === Track.Source.Camera ||
                trackReference.source === Track.Source.ScreenShare) ? (
                <VideoTrack
                  trackRef={trackReference}
                  onSubscriptionStatusChanged={handleSubscribe}
                  manageSubscription={autoManageSubscription}
                />
              ) : (
                isTrackReference(trackReference) && (
                  <AudioTrack
                    trackRef={trackReference}
                    onSubscriptionStatusChanged={handleSubscribe}
                  />
                )
              )}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-background opacity-100 transition-opacity",
                  (isScreenSharing || isCamSharing) && "opacity-0",
                )}
              >
                <SafeAvatar
                  src={member?.avatar}
                  fallback={member?.username}
                  className="h-20 w-20"
                />
              </div>
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between gap-2 p-1">
                <div className="flex items-center rounded-md bg-dim/50 p-1">
                  {trackReference.source === Track.Source.Camera ? (
                    <>
                      {isEncrypted && (
                        <LockLockedIcon style={{ marginRight: "0.25rem" }} />
                      )}
                      <TrackMutedIndicator
                        trackRef={{
                          participant: trackReference.participant,
                          source: Track.Source.Microphone,
                        }}
                        show={"muted"}
                      />
                      <span className="text-sm">{member?.displayName}</span>
                    </>
                  ) : (
                    <>
                      <Monitor className="mr-1 h-4 w-4" />
                      <span className="text-sm">{member?.displayName}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </ParticipantContextIfNeeded>
      </TrackRefContextIfNeeded>
    </div>
  );
});
