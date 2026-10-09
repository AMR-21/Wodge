# Room Calls — specification

Status distinction: the source describes approved revival intent. Related capstone code exists, but compliance with these changed rules has not been demonstrated. This migration proposes document organization only.

### User context

As a member who can view a room, I can join its live call to talk, show video, or share my screen with other participants.

### Goals and scope

Room calls provide live audio, video, and screen sharing within an existing room. A room's view access governs call participation and media publishing; its edit access continues to govern messages and polls. The call remains available while participants navigate Wodge.

### Behavior

1. A room has at most one active call. The first authorized person to join starts it, other authorized viewers join the same call, and the call ends when its last participant leaves.
2. A person who can view the room may start or join its call, receive media, and publish their own microphone, camera, or screen. Room edit access is not required for calls. The workspace owner retains the agreed access bypass; administrators otherwise follow team membership and room grants.
3. Microphone, camera, and screen sharing are off when a person joins. Publishing begins only after that person enables the relevant control. Participants can turn their own media on or off, choose available devices, and leave the call.
4. Participants see who is in the call and the state of each participant's published media. A participant can focus a screen share and return to the participant view.
5. A call stays connected while its participant navigates elsewhere in Wodge. Closing the expanded call view keeps the connection and exposes compact controls.
6. When a participant tries to join a different room call, Wodge explains that the current call will disconnect. Confirming leaves the current call before joining the other; canceling keeps the current call.
7. Losing room view access or team/workspace membership ends participation and stops media publishing. Deleting the room ends its call.
8. Connection and device failures are visible to the participant. A lost connection does not appear as an active, publishing call.
9. The workspace's plan limits one call to 4/12 participants and provides 60/300 participant-minutes per UTC month for Free/Demo Pro. The call warns near exhaustion and ends when the monthly allowance is spent. The limits page shows usage and reset.

### Out of scope

This feature has no recording, transcripts, call history, participant removal, end-for-everyone action, or agent attendance.

### Acceptance criteria

* **AC-01:** A room viewer can start or join its call and publish audio, video, or screen sharing without room edit access.
* **AC-02:** A non-owner without room view access cannot join or publish. Administrator status alone does not grant access.
* **AC-03:** Every participant joins with microphone, camera, and screen sharing off; each medium starts only through that participant's action.
* **AC-04:** All participants in a room share one active call, which ends when the last participant leaves.
* **AC-05:** Participants can control only their own media and can leave without ending the call for others.
* **AC-06:** Navigating elsewhere in Wodge or closing the expanded call view leaves the call connected, with compact controls available.
* **AC-07:** Joining another room call requires a confirmation that the current connection will end. Cancel retains the current call; confirm switches calls in that order.
* **AC-08:** Revoked room or team/workspace access disconnects the affected participant and stops their media; deleting the room ends its call.
* **AC-09:** Call, participant, media, connection, and device states are understandable in the interface, including failure and reconnection states.
* **AC-10:** Recording, transcripts, call history, moderation controls over others, and agent attendance are absent from this feature.
* **AC-11:** Call admission honors the 4/12 participant plan cap; monthly usage counts each connected participant and resets at the UTC month boundary. Exhaustion warns, ends the call, and blocks a new call until reset or plan change.

### Domain relationship

The room owns its active call. Call access follows room view permission, while room messaging follows room edit permission. The call's active state depends on connected authorized participants and ends when none remain. Each participant owns their published media controls.

### Relevant quality and security requirements

Call entry and continued participation honor current room access. A change in access ends the affected connection promptly. Device permission is requested only when the participant enables a medium. The interface makes connection and media state visible through text and accessible controls.

### Dependencies and references

[Product Definition](../../product/overview.md), [Domain Model](../../architecture/domain-model.md), [Teams & Shared Spaces](../teams-shared-spaces/spec.md), [Team Roles & Access](../team-roles-access/spec.md), and [Discussions & Messaging](../discussions-messaging/spec.md) define the containing room and its access rules. [Wodge Room Calls in Linear](<https://linear.app/amr21/project/wodge-room-calls-5ebfd26679db>) tracks delivery.

### Validation expectations

Validation covers first and later joins, the last participant leaving, viewer-versus-editor access, owner and administrator distinctions, self-controls, access revocation, room deletion, navigation, switching confirmation, device denial, connection loss, and accessibility of status and controls.

## Document responsibilities

[Design](design.md) contains the migrated UX and shared engineering boundaries. Acceptance identifiers such as `AC-01` remain scoped to this feature; they are not renumbered. Detailed implementation, validation, deployment and maintenance work remains in the [existing delivery project](https://linear.app/amr21/project/wodge-room-calls-5ebfd26679db).

## Source and revision

- Migrated from [Room Calls](https://linear.app/amr21/document/room-calls-1db9fa3b4d87), document ID `dbd27a6f-c380-4496-822a-03bc412bd913`.
- Source revision: 2026-10-06T23:58:37.250Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
