# Discussions & Messaging — design

Companion to [specification](spec.md). The following UX is transposed from the same source revision without changing behavior.

### Experience

Discussion threads present posts, questions, and polls as distinct content types while keeping comments and answers connected to their parent item. Rooms present an ordered message stream for text, media/file messages, and polls. The existing Wodge visual direction remains the starting point.

### Thread journeys

A person with view access can browse a thread and open an item with its replies. A person with edit access can choose a post, question, or poll and can add comments or answers. The author and edited state are visible on content. Authors can reach their own edit and delete actions while authorized.
A question shows whether it is open or resolved. The author can resolve or reopen it; a resolved question makes the answer composer unavailable and explains why. A member with Manage discussions can take those actions for another person's question when they can access the thread.

### Poll journey

A viewer can select one option on an open poll, see their recorded choice, and retract or change it while voting remains open. A closed poll shows its status and retained results without voting controls. The poll author and an eligible Manage discussions holder can close voting. Poll state and choices remain understandable without relying on color alone.

### Room journey

A room viewer can follow its message stream and vote in open polls. An editor can send text, media/file messages, and polls. The stream distinguishes message type, sender, and edited state. Authors can edit or delete their own messages while authorized. A Manage discussions holder with room access can remove another person's message.

### Authority and feedback

A person's controls reflect their current view/edit access and any Manage discussions grant. Having workspace administrator status does not imply access to a room or thread; the workspace owner bypasses these restrictions. When access changes, the interface stops offering unavailable actions and explains denied attempts. Connected-agent actions display the agreed member-via-agent attribution.

### Shared UI patterns and accessibility

Composers, polls, item actions, media/file attachments, and question-state controls are keyboard operable and labelled for assistive technology. Sending, upload, voting, and destructive actions provide clear progress and error feedback. Text labels accompany status and role cues.

### References

Behavior is defined in the companion specification, with access rules in the [Team Roles and Access Feature Plan](../team-roles-access/spec.md) and domain context in the [Domain Model](../../architecture/domain-model.md).

## Engineering boundaries

Use the [shared architecture](../../architecture/overview.md), [domain model](../../architecture/domain-model.md), [security rules](../../architecture/security.md), [quality requirements](../../architecture/non-functional-requirements.md), [stack](../../architecture/tech-stack.md), and [testing strategy](../../development/testing-strategy.md). These are migrated shared decisions, not newly invented feature contracts. HTTP, synchronization and MCP paths must preserve the same authoritative product rules where applicable.

Detailed schemas, endpoint contracts and implementation patterns not settled by those sources remain implementation decisions. The owner authors repository agent instructions; this migration does not generate `AGENTS.md`.

## Prototypes and evidence

The inspected Linear documents contain written UX, not a standalone executable prototype. No prototype asset has been invented or an empty prototypes directory created. Existing capstone screens/code are implementation evidence and may differ from the revival specification. The repository walkthrough remains linked from the root README.

## Delivery and operation

Detailed work and evidence remain in the existing Linear project. Shared [CI/CD](../../operations/ci-cd.md), [deployment coordination](../../operations/runbooks/revival-deployment.md), [release policy](../../operations/release-policy.md), and [maintenance guidance](../../operations/maintenance.md) apply. Any additional feature rollout or migration requirement needs explicit coordination; lack of a feature deployment file does not assert operational readiness.

## Source and revision

- Migrated from [Discussions & Messaging](https://linear.app/amr21/document/discussions-and-messaging-d33671c853b7), document ID `0fe85f00-f9f4-4a8f-917e-86fc478931d9`.
- Source revision: 2026-10-06T23:58:41.168Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
