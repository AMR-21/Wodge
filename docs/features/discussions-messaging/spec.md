# Discussions & Messaging — specification

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

Status distinction: the source describes approved revival intent. Related capstone code exists, but compliance with these changed rules has not been demonstrated. This migration proposes document organization only.

### User context

Team members use discussion threads for posts, questions, comments, and polls. They use rooms for live messages, attachments, and polls. Participation follows each thread or room's role-based access.

### Goals and scope

This feature covers publishing and reading thread content, Q&A resolution, room text and media/file messages, polls in both settings, authorship actions, and delegated discussion management. Live audio/video calls are specified separately.

### Behavior

1. A person with a thread or room's view access can read its content. A person with edit access can publish any supported thread item type—post, question, or poll—and add comments or answers. In a room, an editor can send text, media/file messages, and polls.
2. Authors who retain the required space access can edit or delete their own posts, comments, answers, and room messages. Deleting a room message also removes its attached media or file from that message. Authorship and edited state remain visible. Removing someone from a team or revoking space access ends their ability to act there.
3. A question's author can resolve or reopen it. Resolution stops new answers until the question is reopened. A poll's author can close voting.
4. A person with view access can cast one vote per open poll. They can retract or change their vote while voting remains open. Closing voting prevents new or changed votes while retaining results.
5. A team role can grant Manage discussions. A team member with this permission and access to the relevant thread or room can resolve or reopen questions, close polls, and remove another person's discussion content there. The grant does not itself provide content view/edit access and is not a built-in Moderator role.
6. The workspace owner bypasses team and role restrictions. Workspace administration alone grants no discussion-content access. Direct member and connected-agent thread actions follow the same effective access rules; room messaging remains outside the initial agent scope.

### Out of scope

This plan does not cover call participation, recording, notifications, direct messages, search, or a built-in Moderator role. It does not introduce hosted AI assistance.

### Acceptance criteria

* **AC-01:** Only people with view access can read a thread or room; a non-owner without team membership or a granting role cannot read it.
* **AC-02:** A thread editor can create posts, questions, polls, comments, and answers; a viewer without edit access cannot publish them.
* **AC-03:** A room editor can send text, media/file messages, and polls; a viewer without edit access cannot send them.
* **AC-04:** An authorized author can edit or delete their own content; another member cannot edit it merely because they can read or write in the space.
* **AC-05:** A question's author can resolve and reopen it. New answers are blocked while it is resolved.
* **AC-06:** A viewer can vote once per open poll, retract or change that vote while open, and see the retained result after voting closes.
* **AC-07:** An author can close their poll. Once closed, the poll accepts no new, retracted, or changed votes.
* **AC-08:** A member with Manage discussions and access to the relevant space can resolve or reopen questions, close polls, and remove another person's content. This permission alone grants no content access.
* **AC-09:** Workspace administrator status alone does not bypass thread or room grants; the owner bypasses restrictions.
* **AC-10:** Connected agents use the member's permissions for supported thread actions, with agent attribution as defined in Agent Access. Room messaging is outside their initial scope.

### Domain and UX relationship

Posts, questions, and polls belong to threads; comments and answers belong to their parent item. Room messages and polls belong to rooms. Votes belong to a poll and voter. Q&A resolution and poll closure are visible states. Manage discussions is a grant in a team role and applies only within an accessible space.

### Relevant quality and security requirements

Authorization applies on reads and writes, including direct backend and connected-agent requests. The author and voter identity of an action cannot be supplied by another member. Content permission changes affect subsequent actions. Media and file handling must respect the room's access boundary; technical storage and delivery design belongs to later engineering artifacts.

### Dependencies and references

This plan follows the approved [Product Definition](../../product/overview.md), [Domain Model](../../architecture/domain-model.md), [Team Roles and Access Feature Plan](../team-roles-access/spec.md), [Teams and Shared Spaces Feature Plan](../teams-shared-spaces/spec.md), and [Agent Access Feature Plan](../agent-access/spec.md).

### Validation expectations

Validation covers view/edit separation, all thread item types, room text and media/files, own-item actions, Q&A resolve/reopen, poll voting and closure, Manage discussions in accessible spaces, owner/admin distinctions, access revocation, and equivalent agent restrictions.

## Document responsibilities

[Design](design.md) contains the migrated UX and shared engineering boundaries. Acceptance identifiers such as `AC-01` remain scoped to this feature; they are not renumbered. Detailed implementation, validation, deployment and maintenance work remains in the [existing delivery project](https://linear.app/amr21/project/wodge-discussions-and-room-messaging-75e7b5e2ac83).

## Historical approval evidence

- [Wodge — Discussions and Room Messaging UX](https://linear.app/amr21/document/wodge-discussions-and-room-messaging-ux-53eebe1dbb69) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:19:05.534Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.
- [Wodge — Discussions and Room Messaging Feature Plan](https://linear.app/amr21/document/wodge-discussions-and-room-messaging-feature-plan-81454232051b) states “Status: Approved” and redirects to a former Notion source. Its source update is 2026-09-27T00:19:01.340Z. This is a preserved approval claim; no independent signed revision or approving discussion was returned.

## Source and revision

- Migrated from [Discussions & Messaging](https://linear.app/amr21/document/discussions-and-messaging-d33671c853b7), document ID `0fe85f00-f9f4-4a8f-917e-86fc478931d9`.
- Source revision: 2026-10-06T23:58:41.168Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
