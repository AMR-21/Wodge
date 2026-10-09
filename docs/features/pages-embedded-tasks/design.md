# Pages & Embedded Tasks — design

> **Migration revision approved.** User approved `migration-draft-1` in this chat on 2026-10-09. Historical source knowledge is preserved; this file does not establish implementation, runtime validation, deployment, or release completion.

Companion to [specification](spec.md). The following UX is transposed from the same source revision without changing behavior.

### Experience

A page presents shared writing and an optional task view in one place. Core formatting remains easy to discover. The existing Wodge visual direction is the starting point, with usability improvements to editing, task controls, and collaboration feedback.

### Page editing journey

A viewer reads the page without editing controls. An editor can create headings, paragraphs, lists and checklists, links, images, tables, and code. An editor can attach files and arrange links as a shared resource page; viewers can open or download those resources within page access. The interface shows when collaborators are present and makes the current page's edit state clear. Locally available editing remains usable through a connection loss; reconnection and any unsent or failed change are communicated without discarding the person's work.
Advanced layout, when available, appears alongside the core editor without making it necessary for ordinary writing. Multiple columns and a table of contents are enhancement candidates, not required controls.

### Embedded task journey

A page has one task collection. Its embedded task block can switch between table and Kanban without changing the underlying tasks. An editor can add and reorder columns, create and move tasks, change task details, and delete tasks or columns. The column supplies a task's current workflow state.
Task details expose title, overview, team-member assignees, low/medium/high priority, and due date or range. Both views provide filters for title, assignee, priority, and due date. Filtering changes the current view, not the stored tasks. Task movement and editing have keyboard-accessible controls as well as any drag interaction.
Removing the embedded task block explains that the task collection is preserved and can be shown again. Deleting the page has a separate confirmation that makes loss of its text and tasks clear.

### Permissions and collaboration

Page view and edit access applies equally to rich text and tasks. Workspace administrator status does not appear as a page-access grant, while the owner can access the page. Assignment controls list current members of the page's team. If a person leaves the team, their task assignments disappear while the tasks remain. Agent-made changes display the agreed attribution.

### Shared UI patterns and accessibility

Formatting controls, task tables, Kanban columns, filters, assignee selection, and confirmations have accessible names and keyboard paths. Status, priority, presence, and synchronization feedback use text as well as visual cues. Empty task views and denied actions explain what happened.

### References

Behavior is defined in the companion specification, with ownership and access in the [Domain Model](../../architecture/domain-model.md) and [Team Roles and Access Feature Plan](../team-roles-access/spec.md).

## Engineering boundaries

Use the [shared architecture](../../architecture/overview.md), [domain model](../../architecture/domain-model.md), [security rules](../../architecture/security.md), [quality requirements](../../architecture/non-functional-requirements.md), [stack](../../architecture/tech-stack.md), and [testing strategy](../../development/testing-strategy.md). These are migrated shared decisions, not newly invented feature contracts. HTTP, synchronization and MCP paths must preserve the same authoritative product rules where applicable.

Detailed schemas, endpoint contracts and implementation patterns not settled by those sources remain implementation decisions. The owner authors repository agent instructions; this migration does not generate `AGENTS.md`.

## Prototypes and evidence

The inspected Linear documents contain written UX, not a standalone executable prototype. No prototype asset has been invented or an empty prototypes directory created. Existing capstone screens/code are implementation evidence and may differ from the revival specification. The repository walkthrough remains linked from the root README.

## Delivery and operation

Detailed work and evidence remain in the existing Linear project. Shared [CI/CD](../../operations/ci-cd.md), [deployment coordination](../../operations/runbooks/revival-deployment.md), [release policy](../../operations/release-policy.md), and [maintenance guidance](../../operations/maintenance.md) apply. Any additional feature rollout or migration requirement needs explicit coordination; lack of a feature deployment file does not assert operational readiness.

## Source and revision

- Migrated from [Pages & Embedded Tasks](https://linear.app/amr21/document/pages-and-embedded-tasks-b6f379a38493), document ID `f82cb4ec-aaae-4882-a5e0-49cd9fbf501a`.
- Source revision: 2026-10-06T23:59:16.461Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
