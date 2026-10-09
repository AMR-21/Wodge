# Information Architecture

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

## Workspace entry

The signed-in workspace list exposes current memberships and workspace creation. Invitation journeys return to the invitation after sign-in or signup. Joining or creating a workspace leads into General.

## Workspace navigation

Accessible teams appear within the current workspace. General is permanently present. Workspace settings contain membership/invitations, workspace controls, plan usage, and the workspace agent-access setting according to authority.

## Team navigation

Pages appear within nested page folders. Rooms and discussion threads belong to the team. Content navigation exposes accessible resources. Authorized management controls remain reachable without exposing content the manager cannot view.

## Content surfaces

* **Page:** rich text, links/files, and an optional table or Kanban view of its one task collection.
* **Thread:** posts, questions, polls, and connected replies.
* **Room:** ordered messages, media/files, polls, and call entry.
* **Call:** expanded participant/media controls plus compact controls that persist while navigating.

## Member connections

Member-facing agent connections show identity and revocation. This is separate from the workspace-wide agent-access setting.

## Sources

[Workspace Setup & Membership](../features/workspace-membership/spec.md)
[Teams & Shared Spaces](../features/teams-shared-spaces/spec.md)
[Pages & Embedded Tasks](../features/pages-embedded-tasks/spec.md)
[Discussions & Messaging](../features/discussions-messaging/spec.md)
[Room Calls](../features/room-calls/spec.md)
[Agent Access](../features/agent-access/spec.md)

## Source and revision

- Migrated from [Information Architecture](https://linear.app/amr21/document/information-architecture-dd5a4835beab), document ID `2e85045d-216e-41c7-88b5-5f64b6711f01`.
- Source revision: 2026-10-06T23:57:10.534Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
